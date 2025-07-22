function updateTime() {
  const now = new Date();
  let hours = now.getHours().toString().padStart(2, '0');
  let minutes = now.getMinutes().toString().padStart(2, '0');
  document.getElementById("currentTime").textContent = `${hours}:${minutes}`;
}

updateTime();
setInterval(updateTime, 30000);

