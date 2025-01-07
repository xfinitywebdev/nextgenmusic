// Function to fetch JSON data and populate HTML elements
function populateFromJSON() {
    // Define the path to your JSON file (this could be a local or remote URL)
    const jsonData = {
        "songTitle": "The Hawk",
        "songArtist": "RTM",
        "songAlbum": "The Return",
        "trackNumber": "4/17",
        "songID": "0123456789"
    };
  
    // Iterate through the JSON data and assign values to HTML elements with matching IDs
    for (const key in jsonData) {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = jsonData[key];
      }
    }
  }
  
  // Wait for the DOM to be fully loaded before running the function
  document.addEventListener('DOMContentLoaded', () => {
    populateFromJSON();
  });
  