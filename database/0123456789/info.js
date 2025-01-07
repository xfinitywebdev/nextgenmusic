// Get elements
const playPauseBtn = document.getElementById('playPauseBtn');
const audio = document.getElementById('audio');
const progressBar = document.getElementById('progressBar');
const volumeBar = document.getElementById('volumeBar');

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

// Update progress bar
audio.addEventListener('timeupdate', () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;
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
