// temperature.js
import { dbRT, rtdbRef, rtdbSet, onValue, dbFS, collection, doc, setDoc } from "./firebase.js";

// --- Elements ---
const ntcTempEl = document.querySelector(".ntc-temp");
const ptcTempEl = document.querySelector(".ptc-temp");
const logBtn1 = document.querySelector(".log-btn1");
const logBtn2 = document.querySelector(".log-btn2");

// --- Variables ---
let ntcValue = 0;
let ptcValue = 0;

// --- Realtime DB listeners ---
onValue(rtdbRef(dbRT, "NTCtemp"), (snap) => {
  const val = snap.val();
  if (val !== null) {
    ntcValue = val;
    ntcTempEl.textContent = val + "°C";
    console.log("NTC updated:", val);
  }
});

onValue(rtdbRef(dbRT, "PTCtemp"), (snap) => {
  const val = snap.val();
  if (val !== null) {
    ptcValue = val;
    ptcTempEl.textContent = val + "°C";
    console.log("PTC updated:", val);
  }
});

// --- Logging Function ---
async function triggerLog() {
  try {
    console.log("TriggerLog started...");

    // 1️⃣ Trigger ESP32 LED via RTDB
    const detectRef = rtdbRef(dbRT, "detect");
    console.log("Setting detect = 1");
    await rtdbSet(detectRef, 1);
    setTimeout(() => rtdbSet(detectRef, 0), 300);

    // 2️⃣ Prepare timestamp (12-hour format)
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");

    let hours = now.getHours();              // 0-23
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;              // 0 → 12

    const minStr = String(minutes).padStart(2, "0");
    const secStr = String(seconds).padStart(2, "0");
    const time = `${hours}:${minStr}:${secStr} ${ampm}`; // "4:38:00 PM"
    const date = `${yyyy}-${mm}-${dd}`;

    console.log("Date:", date, "Time:", time);

    // 3️⃣ Firestore references
    const dateDocRef = doc(dbFS, "temperature", date); // Document for today
    const logsColRef = collection(dateDocRef, "logs");  // Subcollection "logs"
    const logDocRef = doc(logsColRef);                 // Auto-ID document

    console.log("Writing to Firestore at:", logDocRef.path);

    // 4️⃣ Write log
    await setDoc(logDocRef, { NTC: ntcValue, PTC: ptcValue, time });

    console.log("✅ Logged successfully:", ntcValue, ptcValue, time);
  } catch (err) {
    console.error("Logging error:", err);
  }
}

// --- Attach to buttons ---
document.addEventListener("DOMContentLoaded", () => {
  if (logBtn1) logBtn1.addEventListener("click", triggerLog);
  if (logBtn2) logBtn2.addEventListener("click", triggerLog);
});
