/* ============================================================
   SOTENIS LAVANDERIA — JavaScript
   Animations, interactions, and UI logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // === Navbar scroll effect ===
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Navbar background on scroll
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // === Back to top ===
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // === Mobile menu ===
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // === Smooth scroll for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // === Scroll reveal animations ===
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const triggerPoint = windowHeight * 0.85;

    revealElements.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerPoint) {
        el.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });
  // Trigger once on load
  setTimeout(revealOnScroll, 100);

  // === Counter animation ===
  const counters = document.querySelectorAll('.stat-number[data-target]');
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      countersAnimated = true;

      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out quad
          const easeOut = 1 - (1 - progress) * (1 - progress);
          const current = Math.floor(easeOut * target);

          counter.textContent = current.toLocaleString('pt-BR') + suffix;

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString('pt-BR') + suffix;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }
  }

  window.addEventListener('scroll', animateCounters, { passive: true });
  setTimeout(animateCounters, 500);

  // === Before & After slider ===
  document.querySelectorAll('[data-ba-slider]').forEach(slider => {
    const beforeImg = slider.querySelector('.ba-before');
    const handle = slider.querySelector('.ba-slider-handle');
    const sliderBtn = slider.querySelector('.ba-slider-btn');
    let isDragging = false;

    function updateSlider(x) {
      const rect = slider.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      percent = Math.max(5, Math.min(95, percent));

      beforeImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = `${percent}%`;
      if (sliderBtn) {
        sliderBtn.style.left = `${percent}%`;
      }
    }

    function startDrag(e) {
      isDragging = true;
      slider.style.cursor = 'col-resize';
      e.preventDefault();
    }

    function onDrag(e) {
      if (!isDragging) return;
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      updateSlider(x);
    }

    function stopDrag() {
      isDragging = false;
      slider.style.cursor = 'col-resize';
    }

    slider.addEventListener('mousedown', startDrag);
    slider.addEventListener('touchstart', startDrag, { passive: false });

    window.addEventListener('mousemove', onDrag);
    window.addEventListener('touchmove', onDrag, { passive: false });

    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchend', stopDrag);

    // Click to set position
    slider.addEventListener('click', (e) => {
      updateSlider(e.clientX);
    });
  });

  // === Typing effect on hero badge (subtle pulse) ===
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    setInterval(() => {
      heroBadge.style.boxShadow = '0 0 15px rgba(0, 212, 255, 0.15)';
      setTimeout(() => {
        heroBadge.style.boxShadow = 'none';
      }, 1000);
    }, 3000);
  }

  // === Parallax on hero particles ===
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const particles = heroSection.querySelectorAll('.particle');
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      particles.forEach((p, i) => {
        const speed = (i + 1) * 0.3;
        p.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // === Tilt effect on model cards ===
  document.querySelectorAll('.model-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // === Active nav link tracking ===
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  function updateActiveNav() {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinksAll.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--color-accent-primary)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // === Pricing card hover glow ===
  document.querySelectorAll('.pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 212, 255, 0.06) 0%, rgba(15, 20, 35, 0.7) 60%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });

  // === Preloader (optional - for polish) ===
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    // Trigger initial animations
    setTimeout(revealOnScroll, 200);
  });
});
