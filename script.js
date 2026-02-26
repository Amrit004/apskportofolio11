// ===== EMAIL INJECTION (defeats Cloudflare obfuscation) =====
// Email is assembled from char codes so scrapers can't mangle it
(function() {
  var e = [115,104,97,114,121,115,105,110,103,104,49,49,52,52,64,103,109,97,105,108,46,99,111,109];
  var email = e.map(function(c){ return String.fromCharCode(c); }).join('');
  var href = 'mailto:' + email;

  var contactLink = document.getElementById('contact-email');
  if (contactLink) {
    contactLink.href = href;
    contactLink.textContent = email;
  }

  var emailBtn = document.getElementById('email-btn');
  if (emailBtn) {
    emailBtn.href = href;
  }

  var footerEmail = document.getElementById('footer-email');
  if (footerEmail) {
    var a = document.createElement('a');
    a.href = href;
    a.textContent = email;
    a.style.color = 'inherit';
    a.style.textDecoration = 'none';
    footerEmail.appendChild(a);
  }
})();

// ===== THEME TOGGLE =====
(function() {
  var saved = localStorage.getItem('apsk-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.addEventListener('DOMContentLoaded', function() {

  var btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', function() {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('apsk-theme', next);
    });
  }

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      var id = link.getAttribute('href');
      if (id === '#') return;
      var target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ===== NAV active highlight on scroll =====
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function(link) {
            link.style.color = '';
            if (link.getAttribute('href') === '#' + entry.target.id) {
              link.style.color = 'var(--accent)';
            }
          });
        }
      });
    }, { threshold: 0.3 });
    sections.forEach(function(s) { observer.observe(s); });
  }

});
