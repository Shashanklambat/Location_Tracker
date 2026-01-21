const map = L.map("map").setView([20, 78], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const socket = io();
const markers = {};

socket.on("locationBroadcast", data => {
  const { user, lat, lng } = data;

  if (!markers[user]) {
    // Create marker
    const marker = L.marker([lat, lng]).addTo(map);

    // Add name label
    marker.bindTooltip(user, {
      permanent: true,
      direction: "top",
      offset: [0, -10]
    });

    markers[user] = marker;
  } else {
    // Move marker
    markers[user].setLatLng([lat, lng]);
  }
});
