$(".scrape").on("click", function(event) {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data){
    console.log(data);
    console.log("maybe scraped?")
  })
});

$(".populate").on("click", function(){
  $.ajax({
    method: "GET",
    url: "/articles"
  }).done(function(data){
    console.log("populate clicked!")
    console.log(data);
    for (article in data) {
      $(".results").append(
        "<li class='single-article'>"+
          "Title: " + data[article].title +
          "<hr>"+
          "Link: " + data[article].link +
          "<hr>"+
        "</li>");
    }

  })
})


