/* -------------------
   Customization
-------------------- */
const name = "Tashu";
const message = "May today be as gentle and steady as the peace you’ve brought into my life.";

const longMessage = 'You’ve been calm when everything else was loud — basically my personal noise-canceling human 😌 Thanks for sticking around and making life a little less dramatic 😂 If things ever get heavy, I’m still here. Hope your day’s easy, bright, and full of cake 🎂✨'
const balloonsToPop = 5;
const magicEmoji = "🪄"; 
document.getElementById('headline').innerHTML = `Happy Birthday, ${escapeHtml(name)} <span class="sparkle">✨</span>`;
document.getElementById('subtext').textContent = message;

/* -------------------
   Global variables
-------------------- */
const stage = document.getElementById('stage');
const balloonsContainer = document.getElementById('balloons');
const startOverlay = document.getElementById('startOverlay');
const startBtn = document.getElementById('startBtn');
const msgCard = document.getElementById('messageCard');
const confettiCanvas = document.getElementById('confettiCanvas');
const ctx = confettiCanvas.getContext('2d');
const footerHint = document.getElementById('footerHint');
let audioCtx, masterGain;
let musicOn = false;
let poppedCount = 0;
let confettiParticles = [];
let burstConfetti = [];
let revealed = false;

/* -------------------
   Responsive canvas
-------------------- */
function resizeCanvas(){ confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* -------------------
   Confetti classes
-------------------- */
function rand(min,max){ return Math.random()*(max-min)+min; }
class Confetti {constructor(x,y,vx,vy,size,color){Object.assign(this,{x,y,vx,vy,size,color,life:120+Math.random()*80,t:0,rotate:Math.random()*360,spin:rand(-6,6)});} update(){ this.t++; this.vy+=0.12; this.x+=this.vx; this.y+=this.vy; this.rotate+=this.spin; this.life--; } draw(ctx){ ctx.save(); ctx.translate(this.x,this.y); ctx.rotate(this.rotate*Math.PI/180); ctx.fillStyle=this.color; ctx.fillRect(-this.size/2,-this.size/2,this.size,this.size*0.6); ctx.restore(); }}
function createBurst(x,y,count){const colors=['#FF84C0','#7AE7C7','#8FB4FF','#FFD36E','#E3D3FF','#FFF1A8']; for(let i=0;i<count;i++){const ang=Math.random()*Math.PI*2,sp=rand(2,8),vx=Math.cos(ang)*sp,vy=Math.sin(ang)*sp-rand(1,4),size=rand(6,12),c=colors[Math.floor(Math.random()*colors.length)];burstConfetti.push(new Confetti(x,y,vx,vy,size,c));}}
function createGlobalConfetti(n){const colors=['#FF84C0','#7AE7C7','#8FB4FF','#FFD36E','#E3D3FF','#FFF1A8'];for(let i=0;i<n;i++){const x=rand(0,confettiCanvas.width),y=rand(-60,-10),vx=rand(-1.5,1.5),vy=rand(1,4),size=rand(6,12),c=colors[Math.floor(Math.random()*colors.length)];confettiParticles.push(new Confetti(x,y,vx,vy,size,c));}}

/* -------------------
   Confetti loop
-------------------- */
let confettiTicker=0;
function loop(){ctx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);if(confettiTicker%12===0){if(Math.random()<0.8){const x=rand(0,confettiCanvas.width),y=-10,vx=rand(-0.6,0.6),vy=rand(1,2),size=rand(6,12),c=['#FF84C0','#7AE7C7','#8FB4FF','#FFD36E'][Math.floor(Math.random()*4)];confettiParticles.push(new Confetti(x,y,vx,vy,size,c));}}confettiTicker++;for(let i=confettiParticles.length-1;i>=0;i--){const p=confettiParticles[i];p.update();if(p.life<=0||p.y>confettiCanvas.height+60)confettiParticles.splice(i,1);else p.draw(ctx);}for(let i=burstConfetti.length-1;i>=0;i--){const p=burstConfetti[i];p.update();if(p.life<=0||p.y>confettiCanvas.height+60)burstConfetti.splice(i,1);else p.draw(ctx);}requestAnimationFrame(loop);}
loop();

/* -------------------
   Stars
-------------------- */
const starColors = ['#fff8d8','#ffe3f0','#e6faf4','#dfe9ff'];
function createStar(x,y){const el=document.createElement('div');el.className='star glow';const size=Math.random
()*8+6; el.style.width=el.style.height=size+'px'; el.style.left=(x-size/2)+'px'; el.style.top=(y-size/2)+'px'; el.style.background=starColors[Math.floor(Math.random()*starColors.length)]; document.body.appendChild(el); setTimeout(()=>{el.style.transition='transform 900ms ease, opacity 900ms ease'; el.style.transform='scale(0.2) translateY(-20px)'; el.style.opacity='0';},20); setTimeout(()=>el.remove(),1100);}

/* -------------------
   Magic stick
-------------------- */
const magicStick=document.createElement('div');
magicStick.className='magic-stick';
magicStick.textContent=magicEmoji;
document.body.appendChild(magicStick);
window.addEventListener('mousemove', e => {
  magicStick.style.left=(e.clientX+4)+'px';
  magicStick.style.top=(e.clientY-24)+'px';
  createStar(e.clientX,e.clientY);
});

/* -------------------
   Balloon spawn
-------------------- */
const balloonColors=['b1','b2','b3','b4','b5'];
function spawnBalloons(n=8){
  const w = window.innerWidth;
  for(let i=0;i<n;i++){
    const b=document.createElement('div');
    b.className='balloon '+balloonColors[i%balloonColors.length];
    const left=Math.random()*(w-140)+40;
    const bottom=Math.random()*30-40;
    b.style.left=left+'px';
    b.style.bottom=bottom+'px';
    b.style.zIndex=10+Math.floor(Math.random()*10);
    b.style.animation=`float ${6+Math.random()*6}s ease-in-out ${Math.random()*2}s infinite`;
    b.dataset.popped="false";
    const str=document.createElement('div'); str.className='string'; b.appendChild(str);
    b.addEventListener('click',(ev)=>{ ev.stopPropagation(); popBalloon(b,{x:ev.clientX,y:ev.clientY}); });
    balloonsContainer.appendChild(b);
  }
}
spawnBalloons(9);

/* -------------------
   Pop balloon
-------------------- */
function popBalloon(b, coords){
  if(b.dataset.popped==="true") return;
  b.dataset.popped="true";
  b.classList.add('pop');
  playPopSound();
  const rect=b.getBoundingClientRect();
  createBurst(rect.left+rect.width/2, rect.top+rect.height/2, 28);
  setTimeout(()=>b.remove(),380);
  poppedCount++;
  if(poppedCount>=balloonsToPop) revealMessage();
}

/* -------------------
   Typing effect for long wish
-------------------- */
function typeLongWish() {
  const longWish = document.getElementById('longWish');
  longWish.textContent = '';
  longWish.classList.add('show');

  const text = longMessage;
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      longWish.textContent += text[i];
      i++;
      setTimeout(typeChar, 40);
    }
  }

  typeChar();
}



/* -------------------
   Continuous Happy Birthday tune
-------------------- */
function playHappyBirthday(){
  if(!audioCtx) initAudio();
  const notes=[
    {freq:264,duration:250},{freq:264,duration:250},{freq:297,duration:500},{freq:264,duration:500},{freq:352,duration:500},{freq:330,duration:1000},
    {freq:264,duration:250},{freq:264,duration:250},{freq:297,duration:500},{freq:264,duration:500},{freq:396,duration:500},{freq:352,duration:1000},
    {freq:264,duration:250},{freq:264,duration:250},{freq:528,duration:500},{freq:440,duration:500},{freq:352,duration:500},{freq:330,duration:500},{freq:297,duration:1000},
    {freq:466,duration:250},{freq:466,duration:250},{freq:440,duration:500},{freq:352,duration:500},{freq:396,duration:500},{freq:352,duration:1000}
  ];

  let startTime = audioCtx.currentTime;
  for(let n of notes){
    const osc=audioCtx.createOscillator();
    const gain=audioCtx.createGain();
    osc.type='sine';
    osc.frequency.value=n.freq;
    osc.connect(gain); gain.connect(masterGain);
    gain.gain.setValueAtTime(0.0001,startTime);
    gain.gain.exponentialRampToValueAtTime(0.2,startTime+0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001,startTime+n.duration/1000);
    osc.start(startTime); osc.stop(startTime+n.duration/1000);
    startTime+=n.duration/1000;
  }

  setTimeout(playHappyBirthday, startTime*1000); // loop continuously
}

/* -------------------
   Reveal message
-------------------- */
function revealMessage() {
  if (revealed) return;
  revealed = true;

  msgCard.classList.add('revealed');


  playHappyBirthday();


  createGlobalConfetti(120);


  footerHint.style.opacity = '0';
  setTimeout(() => footerHint.style.display = 'none', 400);


  setTimeout(() => {
    document.getElementById('giftBoxContainer').style.display = 'flex';
  }, 3000);


  setTimeout(typeLongWish, 8000); // you can adjust this later
  spawnBalloons(7);
}


// -------------------
// Gift box interaction
// -------------------
const giftBox = document.getElementById('giftBox');
const giftHint = document.getElementById('giftHint');
const birthdayVideo = document.getElementById('birthdayVideo');
const giftBoxContainer = document.getElementById('giftBoxContainer');

giftBox.addEventListener('click', () => {
  // Gift unwrap animation
  giftBox.style.transform = 'scale(0) rotate(180deg)';
  giftBox.style.opacity = '0';
  giftHint.style.opacity = '0';
  setTimeout(() => {
    giftBox.style.display = 'none';
    giftHint.style.display = 'none';
    birthdayVideo.classList.add('show');
    birthdayVideo.play();
  }, 600);
});

/* -------------------
   Audio setup
-------------------- */
function initAudio(){ audioCtx=new (window.AudioContext||window.webkitAudioContext)(); masterGain=audioCtx.createGain(); masterGain.gain.value=0.12; masterGain.connect(audioCtx.destination); }

/* -------------------
   Pop sound
-------------------- */
function playPopSound(){
  if(!audioCtx) initAudio();
  const now=audioCtx.currentTime; const duration=0.12; const bufferSize=audioCtx.sampleRate*duration;
  const buffer=audioCtx.createBuffer(1,bufferSize,audioCtx.sampleRate);
  const data=buffer.getChannelData(0);
  for(let i=0;i<bufferSize;i++) data[i]=(Math.random()*2-1)*Math.exp(-i/bufferSize*4);
  const noise=audioCtx.createBufferSource(); noise.buffer=buffer;
  const noiseGain=audioCtx.createGain(); noiseGain.gain.setValueAtTime(0.0001, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.6, now+0.01);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now+duration);
  noise.connect(noiseGain); noiseGain.connect(masterGain); noise.start(now); noise.stop(now+duration);
  const osc=audioCtx.createOscillator(); const g=audioCtx.createGain();
  osc.type='triangle'; osc.frequency.value=700+Math.random()*200; g.gain.value=0.0001;
  osc.connect(g); g.connect(masterGain); g.gain.exponentialRampToValueAtTime(0.18, now+0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, now+0.07); osc.start(now); osc.stop(now+0.08);
}

/* -------------------
   Start button
-------------------- */
startBtn.addEventListener('click',(ev)=>{
  ev.stopPropagation();
  startOverlay.style.display='none';
  createGlobalConfetti(60);
  stage.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}],{duration:700,iterations:1,easing:'cubic-bezier(.2,.9,.2,1)'});
});

/* -------------------
   Utility
-------------------- */
function escapeHtml(unsafe){ return unsafe.replace(/[&<"']/g, m=>({'&':'&amp;','<':'&lt;','"':'&quot;',"'":'&#039;'}[m])); }