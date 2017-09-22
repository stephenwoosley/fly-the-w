
// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

var Article = require("./models/Article.js");

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scraper"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send("Hello world");
});

// This route will retrieve all data
app.get("/all", function(req, res) {
  db.scraper.find({}, function(error, found) {
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

// TODO -----------
// - Create a bootstrap front-end to display articles
// - Grab articles at the click of a button
// - Grab articles from more than one source
// - Grab articles from more than once source and aggregate articles together
// - Integrate and display images from the articles
// - Capture first paragraph or teaser of articles
// - Find random cubs fact of the day
// - Allow users to choose team eventually???
// - Create mongoose schema for articles (image, title, link, short descr)
//<script type="text/javascript" src="https://widgets.sports-reference.com/wg.fcgi?script=br_standings&amp;params=br_standings_lg:NL,br_standings_div:C,br_standings_css:1&amp;css=1"></script>

//scrape route
app.get("/scrape", function(req, res) {
  console.log("scraping ... ");
  var getData = function() {
    console.log("getting data ... ");
    var results = [];
    request("http://m.cubs.mlb.com/news/", function(error, response, html) {
        console.log("making a request ... ");
        // Load the HTML into cheerio
        var $ = cheerio.load(html);
        // for each article in the list, grab the title & html link        
        $(".article-list").each(function(i, element) {
            var link = "http://m.cubs.mlb.com/" + $(element).find("a").attr("href");
            var title = $(element).find("a").find("hgroup").find("h2").text();
            // store details in the db
            db.scraper.insert({"title": title, "link": link})       
            // results.push({ title: title, link: link });
            console.log("found an entry!");
            if(i > 30) {return false};
        }); 
        console.log ("...")
        console.log("done searching!")
        console.log("completed scrape.")
    });
  }

getData();
  
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
