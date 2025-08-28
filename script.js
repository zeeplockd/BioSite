const songs = [
    { file: "songs/BoundForTheFloor.mp3", artist: "Local H", name: "Bound for the Floor" },
    { file: "songs/Covet.mp3", artist: "Basement", name: "Covet" },
    { file: "songs/HeadInTheCeilingFan.mp3", artist: "Title Fight", name: "Head In The Ceiling Fan" },
    { file: "songs/IHateItToo.mp3", artist: "Hum", name: "I Hate It Too" },
    { file: "songs/LittleDipper.mp3", artist: "Hum", name: "Little Dipper" },
    { file: "songs/Mayonaise.mp3", artist: "The Smashing Pumpkins", name: "Mayonaise" },
    { file: "songs/NoSurprises.mp3", artist: "Radiohead", name: "No Surprises" },
    { file: "songs/Shed.mp3", artist: "Title Fight", name: "Shed" },
    { file: "songs/Stars.mp3", artist: "Hum", name: "Stars" },
    { file: "songs/SuicideMachine.mp3", artist: "Hum", name: "Suicide Machine" },
    { file: "songs/TheBoy.mp3", artist: "The Smashing Pumpkins", name: "The Boy" },
    { file: "songs/ThePod.mp3", artist: "Hum", name: "The Pod" }
];

let currentIndex = 0;
let audio = null;
let isPlaying = false;

const playBtn = document.querySelector('.play-toggle');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const iconPlay = document.querySelector('.icon-play');
const iconPause = document.querySelector('.icon-pause');
const trackTitle = document.querySelector('.track-title');
const trackArtist = document.querySelector('.track-artist');

function updateSongInfo() {
    trackTitle.textContent = songs[currentIndex].name;
    trackArtist.textContent = songs[currentIndex].artist;
}

function loadSong(index, {autoplay = false} = {}) {
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
        audio = null;
    }
    audio = new Audio(songs[index].file);
    audio.currentTime = 0;
    updateSongInfo();
    isPlaying = false;
    iconPlay.style.display = '';
    iconPause.style.display = 'none';
    if (autoplay) playSong();
    audio.addEventListener('ended', () => {
        skipSong(1);
    });
}

function playSong() {
    if (!audio) loadSong(currentIndex);
    audio.play();
    isPlaying = true;
    iconPlay.style.display = 'none';
    iconPause.style.display = '';
}

function pauseSong() {
    if (audio) audio.pause();
    isPlaying = false;
    iconPlay.style.display = '';
    iconPause.style.display = 'none';
}

function skipSong(dir) {
    currentIndex = (currentIndex + dir + songs.length) % songs.length;
    loadSong(currentIndex, {autoplay: isPlaying});
}

playBtn.addEventListener('click', () => {
    if (!audio) loadSong(currentIndex);
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', () => {
    skipSong(-1);
});
nextBtn.addEventListener('click', () => {
    skipSong(1);
});

loadSong(0);

const canvas = document.querySelector('.background');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Star {
    constructor(x, y, vx, vy, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.radius = radius;
        this.color = color;
        this.trail = [];
        this.maxTrail = 50;
    }
    update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
    }
    draw(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
            const t = this.trail[i];
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.radius * (i / this.trail.length), 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, 255, 255, ${i / this.trail.length * 0.7})`;
            ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
    }
}
const numStars = 30;
const stars = [];
for (let i = 0; i < numStars; i++) {
    const angle = 2.8 * Math.PI;
    const speed = 1 + Math.random() * 3;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;
    const radius = 7 + Math.random() * 3;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    stars.push(new Star(x, y, vx, vy, radius, "#ffffff"));
}
function animate() {
    ctx.fillStyle = "rgba(17, 17, 17, 0.25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let star of stars) {
        star.update();
        star.draw(ctx);
    }
    requestAnimationFrame(animate);
}
animate();