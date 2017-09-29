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
var Facts = require("./models/Facts.js");

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

// app.get("/scrape-facts", function(req, res) {
//   console.log("getting random facts...");

//   request(
//     "http://www.chicagotribune.com/sports/baseball/cubs/ct-108-things-every-cubs-fan-should-know-story.html",
//     function(error, response, html) {
//       console.log("making the fact of the day request...");

//       var $ = cheerio.load(html);

//       let facts = {question: "", answer: ""};
//       let fact_collection = []

//       let counter = 0; 
//       let counter1 = 0;

      // increment for each p element
      // $("p strong").each(function(i, element){
      //   counter ++;
      //   // console.log(`counter is ${counter}`)
      //   if($(element).text()) {
      //     facts.question = $(element).text();
      //     fact_collection.push(facts);
      //   }
      //   console.log(facts);
      // });

      // $("p").each(function(i, element){
      //   counter ++;
      //   // console.log(`counter is ${counter}`)
      //   if($(element).text()) {
      //     facts.answer = $(element).text();
      //     fact_collection.push(facts);
      //   }
      //   console.log(facts);
      // });

      // console.log(`COUNTER IS ${counter}`);
      // console.log(fact_collection);
      // $("p").each(function(i, element) {
      //   counter1 ++;
      //   let textToFilter = $(element).text();
      //     // console.log(`Paragraph Text: ${textToFilter}`);
      //   let first_char = textToFilter.slice(0, 1);
      //   if (isNaN(first_char) && !facts.body){
      //       fact_collection[counter].body = textToFilter;
      //     }
      // })


      // for (var i = 0; i < counter; i++) {
      //   facts.question = $("p").text();
      //   console.log(`NEW FACT!!!!!! {{{${facts.question}}}}`);
      // }



      // $("p").each(function(i, element) {
      //   let textToFilter = $(element).text();
      //   console.log(`Paragraph Text: ${textToFilter}`);
      //   // console.log(typeof(textToFilter))
      //   let first_char = textToFilter.slice(0, 1);

        //If first_char is a number, it's a Question/Title
        //Next .each iteration is a Description/Body

        // if first char is a number and there's no question text, make text the question
        // if(!isNaN(first_char) && !facts.question) {
        //   facts.question = textToFilter;
        // }
        // else if (isNaN(first_char) && !facts.body){
        //   facts.body = textToFilter;
        // }
        // else {
        //   console.log(`paragraph was something else on iteration ${i}`);
        // } 

        // if (isNaN(first_char) && !facts.body) {
        //   facts.body = textToFilter;
        // }
        // else if (!isNaN(first_char) && !facts.question) {
        //   facts.question = textToFilter;
        // }
        // else {
        //   facts.other = textToFilter;
        // }
        //do something
        // function assignParText(first_char, full_text, facts) {
        //   if (isNaN(first_char) && !first_char) {
        //     facts.body = full_text;
        //   }
        //   else if (!isNaN(first_char)){
        //     facts.question = full_text;
        //   }
        //   else {

        //   }
        // }
        // console.log(`First char is ${first_char}`);
        // facts.question = $(element)
        //   .find("strong")
        //   .text();
        // facts.body = $(element).text();

        // var fact = new Fact(facts);

        // fact.save(function(err, doc) {
        //   if (err) {
        //     console.log(err);
        //   }
        //   else{
        //     console.log(doc)
        //   }
        // })
      //   console.log(facts);
      //   console.log(i);
      // });
      
//     }
//   );
// });

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
      result.image =
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
      // store details in the db
      // db.scraper.insert({"title": title, "link": link})
      // results.push({ title: title, link: link });
      // console.log("found an entry!");
      // if(i > 30) {return false};
    });
    console.log("completed scrape.");
  });
  res.send("Scrape Complete");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
