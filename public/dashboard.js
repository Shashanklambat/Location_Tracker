const map = L.map("map").setView([20, 78], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const socket = io();
const markers = {};
let followUser = null;

socket.on("locationBroadcast", users => {
  const list = document.getElementById("users");
  list.innerHTML = "<b>Live Devices</b>";

  const bounds = [];

  users.forEach(u => {
    const pos = [u.lat, u.lng];
    bounds.push(pos);

    if (!markers[u.user]) {
      const m = L.marker(pos).addTo(map);
      m.bindTooltip(u.user, { permanent: true });
      markers[u.user] = m;
    } else {
      markers[u.user].setLatLng(pos);
    }

    const div = document.createElement("div");
    div.innerText = u.user;
    div.onclick = () => {
      followUser = u.user;
      map.flyTo(pos, 14, { animate:true, duration:2 });
    };
    list.appendChild(div);
  });

  // Remove offline users
  for (let u in markers) {
    if (!users.find(x => x.user === u)) {
      map.removeLayer(markers[u]);
      delete markers[u];
    }
  }

  // Auto fit only if not following someone
  if (!followUser && bounds.length > 0) {
    map.fitBounds(bounds, { padding:[50,50] });
  }

  // Keep following selected user
  if (followUser && markers[followUser]) {
    map.panTo(markers[followUser].getLatLng(), { animate:true, duration:1 });
  }
});
