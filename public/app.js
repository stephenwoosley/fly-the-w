$(".scrape").on("click", function (event) {
  $.ajax({
    method: "GET",
    url: "/scrape"
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
      $(".results").append(
        "<li class='single-article'>" +
        "<img src=" + data[article].image + ">" +
        "<br>" +
        "<a href=" + data[article].link + ">" + data[article].title + "</a>" +
        "<hr>" +
        "</li>");
    }

  })
});

$(".scrape-facts").on("click", function () {
  $.ajax({
    method: "GET",
    url: "/scrape-facts"
  }).done(function (data) {
    console.log("fact scraper activated!")
    console.log(data);
  })
});

