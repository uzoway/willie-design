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
}

window.addEventListener("DOMContentLoaded", initializeAllScripts);
