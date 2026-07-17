(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  //  1. FOOTER YEAR
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  //  2. NAV: scrolled state, mobile toggle, active-link tracking
  const navWrap = document.getElementById("navWrap");
  const navLinks = document.getElementById("navLinks");
  const navToggle = document.getElementById("navToggle");
  const navLinkEls = Array.from(document.querySelectorAll("[data-nav]"));
  const sections = navLinkEls
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  function onScrollNav() {
    navWrap.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  navToggle?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinkEls.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Active section highlighting via IntersectionObserver
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        navLinkEls.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
  );
  sections.forEach((section) => navObserver.observe(section));

  //  3. SCROLL REVEAL
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  //  4. TIMELINE LINE FILL (animates as the timeline scrolls into view)
  function wireTimelineFill(timelineSelector, fillId) {
    const timeline = document.querySelector(timelineSelector);
    const fill = document.getElementById(fillId);
    if (!timeline || !fill) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fill.style.height = "100%";
          } else if (entry.boundingClientRect.top > 0) {
            fill.style.height = "0%";
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(timeline);
  }
  wireTimelineFill("#education .timeline", "eduLineFill");
  wireTimelineFill("#experience .timeline", "expLineFill");

  //  5. ANIMATED COUNTERS (hero stat chips)
  const counters = document.querySelectorAll("[data-counter]");
  const counterObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-counter"), 10) || 0;
        if (prefersReducedMotion) {
          el.textContent = target;
        } else {
          let current = 0;
          const duration = 900;
          const start = performance.now();
          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            current = Math.round(eased * target);
            el.textContent = current;
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
        obs.unobserve(el);
      });
    },
    { threshold: 0.4 },
  );
  counters.forEach((el) => counterObserver.observe(el));

  //  6. PROFICIENCY BARS (fill width on scroll into view)
  const fills = document.querySelectorAll(".proficiency__fill");
  const fillObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.width = `${el.getAttribute("data-fill")}%`;
        obs.unobserve(el);
      });
    },
    { threshold: 0.3 },
  );
  fills.forEach((el) => fillObserver.observe(el));

  //  7. SKILL PILL TOOLTIP (shows proficiency level on hover/focus)
  document
    .querySelectorAll(".pill-row--interactive .pill[data-level]")
    .forEach((pill) => {
      pill.setAttribute(
        "title",
        `Proficiency: ${pill.getAttribute("data-level")}%`,
      );
    });

  //  8. PROJECT FILTERING
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const cats = card.getAttribute("data-cat").split(" ");
        const show = filter === "all" || cats.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });
    });
  });

  //  9. BUTTON RIPPLE MICRO-INTERACTION
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      if (prefersReducedMotion) return;
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  //  10. CONTACT FORM VALIDATION
  const form = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  const validators = {
    name: (v) => v.trim().length >= 2 || "Please enter your full name.",
    email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ||
      "Please enter a valid email address.",
    subject: (v) => v.trim().length >= 3 || "Please add a short subject.",
    message: (v) =>
      v.trim().length >= 10 || "Message should be at least 10 characters.",
  };

  function setFieldError(field, message) {
    const row = form.querySelector(`#${field}`).closest(".form-row");
    const errorEl = form.querySelector(`[data-error-for="${field}"]`);
    if (message) {
      row.classList.add("has-error");
      errorEl.textContent = message;
    } else {
      row.classList.remove("has-error");
      errorEl.textContent = "";
    }
  }

  function validateField(field) {
    const input = form.querySelector(`#${field}`);
    const result = validators[field](input.value);
    setFieldError(field, result === true ? "" : result);
    return result === true;
  }

  if (form) {
    Object.keys(validators).forEach((field) => {
      const input = form.querySelector(`#${field}`);
      input.addEventListener("blur", () => validateField(field));
      input.addEventListener("input", () => {
        if (input.closest(".form-row").classList.contains("has-error")) {
          validateField(field);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fields = Object.keys(validators);
      const results = fields.map(validateField);
      const allValid = results.every(Boolean);

      if (!allValid) {
        formNote.textContent =
          "Please fix the highlighted fields before sending.";
        formNote.classList.add("is-error");
        return;
      }

      const submitBtn = document.getElementById("submitBtn");
      const label = submitBtn.querySelector(".btn__label");
      const originalLabel = label.textContent;

      submitBtn.disabled = true;
      label.textContent = "Sending...";

      try {
        const formData = new FormData(form);

        const response = await fetch("https://formspree.io/f/yourFormId", {
          method: "POST",
          body: formData,
          headers: {
            Accept: "application/json",
          },
        });

        if (response.ok) {
          window.location.href =
            "https://gen-x-ngl.vercel.app/pages/messageSend.html?user=rafi";
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        formNote.textContent = "Something went wrong. Please try again.";
        formNote.classList.add("is-error");
      } finally {
        submitBtn.disabled = false;
        label.textContent = originalLabel;
      }
    });
  }

  //  11. HERO HEADLINE WORD-SWAP
  const titleSwap = document.getElementById("titleSwap");
  const words = ["graphs.", "software.", "models.", "ideas."];
  let wordIndex = 0;

  if (titleSwap && !prefersReducedMotion) {
    setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      titleSwap.style.opacity = "0";
      titleSwap.style.transform = "translateY(6px)";
      setTimeout(() => {
        titleSwap.textContent = words[wordIndex];
        titleSwap.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        titleSwap.style.opacity = "1";
        titleSwap.style.transform = "translateY(0)";
      }, 350);
    }, 2600);
  }

  //  12. HERO CANVAS — animated node/edge graph background

  const canvas = document.getElementById("graphCanvas");

  if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width, height, nodes, animationId;
    const NODE_COUNT_BASE = 60;
    const LINK_DIST = 130;

    function resize() {
      width = canvas.width = canvas.offsetWidth * devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * devicePixelRatio;
    }

    function initNodes() {
      const area = canvas.offsetWidth * canvas.offsetHeight;
      const count = Math.min(
        70,
        Math.max(24, Math.round((area / 1000000) * NODE_COUNT_BASE)),
      );
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio,
        r: (Math.random() * 1.6 + 1.2) * devicePixelRatio,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, width, height);

      // Update positions
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      });

      // Draw edges between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = LINK_DIST * devicePixelRatio;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.35;
            ctx.strokeStyle = `rgba(184, 118, 62, ${alpha})`;
            ctx.lineWidth = devicePixelRatio;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(61, 90, 91, 0.45)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(step);
    }

    function start() {
      cancelAnimationFrame(animationId);
      resize();
      initNodes();
      step();
    }

    start();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(start, 200);
    });

    // Pause animation when hero is off-screen to save CPU/battery
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!animationId) step();
          } else {
            cancelAnimationFrame(animationId);
            animationId = null;
          }
        });
      },
      { threshold: 0 },
    );
    heroObserver.observe(canvas.closest(".hero"));
  }
})();
