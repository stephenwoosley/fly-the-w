$(".scrape").on("click", function(event) {
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).done(function(data){
    console.log(data);
    console.log("maybe scraped?")
  })
});