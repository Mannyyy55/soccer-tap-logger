const timerDisplay = document.getElementById("timer");
const field = document.getElementById("field");
const fieldImg = document.getElementById("fieldImg");
const startBtn = document.getElementById("startBtn");
const halfTimeBtn = document.getElementById("halfTimeBtn");
const secondHalfBtn = document.getElementById("secondHalfBtn");
const fullTimeBtn = document.getElementById("fullTimeBtn");
const extraTimeBtn = document.getElementById("extraTimeBtn");
const downloadBtn = document.getElementById("downloadBtn");
const halfDurationSelect = document.getElementById("halfDuration");

let startTime;
let offset = 0;
let timerInterval;
let isRunning = false;
let events = [];

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateTimer() {
  const now = Date.now();
  const elapsed = now - startTime + offset;
  timerDisplay.textContent = formatTime(elapsed);
}

function enable(button) {
  button.disabled = false;
  button.classList.remove("disabled");
}

function disable(button) {
  button.disabled = true;
  button.classList.add("disabled");
}

function getCurrentTime() {
  const now = Date.now();
  return now - startTime + offset;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 500);
  isRunning = true;
}

function stopTimer() {
  clearInterval(timerInterval);
  offset += Date.now() - startTime;
  isRunning = false;
}

startBtn.addEventListener("click", () => {
  startTimer();
  disable(startBtn);
  enable(halfTimeBtn);
});

halfTimeBtn.addEventListener("click", () => {
  stopTimer();
  disable(halfTimeBtn);
  enable(secondHalfBtn);
  enable(extraTimeBtn);
});

secondHalfBtn.addEventListener("click", () => {
  const halfDuration = parseInt(halfDurationSelect.value, 10);
  offset = halfDuration * 60 * 1000;
  startTimer();
  disable(secondHalfBtn);
  enable(fullTimeBtn);
});

extraTimeBtn.addEventListener("click", () => {
  offset += getCurrentTime();
  startTimer();
  disable(extraTimeBtn);
  enable(fullTimeBtn);
});

fullTimeBtn.addEventListener("click", () => {
  stopTimer();
  disable(fullTimeBtn);
});

fieldImg.addEventListener("click", (e) => {
  if (!isRunning) return;

  const rect = fieldImg.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width).toFixed(4);
  const y = ((e.clientY - rect.top) / rect.height).toFixed(4);
  const time = formatTime(getCurrentTime());

  const dot = document.createElement("div");
  dot.className = "dot";
  dot.style.left = `${x * 100}%`;
  dot.style.top = `${y * 100}%`;
  field.appendChild(dot);

  events.push({ time, x, y });
});

downloadBtn.addEventListener("click", () => {
  if (events.length === 0) return;

  let csvContent = "data:text/csv;charset=utf-8,Time,X,Y\n";
  events.forEach(e => {
    csvContent += `${e.time},${e.x},${e.y}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "event_log.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
