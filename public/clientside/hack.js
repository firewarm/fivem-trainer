const socket = io();
let state = {};

const events = [
  {
    event: "inject",
    text: () => state.injected ? "Close trainer" : "Inject",
    type: "button",
  },
  {
    event: "spawn_car",
    text: "Spawn a car",
    type: "button",
    value: () => window.prompt("Car name?")
  },
  {
    event: "read_health",
    text: "Read players health",
    type: "button"
  }
];


const stateUpdate = () => {
  const container = document.querySelector(".centerContainer");
  container.innerHTML = "";

  for (let i = 0; i < events.length; i++) {
    const e = events[i];
    const btn = document.createElement("a");
    btn.className = "button";
    btn.dataset.event = e.event;
    btn.innerHTML = typeof e.text === "function" ? e.text() : e.text;
    btn.onclick = () => socket.emit("event", e.event, typeof e.value === "function" ? e.value() : e.value);
    container.appendChild(btn);
  }
}

socket.on('state', (newState) => {
  console.log(newState);
  state = newState;
  stateUpdate();
});

document.body.onload = () => stateUpdate();