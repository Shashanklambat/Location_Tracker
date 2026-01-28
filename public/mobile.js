const socket = io();
const username = localStorage.getItem("username");
let watchId = null;

const btn = document.getElementById("btn");
const status = document.getElementById("status");

btn.onclick = () => {
  if (watchId === null) {
    watchId = navigator.geolocation.watchPosition(pos => {
      socket.emit("sendLocation", {
        user: username,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });
    }, console.error, { enableHighAccuracy:true });

    btn.innerText = "Stop Tracking";
    status.innerText = "Tracking ON";
  } else {
    navigator.geolocation.clearWatch(watchId);
    socket.emit("stopTracking");
    watchId = null;
    btn.innerText = "Start Tracking";
    status.innerText = "Not Tracking";
  }
};
