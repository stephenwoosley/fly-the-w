$(".scrape-cubs-dot-com").on("click", function (event) {
  $.ajax({
    method: "GET",
    url: "/scrape-cubs-dot-com"
  }).done(function (data) {
    console.log(data);
    console.log("Scraped!")
  })
});

$(".scrape-cubbies-crib").on("click", function (event) {
  $.ajax({
    method: "GET",
    url: "/scrape-cubbies-crib"
  }).done(function (data) {
    console.log(data);
    console.log("Scraped!")
  })
});

$(".populate").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/articles"
  }).done(function (data) {
    console.log("populate clicked!")
    console.log(data);
    for (article in data) {
      let image = "";
      if (data[article].imageOne) {
        image = data[article].imageOne;
      }
      else {
        image = data[article].imageTwo;
      }
      $(".results").append(
        "<li class='single-article'>" +
        "<img src=" + image + ">" +
        "<br>" +
        "<a href=" + data[article].link + ">" + data[article].title + "</a>" +
        "<hr>" +
        "</li>");
    }

  })
});

$(document).ready(function() {
  $.ajax({
    method: "GET",
    url: "/facts"
  }).done(function(data) {

    function randomIntFromInterval(min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    let randomFact = data[randomIntFromInterval(1,107)];
    
    console.log(randomFact);

    $(".fact-box").html(randomFact.question);

    // for(fact in data) {
    //   console.log (data[fact].question);
    // }
  })
})

$(".scrape-facts").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape-facts"
  }).done(function (data) {
    console.log("fact scraper activated!")
    console.log(data);
  })
});

