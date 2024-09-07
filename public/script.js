("use strict");

function initializeAllScripts() {
  gsap.registerPlugin(CustomEase, ScrollTrigger);

  CustomEase.create("ease-in-out-quint", "0.86,0,0.07,1");

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

  function loadAnimation() {
    const mainSection = document.querySelector(".c-main");

    gsap.to(mainSection, {
      "--clip-path-value": "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1,
      scrollTrigger: {
        trigger: ".c-main_container",
        start: "top top",
        scrub: true,
        end: () => "+=100",
        pin: true,
      },
    });
  }

  loadAnimation();

  // Header nav time update
  function updateTime(footerGmtTime) {
    const hours = footerGmtTime.querySelector("#hour");
    const minutes = footerGmtTime.querySelector("#minute");

    const now = new Date();
    const currentHours = String(now.getUTCHours()).padStart(2, "0");
    const currentMinutes = String(now.getUTCMinutes()).padStart(2, "0");

    hours.textContent = currentHours;
    minutes.textContent = currentMinutes;
  }

  // updateTime();
  document.querySelectorAll(".gmt-time").forEach((footerGmtTime) => {
    updateTime(footerGmtTime);
  });

  setInterval(() => {
    document.querySelectorAll(".gmt-time").forEach((footerGmtTime) => {
      updateTime(footerGmtTime);
    });
  }, 60000);

  // Image slider
  function slideImages(sliderContainer) {
    // Scoped selectors
    const nextBtn = sliderContainer.querySelector(".next-button");
    const prevBtn = sliderContainer.querySelector(".prev-button");
    const leftImageWrapper = sliderContainer.querySelector(
      ".left-image_wrapper"
    );
    const images = sliderContainer.querySelectorAll(".left-image");
    const totalImages = images.length;
    let currentIndex = 0;

    function updateButtonStates() {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === totalImages - 1;
      prevBtn.style.opacity = currentIndex === 0 ? 0.5 : 1;
      nextBtn.style.opacity = currentIndex === totalImages - 1 ? 0.5 : 1;
    }

    function buttonPressEffect(element) {
      element.style.transform = "scale(0.9)";
      setTimeout(() => {
        element.style.transform = "scale(1)";
        element.style.transition = "transform 0.2s ease-out";
      }, 200);
    }

    // Next button animation
    nextBtn.addEventListener("click", () => {
      if (currentIndex < totalImages - 1) {
        let lastChild = leftImageWrapper.querySelector(
          ".left-image:last-child"
        );

        buttonPressEffect(nextBtn);

        lastChild.style.animation = "slide-left .65s ease-out forwards";

        setTimeout(() => {
          lastChild.style.animation = "";

          leftImageWrapper.prepend(lastChild);
          currentIndex++;
          updateButtonStates();
        }, 800);
      }
    });

    // Previous button animation
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        let firstChild = leftImageWrapper.querySelector(
          ".left-image:first-child"
        );

        buttonPressEffect(prevBtn);

        gsap
          .timeline()
          .set(firstChild, {
            x: -500,
            clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
            onComplete: () => {
              leftImageWrapper.append(firstChild);
            },
          })
          .to(firstChild, {
            x: 0,
            duration: 0.6,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
            onComplete: () => {
              currentIndex--;
              updateButtonStates();
            },
          });
      }
    });

    // Initial button state
    updateButtonStates();
  }

  // Initialize the sliders
  document
    .querySelectorAll(".projects-item.slider")
    .forEach((sliderContainer) => {
      slideImages(sliderContainer);
    });

  // Update footer year to current year
  function updateFooterYearToCurrentYear() {
    const footerYear = document.querySelector(".year");
    const currentYear = new Date().getFullYear();
    footerYear.innerHTML = currentYear;
  }

  updateFooterYearToCurrentYear();

  // Modal toggle functionality
  const modalButtons = document.querySelectorAll("[data-modal-button='open']");
  const fadedOutElement = document.querySelectorAll("[data-faded-out='true']");
  const modal = document.querySelector("#modal");
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const modalFocusableElements = modal.querySelectorAll(focusableElements);
  const firstFocusableElement = modalFocusableElements[0];
  const lastFocusableElement =
    modalFocusableElements[modalFocusableElements.length - 1];

  modalButtons.forEach((button) => {
    button.addEventListener("click", () => toggleModal());
  });
  modal.addEventListener("keydown", trapFocus);

  function toggleModal() {
    const isOpen = modal.classList.toggle("active");

    modalButtons.forEach((button) => {
      if (isOpen) {
        button.setAttribute("aria-expanded", "true");
        button.textContent = "Close";
        fadedOutElement.forEach((element) => {
          element.classList.add("is-faded_out");
        });
      } else {
        button.setAttribute("aria-expanded", "false");
        button.textContent = "Info";
        fadedOutElement.forEach((element) => {
          element.classList.remove("is-faded_out");
        });
      }
    });

    modalFocusableElements.forEach((elem) =>
      elem.setAttribute("tabindex", isOpen ? "0" : "-1")
    );

    if (isOpen) {
      modal.focus();
    } else {
      modalButtons[0].focus();
    }
  }

  function trapFocus(e) {
    if (e.key === "Tab") {
      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstFocusableElement) {
          e.preventDefault();
          lastFocusableElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastFocusableElement) {
          e.preventDefault();
          firstFocusableElement.focus();
        }
      }
    } else if (e.key === "Escape") {
      toggleModal();
    }
  }
}

// window.addEventListener("DOMContentLoaded", initializeAllScripts);
document.addEventListener("DOMContentLoaded", initializeAllScripts);
