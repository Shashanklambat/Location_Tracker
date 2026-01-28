const socket = io();

const username = localStorage.getItem("username");
if (!username) {
  window.location.href = "/";
}

const startBtn = document.getElementById("startBtn");
const statusText = document.getElementById("status");

startBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  statusText.innerText = "📡 Starting live tracking...";

  navigator.geolocation.watchPosition(
    position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      socket.emit("sendLocation", {
        user: username,
        lat,
        lng
      });
    },
    error => {
      alert("Location error. Enable GPS & allow permission.");
      console.error(error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10000
    }
  );

  startBtn.disabled = true;
});
