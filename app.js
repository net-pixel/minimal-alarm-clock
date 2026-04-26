const clockEl  = document.getElementById('clock');
const inputEl   = document.getElementById('alarmTime');
const btnEl     = document.getElementById('toggleBtn');
const statusEl  = document.getElementById('status');

let isSet    = false;
let isRing   = false;
let audioCtx = null;
let gainNode = null;
let oscillators = [];

function pad(n) {
  return String(n).padStart(2, '0');
}

function tick() {
  const now = new Date();
  clockEl.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  if (isSet && !isRing) {
    const [ah, am] = inputEl.value.split(':').map(Number);
    if (now.getHours() === ah && now.getMinutes() === am && now.getSeconds() === 0) {
      startRinging();
    }
  }
}

function startRinging() {
  isRing = true;
  clockEl.classList.add('ringing');
  statusEl.textContent = 'RINGING';
  statusEl.className = 'status ring';
  btnEl.textContent = '止める';
  btnEl.className = 'btn stop';
  playBeep();
}

function stopRinging() {
  isRing = false;
  clockEl.classList.remove('ringing');
  stopBeep();
  resetUI();
}

function playBeep() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  gainNode = audioCtx.createGain();
  gainNode.gain.value = 0.3;
  gainNode.connect(audioCtx.destination);

  function scheduleBeeps() {
    if (!isRing) return;
    const freqs = [880, 1100, 880];
    let time = audioCtx.currentTime;
    freqs.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.connect(gainNode);
      osc.start(time);
      osc.stop(time + 0.15);
      time += 0.18;
    });
    setTimeout(scheduleBeeps, 900);
  }
  scheduleBeeps();
}

function stopBeep() {
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}

function resetUI() {
  isSet = false;
  btnEl.textContent = 'セット';
  btnEl.className = 'btn';
  statusEl.textContent = '';
  statusEl.className = 'status';
}

btnEl.addEventListener('click', () => {
  if (isRing) {
    stopRinging();
    return;
  }

  if (isSet) {
    resetUI();
    return;
  }

  if (!inputEl.value) {
    statusEl.textContent = '時刻を選んでください';
    statusEl.className = 'status';
    return;
  }

  isSet = true;
  btnEl.textContent = 'キャンセル';
  btnEl.className = 'btn active';
  statusEl.textContent = `${inputEl.value} にアラームをセット`;
  statusEl.className = 'status on';
});

setInterval(tick, 1000);
tick();
