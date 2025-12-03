document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav');
  const drawerOverlay = document.getElementById('drawer-overlay');
  const closeDrawer = document.getElementById('close-drawer');

  const toggleDrawer = (open) => {
    if (!mobileDrawer || !drawerOverlay) return;
    const isOpen = open ?? !mobileDrawer.classList.contains('active');
    mobileDrawer.classList.toggle('active', isOpen);
    drawerOverlay.classList.toggle('active', isOpen);
    mobileDrawer.setAttribute('aria-hidden', (!isOpen).toString());
    drawerOverlay.setAttribute('aria-hidden', (!isOpen).toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => toggleDrawer(true));
  }

  if (closeDrawer) {
    closeDrawer.addEventListener('click', () => toggleDrawer(false));
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => toggleDrawer(false));
  }

  if (mobileDrawer) {
    mobileDrawer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => toggleDrawer(false));
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      toggleDrawer(false);
    }
  });

  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = `© ${new Date().getFullYear()} tartdesserts. Todos los derechos reservados.`;
  }
});