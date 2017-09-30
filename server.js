// TODO -----------
// - DONE Create a bootstrap front-end to display articles
// - DONE Grab articles at the click of a button
// - Grab articles from 4 sources and populate in 4 different windows
// - DONE Integrate and display images from the articles
// - Find random cubs fact of the day
// - Allow users to choose team eventually???
// - DONE Create mongoose schema for articles (image, title, link, short descr)
// - Saved route for user's saved articles
//   <script type="text/javascript" src="https://widgets.sports-reference.com/wg.fcgi?script=br_standings&amp;params=br_standings_lg:NL,br_standings_div:C,br_standings_css:1&amp;css=1"></script>

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var path = require("path");
var Article = require("./models/Article.js");
var Fact = require("./models/Fact.js");
var Facts = require("./models/Facts.json");

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// configuring middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

// Database configuration
mongoose.connect("mongodb://localhost/fly-the-w");
var db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// ******** ROUTES ******** //

// MAIN ROUTE
app.get("/", function(req, res) {
  res.send("Hello world");
});

// STANDINGS ROUTE
app.get("/standings", function(req, res) {
  res.sendFile(path.join(__dirname, "./public/standings.html"));
});

// GET ALL ARTICLES
app.get("/articles", function(req, res) {
  Article.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    } else {
      // Otherwise, send the result of this query to the browser
      res.json(found);
    }
  });
});

app.get("/facts", function(req, res) {
    res.json(Facts);
})

// SCRAPE CUBS.COM ROUTE
app.get("/scrape-cubs-dot-com", function(req, res) {
  console.log("scraping cubs.com ... ");

  request("http://m.cubs.mlb.com/news/", function(error, response, html) {
    console.log("making a request ... ");

    // Load the HTML into cheerio
    var $ = cheerio.load(html);

    // for each article in the list, grab the title & html link
    $("li").each(function(i, element) {
      var result = {};

      result.source = "cubs.com";
      result.link =
        "http://m.cubs.mlb.com/" +
        $(element)
          .find("a")
          .attr("href");
      result.title = $(element)
        .find("a")
        .find("hgroup")
        .find("h2")
        .text();
      result.imageOne =
        "http://m.cubs.mlb.com" +
        $(element)
          .find("a")
          .find("img")
          .attr("data-src");

      var entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
    console.log("completed cubs.com scrape.");
  });
  res.send("Scrape Complete - Cubs.com");
});

app.get("/scrape-cubbies-crib", function(req, res) {
  console.log("scraping cubbies crib ... ");

  request("https://cubbiescrib.com/", function(error, response, html) {
    console.log("making a request to cubbiescrib.com ... ");

    // Load the HTML into cheerio
    var $ = cheerio.load(html);

    // for each article in the list, grab the title & html link
    $(".article").each(function(i, element) {
      let result = {};

      let title = $(element)
        .find(".title")
        .find("a")
        .attr("title");

      let link = $(element)
        .find(".title")
        .find("a")
        .attr("href");

      result.source = "cubbies-crib";
      result.link = link;
      result.title = title;
      result.imageOne =
        $(element)
          .find(".article-image")
          .attr("style");
      result.imageTwo =
      $(element)
        .find("a")
        .attr("data-original");

      let entry = new Article(result);

      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log(doc);
        }
      });
    });
    console.log("completed scrape.");
  });
  res.send("Scrape Complete");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
