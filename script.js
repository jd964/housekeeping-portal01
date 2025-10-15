const attendants = ["Hilda", "Jonnah", "Mayte", "Kennedy", "Angie", "Elvia"];
const rooms = [];
let id = 101;
for (let f = 1; f <= 3; f++) {
  for (let i = 1; i <= 20; i++) {
    const num = id++;
    const assigned = attendants[Math.floor(Math.random() * attendants.length)];
    rooms.push({room: num, attendant: assigned, status: "Dirty"});
  }
}

const grid = document.getElementById("roomGrid");
const modal = document.getElementById("checklistModal");
const modalRoom = document.getElementById("modalRoom");
const closeModal = document.getElementById("closeModal");

function renderRooms(filter = "all") {
  grid.innerHTML = "";
  rooms.forEach(r => {
    if (filter !== "all" && r.attendant !== filter) return;
    const div = document.createElement("div");
    div.className = "room";
    div.innerHTML = `
      <h3>Room ${r.room}</h3>
      <p>${r.attendant}</p>
      <div class="status ${getStatusClass(r.status)}">${r.status}</div>
    `;
    div.onclick = () => advanceStatus(r);
    div.ondblclick = () => openChecklist(r.room);
    grid.appendChild(div);
  });
}

function getStatusClass(status) {
  return {
    "Dirty": "dirty",
    "In Progress": "progress",
    "Clean": "clean",
    "Inspected": "inspected"
  }[status];
}

function advanceStatus(r) {
  const order = ["Dirty", "In Progress", "Clean", "Inspected"];
  const idx = order.indexOf(r.status);
  r.status = order[(idx + 1) % order.length];
  saveRooms();
  renderRooms(document.getElementById("filterSelect").value);
}

function saveRooms() {
  localStorage.setItem("housekeepingRooms", JSON.stringify(rooms));
}

function loadRooms() {
  const saved = localStorage.getItem("housekeepingRooms");
  if (saved) {
    const parsed = JSON.parse(saved);
    parsed.forEach((p, i) => rooms[i] = p);
  }
}

function openChecklist(roomNum) {
  modal.style.display = "flex";
  modalRoom.textContent = `Checklist – Room ${roomNum}`;
}

closeModal.onclick = () => modal.style.display = "none";

document.getElementById("filterSelect").onchange = e => renderRooms(e.target.value);
document.getElementById("resetBtn").onclick = () => {
  if (confirm("Reset all statuses to Dirty?")) {
    rooms.forEach(r => r.status = "Dirty");
    saveRooms();
    renderRooms();
  }
};

function updateDate() {
  const d = new Date();
  document.getElementById("date").textContent = d.toLocaleString();
}
setInterval(updateDate, 1000);

loadRooms();
renderRooms();
updateDate();
