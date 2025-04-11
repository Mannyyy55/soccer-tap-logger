const timerDisplay = document.getElementById("timer");
const field = document.getElementById("field");
const fieldImg = document.getElementById("fieldImg");

const startBtn = document.getElementById("startBtn");
const halfBtn = document.getElementById("halfBtn");
const secondHalfBtn = document.getElementById("secondHalfBtn");
const extraTimeBtn = document.getElementById("extraTimeBtn");
const fullTimeBtn = document.getElementById("fullTimeBtn");
const downloadCsvBtn = document.getElementById("downloadCsvBtn");
const halfDurationSelect = document.getElementById("halfDuration");

let startTime, timerInterval;
let isRunning = false;
let csvData = [["Time", "X", "Y", "Phase"]];
let currentPhase = "1st Half";

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

function startClock(phaseName) {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 500);
  isRunning = true;
  currentPhase = phaseName;
}

function stopClock() {
  clearInterval(timerInterval);
  isRunning = false;
}

function toggleButtons(disableList = [], enableList = []) {
  disableList.forEach(btn => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });
  enableList.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("disabled");
  });
}

startBtn.addEventListener("click", () => {
  startClock("1st Half");
  toggleButtons([startBtn], [halfBtn]);
});

halfBtn.addEventListener("click", () => {
  stopClock();
  toggleButtons([halfBtn], [secondHalfBtn]);
});

secondHalfBtn.addEventListener("click", () => {
  startClock("2nd Half");
  toggleButtons([secondHalfBtn], [fullTimeBtn, extraTimeBtn]);
});

extraTimeBtn.addEventListener("click", () => {
  startClock("Extra Time");
  toggleButtons([extraTimeBtn], [fullTimeBtn]);
});

fullTimeBtn.addEventListener("click", () => {
  stopClock();
  toggleButtons([fullTimeBtn], []);
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

  const timestamp = timerDisplay.textContent;
  csvData.push([timestamp, x, y, currentPhase]);
});

downloadCsvBtn.addEventListener("click", () => {
  let csvContent = "data:text/csv;charset=utf-8," + csvData.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "soccer_log.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});
