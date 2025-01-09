document.addEventListener('DOMContentLoaded', () => {
  const audioElement = document.createElement("audio");
  audioElement.id = "audio";
  document.body.appendChild(audioElement);

  const loadingContainer = document.getElementById("loadingContainer");
  const playerContainer = document.getElementById("playerContainer");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const artworkElement = document.getElementById("artwork");
  const songTitleElement = document.getElementById("songTitle");
  const songArtistElement = document.getElementById("songArtist");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const backBtn = document.getElementById("backBtn");
  const skipBtn = document.getElementById("skipBtn");
  const volumeBar = document.getElementById("volumeBar");

  const playlist = ["0123456789", "9876543210", "1111111111"];
  let currentSongIndex = 0;

  let audioLoaded = false;
  let metadataLoaded = false;
  let artworkLoaded = false;

  const fetchSongData = async (songID) => {
    try {
      // Ensure the audio file path is correctly referenced inside data.json
      const response = await fetch(`database/${songID}/data.json`);
      if (!response.ok) throw new Error(`Failed to fetch data for songID: ${songID}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const loadSong = async (index) => {
    const songID = playlist[index];
    if (!songID) return;

    const songData = await fetchSongData(songID);
    if (songData) {
      // Reset the loading state
      audioLoaded = false;
      metadataLoaded = false;
      artworkLoaded = false;

      // Set the audio source with the correct path
      audioElement.src = `database/${songID}/song.mp3`; // Correct the path for your audio files
      artworkElement.src = songData.artworkSrc || "default.png"; // Fallback artwork
      songTitleElement.textContent = songData.title || "Track Name";
      songArtistElement.textContent = songData.artist || "Artist";

      // Load the audio file
      audioElement.addEventListener('canplaythrough', () => {
        audioLoaded = true;
        checkAllResourcesLoaded();
      });

      // Load the artwork
      artworkElement.onload = () => {
        artworkLoaded = true;
        checkAllResourcesLoaded();
      };

      // Load metadata
      audioElement.addEventListener('loadeddata', () => {
        metadataLoaded = true;
        checkAllResourcesLoaded();
      });

      audioElement.load(); 
    } else {
      console.error(`Failed to load song with ID: ${songID}`);
    }
  };

  const checkAllResourcesLoaded = () => {
    if (audioLoaded && metadataLoaded && artworkLoaded) {
      loadingContainer.style.display = 'none';
      searchInput.style.display = 'flex';
      playerContainer.style.display = 'flex';
    }
  };

  const togglePlayback = () => {
    if (audioElement.paused) {
      audioElement.play();
      playPauseBtn.textContent = "Stop";
    } else {
      audioElement.pause();
      playPauseBtn.textContent = "Play";
    }
  };

  const navigateSong = (direction) => {
    currentSongIndex = (currentSongIndex + direction + playlist.length) % playlist.length;
    loadSong(currentSongIndex);
    audioElement.play();
    playPauseBtn.textContent = "Stop";
  };

  const setVolume = () => {
    audioElement.volume = volumeBar.value / 100;
  };

  const updateSearchResults = async (query) => {
    if (query.trim() === "") {
      searchResults.innerHTML = "";
      return;
    }

    const results = [];
    for (let songID of playlist) {
      const songData = await fetchSongData(songID);
      if (songData && songData.title.toLowerCase().includes(query.toLowerCase())) {
        results.push(songData);
      }
    }

    // Display the search results
    searchResults.innerHTML = "";
    if (results.length > 0) {
      results.forEach(result => {
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('search-result');
        resultDiv.innerHTML = `
          <img src="${result.artworkSrc || 'default.png'}" alt="Album Art">
          <div>
            <div class="title">${result.title}</div>
            <div class="artist">${result.artist}</div>
          </div>
        `;

        resultDiv.addEventListener('click', () => {
          const songIndex = playlist.findIndex(songID => songID === result.id);
          if (songIndex >= 0) {
            currentSongIndex = songIndex;
            loadSong(currentSongIndex);
            audioElement.play();
            playPauseBtn.textContent = "Stop";
          }
        });

        searchResults.appendChild(resultDiv);
      });
    } else {
      searchResults.innerHTML = "<div>No results found</div>";
    }
  };

  searchInput.addEventListener('input', (e) => {
    updateSearchResults(e.target.value);
  });

  playPauseBtn.addEventListener("click", togglePlayback);
  backBtn.addEventListener("click", () => navigateSong(-1));
  skipBtn.addEventListener("click", () => navigateSong(1));
  volumeBar.addEventListener("input", setVolume);

  loadSong(currentSongIndex); 
});
