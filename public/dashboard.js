const map = L.map("map").setView([20, 78], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const socket = io();
const markers = {};

socket.on("locationBroadcast", data => {
  const { user, lat, lng } = data;

  if (!markers[user]) {
    markers[user] = L.marker([lat, lng])
      .addTo(map)
      .bindPopup(user);
  } else {
    markers[user].setLatLng([lat, lng]);
  }
});
