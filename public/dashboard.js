const map = L.map("map").setView([20, 78], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const socket = io();

const markers = {};
const bounds = L.latLngBounds();
let autoFit = true;

// stop auto fit if admin touches map
map.on("mousedown zoomstart", () => {
  autoFit = false;
});

// smooth pan to a user
function smoothFocus(latlng) {
  map.flyTo(latlng, Math.max(map.getZoom(), 16), {
    animate: true,
    duration: 1.2
  });
}

// animate marker movement
function animateMarker(marker, from, to) {
  let start = null;
  const duration = 1000;

  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);

    const lat = from.lat + (to.lat - from.lat) * progress;
    const lng = from.lng + (to.lng - from.lng) * progress;

    marker.setLatLng([lat, lng]);

    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

// UI list
const userListDiv = document.getElementById("userList");

function renderUserList() {
  userListDiv.innerHTML = "";
  Object.keys(markers).forEach(user => {
    const div = document.createElement("div");
    div.className = "user";
    div.innerText = user;

    div.onclick = () => {
      autoFit = false;
      smoothFocus(markers[user].getLatLng());
    };

    userListDiv.appendChild(div);
  });
}

// Receive GPS updates
socket.on("locationBroadcast", data => {
  const { user, lat, lng } = data;
  const newPos = L.latLng(lat, lng);

  if (!markers[user]) {
    const marker = L.marker(newPos).addTo(map);
    marker.bindTooltip(user, { permanent: true, direction: "top" });
    markers[user] = marker;
    bounds.extend(newPos);
  } else {
    const oldPos = markers[user].getLatLng();
    animateMarker(markers[user], oldPos, newPos);
  }

  bounds.extend(newPos);

  if (autoFit) {
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  }

  renderUserList();
});

// Remove user on disconnect
socket.on("userDisconnected", user => {
  if (markers[user]) {
    map.removeLayer(markers[user]);
    delete markers[user];
    renderUserList();
  }
});
