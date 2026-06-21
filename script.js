/* ==========================================================================
   INITIALIZATION & CONSTANTS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTheme();
  initTypewriter();
  initCanvasBackground();
  initScrollAnimations();
  initProjectCardGlows();
  initPlaygroundWidgets();
  initContactForm();
});

/* ==========================================================================
   NAVBAR & MOBILE NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('btn-back-to-top');

  // Toggle Mobile Menu
  mobileToggle.addEventListener('click', () => {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close Mobile Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Handle Scroll Effects (Navbar Shadow & Back to Top)
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('show');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('show');
    }
  });
}

/* ==========================================================================
   DARK/LIGHT THEME CONTROLLER
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check Local Storage or default to dark
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  if (currentTheme === 'light') {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
    themeIcon.className = 'fa-solid fa-sun';
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
    themeIcon.className = 'fa-solid fa-moon';
  }

  themeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      themeIcon.className = 'fa-solid fa-sun';
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      themeIcon.className = 'fa-solid fa-moon';
      localStorage.setItem('theme', 'dark');
    }
    
    // Dispatch event to update canvas particle color
    window.dispatchEvent(new Event('themechanged'));
  });
}

/* ==========================================================================
   TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  const phrases = [
    'B.Sc. IT Undergrad',
    'Full-Stack Developer',
    'UI/UX Enthusiast',
    'Roblox Scripting Developer',
    'Local AI Experimenter'
  ];
  
  let phraseIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      // Deleting characters
      textElement.textContent = currentPhrase.substring(0, characterIndex - 1);
      characterIndex--;
      typingSpeed = 50;
    } else {
      // Typing characters
      textElement.textContent = currentPhrase.substring(0, characterIndex + 1);
      characterIndex++;
      typingSpeed = 120;
    }

    // Switch states
    if (!isDeleting && characterIndex === currentPhrase.length) {
      // Pause at full phrase
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && characterIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
  }

  if (textElement) {
    type();
  }
}

/* ==========================================================================
   PARTICLE NETWORK CANVAS BACKGROUND
   ========================================================================== */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  let particles = [];
  const maxParticles = Math.min(60, Math.floor((width * height) / 25000)); // Performance scale
  
  // Set Particle colors based on theme
  let particleColor = 'rgba(99, 102, 241, 0.2)';
  let lineColor = 'rgba(99, 102, 241, 0.04)';
  
  function updateColors() {
    const isLight = document.body.classList.contains('light-theme');
    particleColor = isLight ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.2)';
    lineColor = isLight ? 'rgba(99, 102, 241, 0.04)' : 'rgba(99, 102, 241, 0.04)';
  }
  
  updateColors();
  window.addEventListener('themechanged', updateColors);
  
  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();
    }
  }
  
  // Populate particles list
  function setupParticles() {
    particles = [];
    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }
  }
  
  setupParticles();
  
  // Resize Handler
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    setupParticles();
  });
  
  // Connect particles with lines
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = (1 - dist / 150) * 1.2;
          ctx.stroke();
        }
      }
    }
  }
  
  // Loop animation
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    drawLines();
    requestAnimationFrame(animate);
  }
  
  animate();
}

/* ==========================================================================
   SCROLL INTERSECTION OBSERVER
   ========================================================================== */
function initScrollAnimations() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  // Intersection Observer for Active Link Highlighting
  const options = {
    root: null,
    threshold: 0.25, // Trigger when 25% of section is visible
    rootMargin: "-80px 0px 0px 0px" // offset navbar height
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, options);
  
  sections.forEach(section => {
    observer.observe(section);
  });
  
  // Scroll reveal effects
  const revealCards = document.querySelectorAll('.project-card, .skill-category-card, .timeline-item, .uiverse-showcase-card');
  
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target); // Reveal only once
      }
    });
  }, revealOptions);
  
  const revealCardsArray = Array.from(revealCards);
  revealCardsArray.forEach(card => {
    // Add base class for animation trigger
    card.classList.add('scroll-reveal');
    revealObserver.observe(card);
  });
}

/* ==========================================================================
   PROJECT CARDS MOUSE GLOW
   ========================================================================== */
function initProjectCardGlows() {
  const cards = document.querySelectorAll('.project-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ==========================================================================
   UI COMPONENT PLAYGROUND WIDGETS
   ========================================================================== */
function initPlaygroundWidgets() {
  // Playground widgets removed to align with clean aesthetic
}

/* ==========================================================================
   CONTACT FORM HANDLER
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const responseMsg = document.getElementById('form-response');
  const submitBtn = document.getElementById('form-submit-btn');
  
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Disable Submit Button and show loading spinner
    submitBtn.disabled = true;
    const origContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fa-solid fa-spinner fa-spin"></i>';
    
    // Simulate API delay
    setTimeout(() => {
      responseMsg.className = 'form-response-msg success';
      responseMsg.textContent = 'Thank you! Your message was sent successfully.';
      
      // Reset Form fields
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = origContent;
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        responseMsg.textContent = '';
        responseMsg.className = 'form-response-msg';
      }, 5000);
      
    }, 1500);
  });
}
