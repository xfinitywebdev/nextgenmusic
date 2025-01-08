document.addEventListener('DOMContentLoaded', () => {
    const audioElement = document.getElementById("audio");
    const artworkElement = document.getElementById("artwork");
    const songTitleElement = document.getElementById("songTitle");
    const songArtistElement = document.getElementById("songArtist");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const backBtn = document.getElementById("backBtn");
    const skipBtn = document.getElementById("skipBtn");
    const progressBar = document.getElementById("progressBar");
    const volumeBar = document.getElementById("volumeBar");
    const currentTimeDisplay = document.getElementById("currentTime");
    const durationDisplay = document.getElementById("duration");
    const loopBtn = document.getElementById("loopBtn");

    // Playlist using song IDs
    const playlist = ["0123456789", "9876543210", "1111111111"];
    let currentSongIndex = 0;

    // Function to fetch song data using songID
    const fetchSongData = async (songID) => {
        try {
            const response = await fetch(`database/${songID}/data.json`);
            if (!response.ok) throw new Error(`Failed to fetch data for songID: ${songID}`);
            return await response.json();
        } catch (error) {
            console.error(error);
            return null; // Fallback to handle errors
        }
    };

    // Load the current song by songID
    const loadSong = async (index) => {
        const songID = playlist[index];
        if (!songID) return;

        const songData = await fetchSongData(songID);

        if (songData) {
            audioElement.src = songData.audioSrc;
            artworkElement.src = songData.artworkSrc || "default.png"; // Fallback artwork
            songTitleElement.textContent = songData.title || "Unknown Title";
            songArtistElement.textContent = songData.artist || "Unknown Artist";

            // Ensure progress bar resets correctly when loading a new song
            progressBar.value = 0; 
            playPauseBtn.textContent = "Play";
            audioElement.pause();
        } else {
            console.error(`Failed to load song with ID: ${songID}`);
        }
    };

    // Initialize player with the first song
    loadSong(currentSongIndex);

    // Play/Pause functionality
    playPauseBtn.addEventListener("click", () => {
        if (audioElement.paused) {
            audioElement.play();
            playPauseBtn.textContent = "Pause";
        } else {
            audioElement.pause();
            playPauseBtn.textContent = "Play";
        }
    });

    // Back button functionality
    backBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        audioElement.play();
        playPauseBtn.textContent = "Pause";
    });

    // Skip button functionality
    skipBtn.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        audioElement.play();
        playPauseBtn.textContent = "Pause";
    });

    // Loop button functionality
    loopBtn.addEventListener("click", () => {
        audioElement.loop = !audioElement.loop;
        loopBtn.classList.toggle("active", audioElement.loop);
        loopBtn.textContent = audioElement.loop ? "Looping" : "Loop";
    });

    // Update progress bar and time display
    audioElement.addEventListener("timeupdate", () => {
        const currentTime = audioElement.currentTime;
        const duration = audioElement.duration;

        // Update progress bar
        if (!isNaN(duration)) {
            const progress = (currentTime / duration) * 100;
            progressBar.value = progress;
        }

        // Update time displays
        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = !isNaN(duration) ? formatTime(duration) : "00:00";
    });

    // Seek position using progress bar
    progressBar.addEventListener("input", () => {
        const progress = progressBar.value;
        if (!isNaN(audioElement.duration)) {
            audioElement.currentTime = (progress / 100) * audioElement.duration;
        }
    });

    // Adjust volume
    volumeBar.addEventListener("input", () => {
        audioElement.volume = volumeBar.value / 100;
    });

    // Format time (in seconds) to MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
    }
});
