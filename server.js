// TODO -----------
// - DONE Create a bootstrap front-end to display articles
// - DONE Grab articles at the click of a button
// - Grab articles from more than once source and aggregate articles together
// - DONE Integrate and display images from the articles
// - N/A Capture first paragraph or teaser of articles
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

mongoose.Promise = Promise;

// Initialize Express
var app = express();

// configuring middleware
app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
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

// var databaseUrl = "scraper";
// var collections = ["scraper"];

// Hook mongojs configuration to the db variable
// var db = mongojs(databaseUrl, collections);
// db.on("error", function(error) {
//   console.log("Database Error:", error);
// });


// ******** ROUTES ******** //


// MAIN ROUTE
app.get("/", function(req, res) {
  res.send("Hello world");
});

app.get("/standings", function(req, res){
  res.sendFile(path.join(__dirname, "./public/standings.html"));
});

// GET ALL ARTICLES
app.get("/articles", function(req, res) {
  Article.find({}, function(error, found) {
    // Log any errors if the server encounters one
    if (error) {
      console.log(error);
    }
    // Otherwise, send the result of this query to the browser
    else {
      res.json(found);
    }
  });
})

// SCRAPE ROUTE
app.get("/scrape", function(req, res) {

  console.log("scraping ... ");

  request("http://m.cubs.mlb.com/news/", function(error, response, html) {

      console.log("making a request ... ");

      // Load the HTML into cheerio
      var $ = cheerio.load(html);

      // for each article in the list, grab the title & html link        
      $("li").each(function(i, element) {

        var result = {};

        result.link = "http://m.cubs.mlb.com/" + $(element).find("a").attr("href");
        result.title = $(element).find("a").find("hgroup").find("h2").text();
        result.image = "http://m.cubs.mlb.com" + $(element).find("a").find("img").attr("data-src");

        var entry = new Article(result);

        entry.save(function(err, doc) {
          if (err) {
            console.log(err);
          }
          else{
            console.log(doc)
          }
        })
        // store details in the db
        // db.scraper.insert({"title": title, "link": link})       
        // results.push({ title: title, link: link });
        // console.log("found an entry!");
        // if(i > 30) {return false};
      }); 
      console.log("completed scrape.")
  });
  res.send("Scrape Complete")
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
