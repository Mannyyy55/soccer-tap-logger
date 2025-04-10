const timerDisplay = document.getElementById("timer");
const field = document.getElementById("field");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const fieldImg = document.getElementById("fieldImg");

let startTime;
let timerInterval;
let isRunning = false;

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function updateTimer() {
  const now = Date.now();
  const elapsed = now - startTime;
  timerDisplay.textContent = formatTime(elapsed);
}

startBtn.addEventListener("click", () => {
  if (!isRunning) {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 500);
    isRunning = true;
    stopBtn.disabled = false;
    stopBtn.classList.remove("disabled");
    startBtn.classList.add("disabled");
    startBtn.disabled = true;
  }
});

stopBtn.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
    stopBtn.classList.add("disabled");
    stopBtn.disabled = true;
  }
});

fieldImg.addEventListener("click", (e) => {
  if (!isRunning) return;
  const rect = fieldImg.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width).toFixed(4);
  const y = ((e.clientY - rect.top) / rect.height).toFixed(4);
  const dot = document.createElement("div");
  dot.className = "dot";
  dot.style.left = `${x * 100}%`;
  dot.style.top = `${y * 100}%`;
  field.appendChild(dot);
});

