fetch('database/artist/rtm/releases/the return/the hawk/info.json')
  .then(response => response.json())
  .then(data => {
    for (const key in data) {
      const element = document.getElementById(key);
      if (element) {
        element.textContent = data[key];
      }
    }
  })
  .catch(error => console.error('Error fetching JSON data:', error));
