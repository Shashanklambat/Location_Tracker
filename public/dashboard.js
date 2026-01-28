const map = L.map("map").setView([20, 78], 5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

const socket = io();
const markers = {};
const bounds = L.latLngBounds();

socket.on("locationBroadcast", data => {
  const { user, lat, lng } = data;
  const pos = [lat, lng];

  if (!markers[user]) {
    const marker = L.marker(pos).addTo(map);

    marker.bindTooltip(user, {
      permanent: true,
      direction: "top",
      offset: [0, -10]
    });

    markers[user] = marker;
  } else {
    markers[user].setLatLng(pos);
  }

  bounds.extend(pos);

  map.fitBounds(bounds, {
    padding: [60, 60],
    maxZoom: 17
  });
});
