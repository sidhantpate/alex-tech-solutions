// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
const header = document.querySelector('.header');

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.appendChild(progressBar);

const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = `${Math.min(progress, 100)}%`;
};

window.addEventListener('scroll', updateScrollProgress, { passive: true });
window.addEventListener('resize', updateScrollProgress);
window.addEventListener('load', updateScrollProgress);

let pointerX = 0;
let pointerY = 0;
let pointerVisible = false;
let rafScheduled = false;

window.addEventListener('pointermove', (event) => {
  pointerX = event.clientX;
  pointerY = event.clientY;
  pointerVisible = true;
  if (!rafScheduled) {
    rafScheduled = true;
    requestAnimationFrame(() => {
      cursorGlow.style.opacity = '1';
      cursorGlow.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      rafScheduled = false;
    });
  }
});

window.addEventListener('pointerleave', () => {
  pointerVisible = false;
  cursorGlow.style.opacity = '0';
});

document.addEventListener('mouseleave', () => {
  pointerVisible = false;
  cursorGlow.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  if (pointerVisible) {
    cursorGlow.style.opacity = '1';
  }
});

document.querySelectorAll('.service-card, .feature, .about-card, .contact-form, .hero-visual').forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const maxTilt = card.classList.contains('hero-visual') ? 12 : 8;
    const hoverTranslate = card.classList.contains('hero-visual') ? -10 : -8;
    const rotateY = ((x / rect.width) - 0.5) * maxTilt;
    const rotateX = ((0.5 - (y / rect.height))) * maxTilt;

    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${hoverTranslate}px) translateZ(10px)`;
    card.style.boxShadow = '0 26px 60px rgba(0, 0, 0, 0.18)';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('active');
    const isExpanded = nav.classList.contains('active');
    menuToggle.setAttribute('aria-expanded', String(isExpanded));
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      link.classList.add('clicked');
      window.setTimeout(() => link.classList.remove('clicked'), 300);

      if (window.innerWidth <= 640) {
        nav.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 640) {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Header scroll state and active nav section
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const updateActiveSection = () => {
  const scrollY = window.scrollY + 120;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute('id');

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });
    }
  });
};

window.addEventListener('scroll', () => {
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  updateActiveSection();
});

updateActiveSection();

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(element => revealObserver.observe(element));

// Contact form handling element reference
const contactForm = document.getElementById('contactForm');

// Smooth scroll offset for fixed header (unchanged)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerHeight = document.querySelector('.header')?.offsetHeight || 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    }
  });
});

const messageToast = document.getElementById('messageToast');
let toastTimer = null;
let toastInterval = null;

const showToast = (text, duration = 2800) => {
  if (!messageToast) return;
  clearTimeout(toastTimer);
  clearInterval(toastInterval);

  messageToast.textContent = '';
  messageToast.classList.remove('toast-hidden');
  messageToast.classList.add('toast-visible');

  const typeSpan = document.createElement('span');
  typeSpan.className = 'typewriter';
  messageToast.appendChild(typeSpan);

  let i = 0;
  const letters = text.split('');
  toastInterval = setInterval(() => {
    if (i >= letters.length) {
      clearInterval(toastInterval);
      return;
    }
    typeSpan.textContent += letters[i];
    i += 1;
  }, 30);

  toastTimer = window.setTimeout(() => {
    messageToast.classList.remove('toast-visible');
    messageToast.classList.add('toast-hidden');
  }, duration);
};

const onBookingClick = (event) => {
  if (event.currentTarget.getAttribute('href') === '#contact') {
    showToast('Book repair selected. Fill the form and send your message.');
  }
};

document.querySelectorAll('a[href="#contact"]').forEach(link => {
  link.addEventListener('click', onBookingClick);
});

if (contactForm) {
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : 'Send Message';

  const setSubmitState = (isSending) => {
    if (!submitButton) return;
    submitButton.disabled = isSending;
    submitButton.textContent = isSending ? 'Sending...' : originalButtonText;
    submitButton.setAttribute('aria-busy', String(isSending));
  };

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    setSubmitState(true);
    showToast('Sending your message...', 1800);

    // Send to Formspree
    const formData = new FormData(contactForm);

    try {
      const res = await fetch('https://formspree.io/f/mbgrdyjl', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      if (res.ok) {
        showToast(`Thank you, ${name}! Your message has been received.`);
        showOrderConfirm();

        const openMail = confirm('Would you like to open your mail client to reply to this visitor now?');
        if (openMail) {
          const subject = encodeURIComponent('Re: your message to Alex Tech Solutions');
          const body = encodeURIComponent(`Hi ${name},%0D%0A%0D%0A`);
          window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
        }

        contactForm.reset();
      } else {
        const data = await res.json().catch(() => null);
        const errorMsg = data && data.error ? data.error : 'Submission failed. Please try again later.';
        showToast(errorMsg);
      }
    } catch (err) {
      console.error(err);
      showToast('Network error: please try again later.');
    } finally {
      setSubmitState(false);
    }
  });
}

const orderConfirmOverlay = document.getElementById('orderConfirmOverlay');
const orderConfirmClose = document.getElementById('orderConfirmClose');

const hideOrderConfirm = () => {
  if (!orderConfirmOverlay) return;
  orderConfirmOverlay.classList.remove('order-visible');
  orderConfirmOverlay.classList.add('order-hidden');
  const card = orderConfirmOverlay.querySelector('.order-card');
  if (card) {
    card.classList.remove('order-active');
  }
};

const showOrderConfirm = () => {
  if (!orderConfirmOverlay) return;
  orderConfirmOverlay.classList.remove('order-hidden');
  orderConfirmOverlay.classList.add('order-visible');

  const card = orderConfirmOverlay.querySelector('.order-card');
  if (card) {
    card.classList.remove('order-active');
    void card.offsetWidth;
    setTimeout(() => card.classList.add('order-active'), 100);
  }

  window.setTimeout(hideOrderConfirm, 3800);
};

if (orderConfirmClose) {
  orderConfirmClose.addEventListener('click', hideOrderConfirm);
}

if (orderConfirmOverlay) {
  orderConfirmOverlay.addEventListener('click', (event) => {
    if (event.target === orderConfirmOverlay) {
      hideOrderConfirm();
    }
  });
}

