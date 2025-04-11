const timerDisplay = document.getElementById("timer");
const field = document.getElementById("field");
const startBtn = document.getElementById("startBtn");
const halfTimeBtn = document.getElementById("halfTimeBtn");
const fullTimeBtn = document.getElementById("fullTimeBtn");
const extraTimeBtn = document.getElementById("extraTimeBtn");
const endMatchBtn = document.getElementById("endMatchBtn");
const fieldImg = document.getElementById("fieldImg");

let startTime;
let timerInterval;
let isRunning = false;
let isFirstHalf = true;
let isExtraTime = false;

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
    startBtn.disabled = true;
    halfTimeBtn.disabled = false;
    halfTimeBtn.classList.remove("disabled");
  }
});

halfTimeBtn.addEventListener("click", () => {
  if (isRunning && isFirstHalf) {
    clearInterval(timerInterval);
    isRunning = false;
    halfTimeBtn.disabled = true;
    fullTimeBtn.disabled = false;
    fullTimeBtn.classList.remove("disabled");
    isFirstHalf = false;
  }
});

fullTimeBtn.addEventListener("click", () => {
  if (!isRunning && !isFirstHalf) {
    fullTimeBtn.textContent = "Confirm End";
    extraTimeBtn.disabled = false;
    extraTimeBtn.classList.remove("disabled");
  }
});

extraTimeBtn.addEventListener("click", () => {
  if (!isRunning && !isFirstHalf && fullTimeBtn.textContent === "Confirm End") {
    isExtraTime = true;
    fullTimeBtn.textContent = "Full Time";
    extraTimeBtn.disabled = true;
    startBtn.disabled = false;
    startBtn.classList.remove("disabled");
  }
});

endMatchBtn.addEventListener("click", () => {
  alert("Match has ended!");
  window.location.reload();
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
