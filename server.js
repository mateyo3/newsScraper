var cheerio = require("cheerio");
var request = require("request");
var bodyParser = require("body-parser");
var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");

var app = express();

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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
  console.log(results);
});