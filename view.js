// view.js
import { dbFS } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

let ntcChart, ptcChart;

const datePicker = document.getElementById("datePicker");
const loadBtn = document.getElementById("loadBtn");

loadBtn.addEventListener("click", loadData);

async function loadData() {
  const date = datePicker.value;
  if (!date) {
    alert("Select a date first!");
    return;
  }

  const logsRef = collection(dbFS, "temperature", date, "logs");

  const snap = await getDocs(logsRef);

  if (snap.empty) {
    alert("No logs found for this date.");
    return;
  }

  const times = [];
  const ntcValues = [];
  const ptcValues = [];

  snap.forEach((doc) => {
    const d = doc.data();
    times.push(d.time);
    ntcValues.push(d.NTC);
    ptcValues.push(d.PTC);
  });

  drawGraph("ntcChart", "NTC Temperature °C", times, ntcValues, (c) => ntcChart = c, ntcChart);
  drawGraph("ptcChart", "PTC Temperature °C", times, ptcValues, (c) => ptcChart = c, ptcChart);
}

function drawGraph(canvasId, label, times, values, saveChart, oldChart) {
  if (oldChart) oldChart.destroy();

  const ctx = document.getElementById(canvasId).getContext("2d");

  // Create gradient for line
  const gradient = ctx.createLinearGradient(0, 0, 0, 150);
  if (canvasId === "ntcChart") {
    gradient.addColorStop(0, "rgba(75, 123, 236, 0.5)");
    gradient.addColorStop(1, "rgba(75, 123, 236, 0.05)");
  } else {
    gradient.addColorStop(0, "rgba(255, 77, 77, 0.5)");
    gradient.addColorStop(1, "rgba(255, 77, 77, 0.05)");
  }

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: times,
      datasets: [{
        label: label,
        data: values,
        borderWidth: 3,
        borderColor: canvasId === "ntcChart" ? "#4b7bec" : "#ff4d4d",
        backgroundColor: gradient,
        pointBackgroundColor: canvasId === "ntcChart" ? "#4b7bec" : "#ff4d4d",
        pointBorderColor: "#fff",
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35, // smooth curves
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 14,
              weight: '600'
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#333',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: 10,
          cornerRadius: 6
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      },
      scales: {
        x: { 
          title: { display: true, text: "Time", font: { size: 14, weight: "600" } },
          grid: { color: "#e0e0e0" }
        },
        y: { 
          title: { display: true, text: "Temperature (°C)", font: { size: 14, weight: "600" } },
          grid: { color: "#e0e0e0" }
        }
      }
    }
  });

  saveChart(chart);
}
