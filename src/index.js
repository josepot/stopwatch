import getFormattedTime from "./getFormattedTime.js";
import getCounter from "./getCounter.js";

const counterEl = document.getElementById("timer");
const mainButton = document.getElementById("mainButton");
const secondaryButton = document.getElementById("secondaryButton");
const lapTable = document.getElementById("lapTable");

const [getCounterState, dispatchCounter] = getCounter((elapsedTime) => {
  counterEl.childNodes[0].replaceWith(getFormattedTime(elapsedTime));
});

/*inteface Laps {
  min?: { idx: number; time: number };
  max?: { idx: number; time: number };
  nRows: number;
  total: number;
}*/
let laps = {
  nRows: 0,
  total: 0,
};

const LapType = {
  MIN: "min",
  MAX: "max",
  DEFAULT: "",
};

function createLap(elapsedTime) {
  const time = elapsedTime - laps.total;

  const indexCol = document.createElement("td");
  indexCol.appendChild(document.createTextNode(`Lap ${laps.nRows + 1}`));

  const timeCol = document.createElement("td");
  timeCol.appendChild(document.createTextNode(getFormattedTime(time)));

  const row = document.createElement("tr");
  row.appendChild(indexCol);
  row.appendChild(timeCol);
  lapTable.prepend(row);

  const prevLaps = { ...laps };
  laps.total = elapsedTime;
  laps.nRows += 1;

  if (laps.nRows === 1) {
    laps.max = laps.min = { idx: 1, time };
    return;
  }

  // prettier-ignore
  const lapType =
    time < laps.min.time ? LapType.MIN :
    time > laps.max.time ? LapType.MAX : LapType.DEFAULT;

  if (lapType !== LapType.DEFAULT) {
    laps[lapType] = { idx: laps.nRows, time };
  }

  if (laps.nRows === 2) {
    lapTable.children[laps.nRows - laps.min.idx].className = LapType.MIN;
    lapTable.children[laps.nRows - laps.max.idx].className = LapType.MAX;
    return;
  }

  if (lapType !== LapType.DEFAULT) {
    lapTable.children[laps.nRows - laps[lapType].idx].className = lapType;
    lapTable.children[laps.nRows - prevLaps[lapType].idx].removeAttribute(
      "class"
    );
  }
}

function resetLaps() {
  lapTable.innerHTML = "";
  laps.nRows = 0;
  laps.total = 0;
}

mainButton.onclick = () => {
  if (getCounterState().isRunning) {
    dispatchCounter("stop");
    mainButton.childNodes[0].replaceWith("Start");
    mainButton.className = "stopped";
    secondaryButton.childNodes[0].replaceWith("Reset");
  } else {
    dispatchCounter("start");
    mainButton.childNodes[0].replaceWith("Stop");
    mainButton.className = "started";
    secondaryButton.childNodes[0].replaceWith("Lap");
  }
};

secondaryButton.onclick = () => {
  if (getCounterState().isRunning) {
    createLap(getCounterState().elapsedTime);
  } else {
    dispatchCounter("reset");
    resetLaps();
  }
};
