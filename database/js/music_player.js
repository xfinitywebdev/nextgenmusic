
function loadContents() {
    var infoFile = fetch("database/artist/rtm/albums/the return/the hawk/info.json")
    fetch('database/artist/rtm/albums/the return/the hawk/info.json')
  .then(response => response.json())
  .then(data => {
    // Do something with the JSON data
    console.log(data);
  })
  .catch(error => {
    // Handle any errors
    console.error(error);
  });
}