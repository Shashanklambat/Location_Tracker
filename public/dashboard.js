const map = L.map("map").setView([20, 78], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const socket = io();

const markers = {};
const bounds = L.latLngBounds();
let autoFit = true;

const userListDiv = document.getElementById("userList");

// Stop auto-zoom when admin interacts
map.on("zoomstart mousedown", () => {
  autoFit = false;
});

// Receive live locations
socket.on("locationBroadcast", data => {
  const { user, lat, lng } = data;
  const position = [lat, lng];

  if (!markers[user]) {
    const marker = L.marker(position).addTo(map);
    marker.bindTooltip(user, {
      permanent: true,
      direction: "top"
    });
    markers[user] = marker;
  } else {
    markers[user].setLatLng(position);
  }

  bounds.extend(position);

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

// Render right-side live users list
function renderUserList() {
  userListDiv.innerHTML = "";

  Object.keys(markers).forEach(user => {
    const div = document.createElement("div");
    div.className = "user";
    div.innerText = user;

    div.onclick = () => {
      autoFit = false;
      map.setView(markers[user].getLatLng(), 17);
    };

    userListDiv.appendChild(div);
  });
}
