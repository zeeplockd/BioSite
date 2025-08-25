// Music player logic
const playToggle = document.querySelector('.play-toggle');
const iconPlay = document.querySelector('.icon-play');
const iconPause = document.querySelector('.icon-pause');
const musicPlayer = document.querySelector('.music-player');
const musicInfo = document.querySelector('.music-info');
let audio = new Audio('music.mp3');

function resetAudio() {
    audio.pause();
    audio.currentTime = 0;
}

function showInfo(isPlaying) {
    if (isPlaying) {
        musicPlayer.classList.add('show-info');
    } else {
        musicPlayer.classList.remove('show-info');
    }
}

playToggle.addEventListener('click', () => {
    if (audio.paused) {
        resetAudio();
        audio.play();
        iconPlay.style.display = 'none';
        iconPause.style.display = 'inline';
        showInfo(true);
    } else {
        resetAudio();
        iconPlay.style.display = 'inline';
        iconPause.style.display = 'none';
        showInfo(false);
    }
});

audio.addEventListener('ended', () => {
    iconPlay.style.display = 'inline';
    iconPause.style.display = 'none';
    showInfo(false);
});

// Background animation for the canvas

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