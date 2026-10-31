let currentRoom = 1;
const totalRooms = 4;

function nextRoom(roomNum) {
  playClickSound();
  document.getElementById(`room${currentRoom}`).classList.remove('active');
  currentRoom = roomNum;
  document.getElementById(`room${currentRoom}`).classList.add('active');

  if (currentRoom === 4) {
    startTypewriter();
  }
}

/* Room 2 Balloon Logic */
let poppedCount = 0;
function popMiniBalloon(el) {
  if (el.classList.contains('popped')) return;
  playPopSound();
  el.classList.add('popped');
  poppedCount++;

  if (poppedCount === 3) {
    document.getElementById('balloonStatus').textContent = "Security Bypassed! Entering Chamber...";
    setTimeout(() => {
      nextRoom(3);
    }, 800);
  }
}

/* Room 3 Candle Logic */
function blowCandle() {
  playPopSound();
  document.getElementById('miniFlame').classList.add('out');
  document.getElementById('blowOutBtn').textContent = "Wish Granted! ✨";
  document.getElementById('blowOutBtn').style.background = "#22c55e";
  
  setTimeout(() => {
    nextRoom(4);
  }, 1000);
}

/* Room 4 Typewriter Logic */
const secretWish = "You’ve been calm when everything else was loud — basically my personal noise-canceling human 😌. Thanks for sticking around and making life a little less dramatic 😂. If things ever get heavy, I’m still here. Hope your day’s easy, bright, and full of cake! 🎂✨";
let typedIndex = 0;
let isTyping = false;

function startTypewriter() {
  if (isTyping) return;
  isTyping = true;
  typedIndex = 0;
  const container = document.getElementById('typewriterText');
  container.textContent = '';

  function type() {
    if (typedIndex < secretWish.length) {
      container.textContent += secretWish.charAt(typedIndex);
      typedIndex++;
      setTimeout(type, 30);
    }
  }
  type();
}

function resetExperience() {
  playClickSound();
  poppedCount = 0;
  document.querySelectorAll('.ball').forEach(b => b.classList.remove('popped'));
  document.getElementById('balloonStatus').textContent = "Tap them all to break the security seal!";
  document.getElementById('miniFlame').classList.remove('out');
  document.getElementById('blowOutBtn').textContent = "Blow Out Flame 💨";
  document.getElementById('blowOutBtn').style.background = "";
  isTyping = false;
  nextRoom(1);
}

/* Web Audio Sound Effects */
let audioCtx;
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
