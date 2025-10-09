// ===========================
// tartbytati - Main JavaScript
// ===========================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  
  // Smooth scrolling for anchor links
  initSmoothScroll();
  
  // Add active state to navigation
  highlightActiveNav();
  
  // Add animation on scroll
  initScrollAnimations();
  
  console.log('tartbytati website loaded successfully! 🍰');
});

// ===========================
// Smooth Scroll Function
// ===========================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just '#'
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        // Smooth scroll to target
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Update URL without jumping
        history.pushState(null, null, href);
        
        // Focus target for accessibility
        target.focus();
      }
    });
  });
}

// ===========================
// Highlight Active Navigation
// ===========================
function highlightActiveNav() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

// ===========================
// Scroll Animations
// ===========================
function initScrollAnimations() {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    return; // Skip animations for older browsers
  }
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe feature cards and other elements
  const animatedElements = document.querySelectorAll('.feature, .contact-method, .about-text');
  
  animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });
}

// ===========================
// Handle External Links
// ===========================
// Add visual indicator for external links
const externalLinks = document.querySelectorAll('a[target="_blank"]');
externalLinks.forEach(link => {
  link.setAttribute('rel', 'noopener noreferrer');
});

// ===========================
// Keyboard Navigation Enhancement
// ===========================
document.addEventListener('keydown', function(e) {
  // Skip to main content with 'S' key
  if (e.key === 's' || e.key === 'S') {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink && document.activeElement !== skipLink) {
      e.preventDefault();
      const mainContent = document.querySelector('#main-content');
      if (mainContent) {
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
});