const clockEl  = document.getElementById('clock');
const dateEl   = document.getElementById('date');
const inputEl  = document.getElementById('alarmTime');
const btnEl    = document.getElementById('toggleBtn');
const statusEl = document.getElementById('status');
const ringFill = document.getElementById('ringFill');

// inject SVG gradient
const svg = document.querySelector('.ring');
const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
defs.innerHTML = `
  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="#6366f1"/>
    <stop offset="100%" stop-color="#a78bfa"/>
  </linearGradient>
  <linearGradient id="ringGradientRing" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%"   stop-color="#ef4444"/>
    <stop offset="100%" stop-color="#f97316"/>
  </linearGradient>`;
svg.prepend(defs);

const CIRCUMFERENCE = 2 * Math.PI * 100; // 628.3

let isSet  = false;
let isRing = false;
let audioCtx = null;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function pad(n) { return String(n).padStart(2, '0'); }

function tick() {
  const now = new Date();
  const h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();

  clockEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  dateEl.textContent  = `${DAYS[now.getDay()]}  ${MONTHS[now.getMonth()]} ${pad(now.getDate())}`;

  // seconds ring
  const offset = CIRCUMFERENCE * (1 - s / 60);
  ringFill.style.strokeDashoffset = offset;

  if (isSet && !isRing) {
    const [ah, am] = inputEl.value.split(':').map(Number);
    if (h === ah && m === am && s === 0) startRinging();
  }
}

function startRinging() {
  isRing = true;
  clockEl.classList.add('ringing');
  document.body.classList.add('ringing-body');
  ringFill.style.stroke = 'url(#ringGradientRing)';
  statusEl.textContent  = 'RINGING';
  statusEl.className    = 'status ring';
  btnEl.textContent     = 'STOP';
  btnEl.className       = 'btn stop';
  playBeep();
}

function stopRinging() {
  isRing = false;
  clockEl.classList.remove('ringing');
  document.body.classList.remove('ringing-body');
  ringFill.style.stroke = 'url(#ringGradient)';
  stopBeep();
  resetUI();
}

function playBeep() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const gain = audioCtx.createGain();
  gain.gain.value = 0.28;
  gain.connect(audioCtx.destination);

  function schedule() {
    if (!isRing) return;
    [[880, 0], [1100, 0.18], [880, 0.36]].forEach(([freq, t]) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gain);
      osc.start(audioCtx.currentTime + t);
      osc.stop(audioCtx.currentTime + t + 0.15);
    });
    setTimeout(schedule, 900);
  }
  schedule();
}

function stopBeep() {
  if (audioCtx) { audioCtx.close(); audioCtx = null; }
}

function resetUI() {
  isSet = false;
  btnEl.textContent = 'SET';
  btnEl.className   = 'btn';
  statusEl.textContent = '';
  statusEl.className   = 'status';
}

btnEl.addEventListener('click', () => {
  if (isRing)  { stopRinging(); return; }
  if (isSet)   { resetUI();     return; }

  if (!inputEl.value) {
    statusEl.textContent = '時刻を選んでください';
    return;
  }

  isSet = true;
  btnEl.textContent    = 'CANCEL';
  btnEl.className      = 'btn active';
  statusEl.textContent = `${inputEl.value} SET`;
  statusEl.className   = 'status on';
});

setInterval(tick, 1000);
tick();
