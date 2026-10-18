// ====================
// Медиаплеер
// ====================

class Player {
    constructor() {
        this.currentTrack = null;
        this.isPlaying = false;
        this.volume = 0.7;
        this.playbackTime = 0;
        this.playlist = [
            { name: 'Песня 1 - Летняя прогулка', duration: '3:45', artist: 'Artist One' },
            { name: 'Песня 2 - Город ночи', duration: '4:12', artist: 'Night City' },
            { name: 'Песня 3 - Ретро вейв', duration: '3:58', artist: 'Synthwave' },
            { name: 'Песня 4 - Спокойствие', duration: '5:20', artist: 'Relaxation' }
        ];
        this.init();
    }

    init() {
        this.container = document.getElementById('player-container');
        this.videoArea = document.getElementById('player-video');
        this.progressSlider = document.getElementById('player-progress');
        this.progressBar = document.getElementById('player-progress-bar');
        this.playBtn = document.getElementById('player-play');
        this.prevBtn = document.getElementById('player-prev');
        this.nextBtn = document.getElementById('player-next');
        this.volumeSlider = document.getElementById('player-volume-slider');
        this.currentTimeEl = document.getElementById('player-current-time');
        this.durationEl = document.getElementById('player-duration');
        this.playlistEl = document.getElementById('player-playlist');

        this.renderPlaylist();
        this.setupControls();
    }

    renderPlaylist() {
        let html = '';
        this.playlist.forEach((track, index) => {
            html += `
                <div class="playlist-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                    <span class="track-number">${index + 1}</span>
                    <span class="track-info">
                        <span class="track-name">${track.name}</span>
                        <span class="track-artist">${track.artist}</span>
                    </span>
                    <span class="track-duration">${track.duration}</span>
                </div>
            `;
        });
        this.playlistEl.innerHTML = html;

        this.playlistEl.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                this.playTrack(parseInt(item.dataset.index));
                this.updateActiveTrack(parseInt(item.dataset.index));
            });
        });
    }

    setupControls() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        
        this.progressSlider.addEventListener('input', (e) => {
            this.playbackTime = (parseFloat(e.target.value) / 100) * 225; // 3:45 = 225 сек
            this.updateProgress();
        });

        this.volumeSlider.addEventListener('input', (e) => {
            this.volume = parseFloat(e.target.value);
        });
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        this.playBtn.innerHTML = this.isPlaying ? '⏸' : '▶️';
        
        if (this.isPlaying && this.currentTrack !== null) {
            this.startPlayback();
        }
    }

    startPlayback() {
        let elapsed = 0;
        const interval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(interval);
                return;
            }
            
            elapsed++;
            this.playbackTime = elapsed;
            
            if (elapsed >= 225) { // 3:45
                this.playNext();
                clearInterval(interval);
            }
            
            this.updateProgress();
        }, 1000);
    }

    updateProgress() {
        const progress = (this.playbackTime / 225) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
        
        const minutes = Math.floor(this.playbackTime / 60);
        const seconds = Math.floor(this.playbackTime % 60);
        this.currentTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    playTrack(index) {
        this.currentTrack = index;
        this.isPlaying = true;
        this.playbackTime = 0;
        this.playBtn.innerHTML = '⏸';
        
        const track = this.playlist[index];
        document.getElementById('player-track-name').textContent = track.name;
        document.getElementById('player-artist').textContent = track.artist;
        
        this.updateActiveTrack(index);
    }

    updateActiveTrack(index) {
        this.playlistEl.querySelectorAll('.playlist-item').forEach((item, i) => {
            if (i === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    playPrevious() {
        if (this.currentTrack > 0) {
            this.playTrack(this.currentTrack - 1);
        }
    }

    playNext() {
        if (this.currentTrack < this.playlist.length - 1) {
            this.playTrack(this.currentTrack + 1);
        } else {
            this.playTrack(0);
        }
    }
}

function initPlayer() {
    window.openPlayer = () => {
        const content = document.createElement('div');
        content.className = 'player';
        content.innerHTML = `
            <div class="player-video">
                <div class="player-placeholder" id="player-placeholder">
                    <h3>🎵 Медиаплеер</h3>
                    <p>Воспроизведите свою музыку здесь</p>
                </div>
            </div>
            <div class="player-controls">
                <div class="player-progress">
                    <div class="player-progress-bar" id="player-progress-bar" style="width: 0%"></div>
                    <input type="range" class="player-progress" id="player-progress" min="0" max="100" value="0">
                </div>
                <div class="player-buttons">
                    <button class="player-btn" id="player-prev">⏮</button>
                    <button class="player-btn player-play" id="player-play">▶️</button>
                    <button class="player-btn" id="player-next">⏭</button>
                    <div class="player-info">
                        <div id="player-track-name">Песня 1 - Летняя прогулка</div>
                        <div id="player-artist">Artist One</div>
                    </div>
                    <div class="player-volume">
                        <span>🔊</span>
                        <input type="range" class="player-volume-slider" id="player-volume-slider" min="0" max="1" step="0.1" value="0.7">
                    </div>
                    <div class="player-time">
                        <span id="player-current-time">0:00</span> / <span id="player-duration">3:45</span>
                    </div>
                </div>
            </div>
            <div class="player-playlist" id="player-playlist"></div>
        `;
        
        window.windowManager.createWindow({
            id: 'player-' + Date.now(),
            title: 'Медиаплеер',
            icon: '🎵',
            content: content,
            width: 700,
            height: 450,
            app: 'player'
        });

        setTimeout(() => {
            if (!window.player) {
                window.player = new Player();
            }
        }, 100);
    };
}
