// Get elements
const playPauseBtn = document.getElementById('playPauseBtn');
const audio = document.getElementById('audio');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');
const currentTimeDisplay = document.getElementById('currentTime');
const durationDisplay = document.getElementById('duration');

// Play/Pause button
playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = 'Pause';
    } else {
        audio.pause();
        playPauseBtn.textContent = 'Play';
    }
});

// Format time in minutes and seconds
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Update progress bar and time display
audio.addEventListener('timeupdate', () => {
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    
    // Update progress bar
    const progress = (currentTime / duration) * 100;
    progressBar.value = progress;

    // Update current time display
    currentTimeDisplay.textContent = formatTime(currentTime);

    // Update total duration display
    if (!isNaN(duration)) {
        durationDisplay.textContent = formatTime(duration);
    }
});

// Seek position when the progress bar changes
progressBar.addEventListener('input', () => {
    const progress = progressBar.value;
    audio.currentTime = (progress / 100) * audio.duration;
});

// Adjust volume
volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value / 100;
});
