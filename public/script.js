("use strict");

function initializeAllScripts() {
  gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);
  CustomEase.create("custom-ease-out", "M0,0 C0.2,0.6 0.35,1 1,1 ");
  CustomEase.create("ease-in-out-quart", "0.77,0,0.175,1");

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

  // Loader animation
  function loadAnimation() {
    const loadTl = gsap.timeline({ defaults: { ease: "custom-ease-out" } });

    loadTl
      .to("[data-load-reveal]", {
        y: 0,
        "--clip-value": "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.2,
        delay: 0.3,
        stagger: 0.1,
      })
      .to("[data-fade-in]", { opacity: 1, duration: 0.8 }, "-=1")
      .to(
        "[data-heading-reveal]",
        {
          y: 0,
          "--clip-value": "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
          duration: 0.63,
          stagger: 0.15,
        },
        "-=1.25"
      )
      .to(
        "[data-slide-in]",
        {
          "--transform-value": "0",
          duration: 1.8,
          ease: "ease-in-out-quart",
        },
        "-=0.7"
      )
      .to(
        "[data-scale-in]",
        {
          scale: 1,
          duration: 1.8,
          ease: "ease-in-out-quart",
        },
        "<"
      );
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

    const mouseNextBtn = sliderContainer.querySelector(".next-control");
    const mousePrevBtn = sliderContainer.querySelector(".prev-control");
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

    function nextImageSlide() {
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
    }

    function prevImageSlide() {
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
    }

    nextBtn.addEventListener("click", nextImageSlide);
    prevBtn.addEventListener("click", prevImageSlide);
    mouseNextBtn.addEventListener("click", nextImageSlide);
    mousePrevBtn.addEventListener("click", prevImageSlide);

    // Initial button state
    updateButtonStates();
  }

  // Initialize the sliders
  document
    .querySelectorAll(".projects-item.slider")
    .forEach((sliderContainer) => {
      slideImages(sliderContainer);
    });

  // Mouse follow on image slider
  function moveCustomCursor(sliderContainer) {
    const controlArrow = sliderContainer.querySelector(".mouse-controls_arrow");
    const slider = sliderContainer;
    const mousePrevControl = sliderContainer.querySelector(".prev-control");

    if (!controlArrow || !slider || !mousePrevControl) return;

    const arrowWidth = controlArrow.offsetWidth / 2;
    const arrowHeight = controlArrow.offsetHeight / 2;

    let xTo = gsap.quickTo(controlArrow, "x", {
      duration: 0.4,
      ease: "power3",
    });
    let yTo = gsap.quickTo(controlArrow, "y", {
      duration: 0.4,
      ease: "power3",
    });

    let cursorMoveEnabled = false;

    function updateArrowPosition(e) {
      const sliderRect = slider.getBoundingClientRect();
      const mouseXPosition = e.clientX - sliderRect.left - arrowWidth;
      const mouseYPosition = e.clientY - sliderRect.top - arrowHeight;

      xTo(mouseXPosition);
      yTo(mouseYPosition);
    }

    function rotateArrow() {
      gsap.to(controlArrow, { rotation: -180, ease: "expo.inOut" });
    }

    function resetArrow() {
      gsap.to(controlArrow, { rotation: 0, ease: "expo.inOut" });
    }

    function enableCursorMove() {
      if (window.innerWidth > 797 && !cursorMoveEnabled) {
        cursorMoveEnabled = true;
        slider.addEventListener("mousemove", updateArrowPosition);
        mousePrevControl.addEventListener("mouseenter", rotateArrow);
        mousePrevControl.addEventListener("mouseleave", resetArrow);
      } else if (window.innerWidth <= 797 && cursorMoveEnabled) {
        disableCursorMove();
      }
    }

    function disableCursorMove() {
      cursorMoveEnabled = false;
      slider.removeEventListener("mousemove", updateArrowPosition);
      mousePrevControl.removeEventListener("mouseenter", rotateArrow);
      mousePrevControl.removeEventListener("mouseleave", resetArrow);
      gsap.set(controlArrow, { clearProps: "all" });
    }

    // Initial setup
    enableCursorMove();

    // Listen for window resize
    window.addEventListener("resize", enableCursorMove);

    // Clean up function
    return function cleanup() {
      disableCursorMove();
      window.removeEventListener("resize", enableCursorMove);
    };
  }

  // Calling the move custom cursor function for each slider
  document
    .querySelectorAll("[data-project-slider]")
    .forEach((sliderContainer) => {
      moveCustomCursor(sliderContainer);
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

  // Split Modal Title
  let modalTitle = document.querySelector("[data-modal-title]");

  let splitModalText = new SplitText(modalTitle, {
    type: "lines",
    linesClass: "modal-title_lines",
  });

  let modalLines = new SplitText(splitModalText.lines, {
    type: "lines",
    linesClass: "modal-lines",
  });

  // Create the timeline outside the function to avoid recreating it each time
  const modalRevealTl = gsap.timeline({
    defaults: { ease: "custom-ease-out" },
    paused: true,
    onStart: () => {
      document.querySelector(".c-header").classList.add("is-inactive");
    },
    onReverseComplete: () => {
      document.querySelector(".c-header").classList.remove("is-inactive");
    },
  });

  modalRevealTl
    .to(fadedOutElement, { autoAlpha: 0, duration: 0.3 })
    .to(".c-main .modal", { autoAlpha: 1, autoAlpha: 1 })
    .to("[data-modal-reveal], .modal-title_lines", {
      y: 0,
      "--clip-value": "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
      duration: 0.55,
      stagger: 0.05,
    })
    .to(
      "[data-modal-fade]",
      { autoAlpha: 1, duration: 0.5, stagger: 0.09 },
      "<+0.4"
    );

  // Function to control modal animation
  function revealModal() {
    if (modal.classList.contains("active")) {
      modalRevealTl.play();
    } else {
      modalRevealTl.reverse();
    }
  }

  modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      toggleModal();
      revealModal();
    });
  });
  modal.addEventListener("keydown", trapFocus);

  function toggleModal() {
    const isOpen = modal.classList.toggle("active");

    modalButtons.forEach((button) => {
      if (isOpen) {
        button.setAttribute("aria-expanded", "true");
        button.textContent = "Close";
      } else {
        button.setAttribute("aria-expanded", "false");
        button.textContent = "Info";
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
