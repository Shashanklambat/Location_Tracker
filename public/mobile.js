const socket = io();
const username = localStorage.getItem("username");

document.getElementById("welcome").innerText =
  "Welcome, " + username;

function startTracking() {
  if (!navigator.geolocation) {
    alert("GPS not supported");
    return;
  }

  navigator.geolocation.watchPosition(
    pos => {
      socket.emit("locationUpdate", {
        user: username,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      });

      document.getElementById("status").innerText =
        "Tracking started...";
    },
    err => {
      document.getElementById("status").innerText =
        "GPS Error: " + err.message;
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000
    }
  );
}
