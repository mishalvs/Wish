let currentRoom = 1;

function nextRoom(roomNum) {
  playClickSound();
  document.getElementById(`room${currentRoom}`).classList.remove('active');
  currentRoom = roomNum;
  document.getElementById(`room${currentRoom}`).classList.add('active');
}

/* Room 2 Balloon Logic */
let poppedCount = 0;
function popMiniBalloon(el) {
  if (el.classList.contains('popped')) return;
  playPopSound();
  el.classList.add('popped');
  poppedCount++;

  if (poppedCount === 3) {
    document.getElementById('balloonStatus').textContent = "Balloons Cleared! Playing Celebration Music & Ribbons 🎉";
    startBirthdayMusic();
    triggerRibbonConfetti();
    setTimeout(() => {
      nextRoom(3);
    }, 1200);
  }
}

/* Room 3 Candle Logic */
function blowCandles() {
  playPopSound();
  for (let i = 1; i <= 4; i++) {
    const flameEl = document.getElementById(`flame${i}`);
    if (flameEl) flameEl.classList.add('out');
  }
  
  const btn = document.getElementById('blowOutBtn');
  if (btn) {
    btn.textContent = "Wish Granted! ✨";
    btn.style.background = "#22c55e";
  }
  
  triggerRibbonConfetti();

  setTimeout(() => {
    nextRoom(4);
  }, 1000);
}

function resetExperience() {
  playClickSound();
  stopBirthdayMusic();
  poppedCount = 0;
  document.querySelectorAll('.ball').forEach(b => b.classList.remove('popped'));
  document.getElementById('balloonStatus').textContent = "Tap all three balloons to clear the path!";
  for (let i = 1; i <= 4; i++) {
    const flameEl = document.getElementById(`flame${i}`);
    if (flameEl) flameEl.classList.remove('out');
  }
  const btn = document.getElementById('blowOutBtn');
  if (btn) {
    btn.textContent = "Blow Out Candles 💨";
    btn.style.background = "";
  }
  nextRoom(1);
}

/* Confetti & Ribbons Animation (🎊🎉) */
const canvas = document.getElementById('confettiCanvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class RibbonParticle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = -20;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = Math.random() * 4 + 2;
    this.size = Math.random() * 10 + 6;
    this.color = ['#ff4785', '#00f2fe', '#ffd700', '#a855f7', '#22c55e'][Math.floor(Math.random() * 5)];
    this.rot = Math.random() * 360;
    this.spin = (Math.random() - 0.5) * 10;
  }
  update() {
    this.y += this.vy;
    this.x += this.vx;
    this.rot += this.spin;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rot * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
    ctx.restore();
  }
}

function triggerRibbonConfetti() {
  for (let i = 0; i < 70; i++) {
    particles.push(new RibbonParticle());
  }
}

function runConfettiLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p, idx) => {
    p.update();
    p.draw();
    if (p.y > canvas.height + 20) particles.splice(idx, 1);
  });
  requestAnimationFrame(runConfettiLoop);
}
runConfettiLoop();

/* Web Audio Synthesizer (Birthday Song & SFX) */
let audioCtx, musicInterval;

function initAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playClickSound() {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(500, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
  gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.05);
}

function playPopSound() {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
  gain.gain.linearRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.start(); osc.stop(audioCtx.currentTime + 0.1);
}

function startBirthdayMusic() {
  initAudio();
  if (musicInterval) return;

  const notes = [
    {f: 261.63, d: 250}, {f: 261.63, d: 250}, {f: 293.66, d: 500}, {f: 261.63, d: 500}, {f: 349.23, d: 500}, {f: 329.63, d: 1000},
    {f: 261.63, d: 250}, {f: 261.63, d: 250}, {f: 293.66, d: 500}, {f: 261.63, d: 500}, {f: 392.00, d: 500}, {f: 349.23, d: 1000}
  ];

  let noteIdx = 0;
  musicInterval = setInterval(() => {
    const n = notes[noteIdx % notes.length];
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = n.f;
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (n.d / 1000));
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + (n.d / 1000));
    noteIdx++;
  }, 400);
}

function stopBirthdayMusic() {
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
}
