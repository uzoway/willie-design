("use strict");

function initializeAllScripts() {
  gsap.registerPlugin(CustomEase);

  CustomEase.create("ease-in-out-quint", "0.86,0,0.07,1");

  function initializePageLoadAnimation() {}

  initializePageLoadAnimation();

  // Toggle Grid Visualizer
  document.addEventListener("keydown", (event) => {
    if (event.shiftKey && event.key.toLowerCase() === "g") {
      document.querySelector(".overlay").classList.toggle("active");
    }
  });

  // Lenis smooth scroll
  const lenis = new Lenis();

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  const hours = document.querySelector("#hour");
  const minutes = document.querySelector("#minute");

  function updateTime() {
    const now = new Date();
    const currentHours = String(now.getUTCHours()).padStart(2, "0");
    const currentMinutes = String(now.getUTCMinutes()).padStart(2, "0");

    hours.textContent = currentHours;
    minutes.textContent = currentMinutes;
    // document.getElementById("time").textContent = `${hours}:${minutes}`;
  }

  // Update the time once initially
  updateTime();

  // Set an interval to update the time every minute
  setInterval(updateTime, 60000); // 60000 milliseconds = 1 minute
}

window.addEventListener("DOMContentLoaded", initializeAllScripts);
