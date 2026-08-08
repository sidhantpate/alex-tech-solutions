// Mobile menu toggle (unchanged)
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    menuToggle.classList.toggle('active');
  });

  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('active');
    });
  });
}

// Contact form handling (submits to Formspree)
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const service = document.getElementById('service').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      alert('Please fill in all required fields.');
      return;
    }

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
        // Show confirmation (you can replace with a custom modal)
        alert(`Thank you, ${name}! Your message has been received.\n\nWe'll contact you at ${email} within 1 business day regarding your ${service || 'inquiry'}.`);

        // Ask whether to open mail client to reply to the visitor
        const openMail = confirm('Would you like to open your mail client to reply to this visitor now?');
        if (openMail) {
          // Opens default mail client with visitor's email in To:
          const subject = encodeURIComponent('Re: your message to Alex Tech Solutions');
          const body = encodeURIComponent(`Hi ${name},%0D%0A%0D%0A`); // prefill optional
          window.location.href = `mailto:${encodeURIComponent(email)}?subject=${subject}&body=${body}`;
        }

        contactForm.reset();
      } else {
        const data = await res.json().catch(() => null);
        const errorMsg = data && data.error ? data.error : 'Submission failed. Please try again later.';
        alert(errorMsg);
      }
    } catch (err) {
      console.error(err);
      alert('Network error: please try again later.');
    }
  });
}

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
