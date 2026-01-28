const socket = io();

const username = localStorage.getItem("username");
if (!username) window.location.href = "/";

const startBtn = document.getElementById("startBtn");
const statusText = document.getElementById("status");

let watchId = null;

startBtn.onclick = () => {
  if (!navigator.geolocation) {
    alert("GPS not supported");
    return;
  }

  statusText.innerText = "📡 Live Tracking ON";

  watchId = navigator.geolocation.watchPosition(pos => {
    socket.emit("sendLocation", {
      user: username,
      lat: pos.coords.latitude,
      lng: pos.coords.longitude
    });
  }, () => {
    alert("Enable GPS");
  }, {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 10000
  });

  startBtn.disabled = true;
};

window.onbeforeunload = () => {
  if (watchId) navigator.geolocation.clearWatch(watchId);
};
