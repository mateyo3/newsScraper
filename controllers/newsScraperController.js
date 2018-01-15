var express = require("express");
var mongojs = require("mongojs");
var cheerio = require("cheerio");
var request = require("request");

var router = express.Router();


// Main route to display index.handlebars
router.get("/", function(req, res) {
  res.render("index");
});


// Database configuration
var databaseUrl = "scraper";
var collections = ["scraperData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);

// mongojs errors
db.on("error", function(error) {
  console.log("Database Error:", error);
});


//ROUTES

router.get("/", function(req, res) {
  res.send(index.handlebars);
});


// Scrape data from one site and place it into the mongodb db
router.get("/home", function(req, res) {
  // Make a request for the news section of ycombinator
  request("http://www.latimes.com/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $("h3.trb_outfit_relatedListTitle").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        db.scraperData.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log("DATA HAS BEEN INSERTED INTO MONGO DATABASE\n" + 
                        "*****************************\n\n" + inserted);
            // res.send(inserted);
          }
        });
      }
    });
  });

  // Retrieve data from the db
router.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scraperData.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
      console.log("route /all was successful in finding collection");
    }
  });
});


  // Send a "Scrape Complete" message to the browser
  // res.send("index", inserted);
  console.log("LA Times has been scraped");

});


// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every thread name and link\n" +
            "from LA Times webdev board:" +
            "\n***********************************\n");

// Making a request for the LA Times "webdev" board. The page's HTML is passed as the callback's third argument
request("http://www.latimes.com/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
  var results = [];

  // With cheerio, find each h3-tag with the "trb_outfit_relatedListTitle" class
  // (i: iterator. element: the current element)
  $("h3.trb_outfit_relatedListTitle").each(function(i, element) {

    // Save the text of the element in a "title" variable
    var title = $(element).text();

    // In the currently selected element, look at its child elements (i.e., its a-tags),
    // then save the values for any "href" attributes that the child elements may have
    var link = $(element).children().attr("href");

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      link: link
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log("Data has been scraped");
});

// Export routes for server.js to use.
module.exports = router;