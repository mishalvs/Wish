const canvas = document.getElementById('starfieldCanvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Star {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.alpha = Math.random();
    this.speed = Math.random() * 0.02 + 0.005;
  }
  update() {
    this.alpha += this.speed;
    if (this.alpha > 1 || this.alpha < 0) this.speed = -this.speed;
  }
  draw() {
    ctx.fillStyle = `rgba(0, 240, 255, ${Math.abs(this.alpha)})`;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

for (let i = 0; i < 75; i++) stars.push(new Star());

function renderStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(s => { s.update(); s.draw(); });
  requestAnimationFrame(renderStars);
}
renderStars();

const arena = document.getElementById('balloonArena');
const counter = document.getElementById('unlockCounter');
const vault = document.getElementById('vaultSection');

const colors = ['#ff2a85', '#00f0ff', '#ffcc00', '#a855f7', '#22c55e'];
let poppedCount = 0;
const targetPop = 5;

function spawnBalloons() {
  arena.innerHTML = '';
  for (let i = 0; i < 7; i++) {
    const b = document.createElement('div');
    b.className = 'balloon-item';
    b.style.backgroundColor = colors[i % colors.length];
    b.style.left = `${10 + i * 12}%`;
    b.style.top = `${20 + (i % 3) * 25}%`;
    b.style.animationDelay = `${i * 0.4}s`;
    b.textContent = '🎈';

    b.addEventListener('click', () => {
      playPopSFX();
      b.style.transform = 'scale(0)';
      b.style.pointerEvents = 'none';
      poppedCount++;
      counter.textContent = `${poppedCount} / ${targetPop} Popped`;
      
      if (poppedCount >= targetPop) {
        unlockVault();
      }
    });

    arena.appendChild(b);
  }
}
spawnBalloons();

function unlockVault() {
  vault.classList.remove('hidden');
  typeTerminalWish();
  counter.textContent = '🔓 Party Vault Unlocked!';
  counter.style.color = '#00f0ff';
}

const flame = document.getElementById('flame');
const blowBtn = document.getElementById('blowBtn');

blowBtn.addEventListener('click', () => {
  flame.classList.add('off');
  blowBtn.textContent = '🎉 Wish Sent!';
  blowBtn.style.background = '#22c55e';
});

const message = "You’ve been calm when everything else was loud — basically my personal noise-canceling human 😌. Thanks for sticking around and making life a little less dramatic 😂. If things ever get heavy, I’m still here. Hope your day’s easy, bright, and full of cake! 🎂✨";
const terminalText = document.getElementById('terminalText');
let charIdx = 0;
let typed = false;

function typeTerminalWish() {
  if (typed) return;
  typed = true;
  function type() {
    if (charIdx < message.length) {
      terminalText.textContent += message.charAt(charIdx);
      charIdx++;
      setTimeout(type, 35);
    }
  }
  type();
}

let audioCtx, isPlaying = false, audioTimer;
const soundWidget = document.getElementById('soundWidget');
const soundLabel = document.getElementById('soundLabel');

function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playPopSFX() {
  if (!audioCtx) initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.08);
}

function toggleBeats() {
  if (!audioCtx) initAudio();
  if (isPlaying) {
    clearInterval(audioTimer);
    soundWidget.classList.remove('playing');
    soundLabel.textContent = 'Play Beats';
    isPlaying = false;
  } else {
    soundWidget.classList.add('playing');
    soundLabel.textContent = 'Playing...';
    isPlaying = true;
    
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 349.23];
    let noteIdx = 0;
    
    audioTimer = setInterval(() => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = notes[noteIdx % notes.length];
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
      noteIdx++;
    }, 400);
  }
}

soundWidget.addEventListener('click', toggleBeats);
