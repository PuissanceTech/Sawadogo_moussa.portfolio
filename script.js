(() => {
  'use strict';

  const CONFIG = {
    email: 'Puissancetechsm@gmail.com',
  };

  /* Année footer */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* Navigation : effet scroll */
  const nav = document.querySelector('.nav');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile */
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('active');
    mobileMenu.classList.toggle('open', isOpen);
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      mobileMenu.classList.remove('open');
    });
  });

  /* Toast */
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg, type = '', duration = 3500) {
    toast.textContent = msg;
    toast.className = 'toast show';
    if (type) toast.classList.add(`toast--${type}`);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  const filters = document.querySelectorAll('.filter');
  const projects = document.querySelectorAll('.project');
  const emptyState = document.getElementById('projectsEmpty');

  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const category = filter.dataset.filter;

      // Mise à jour des filtres
      filters.forEach(f => f.classList.remove('filter--active'));
      filter.classList.add('filter--active');

      // Filtrage
      let visibleCount = 0;
      projects.forEach(project => {
        const projectCat = project.dataset.category;
        const shouldShow = category === 'all' || projectCat === category;

        if (shouldShow) {
          project.style.display = '';
          // Petit fade-in
          project.style.animation = 'none';
          requestAnimationFrame(() => {
            project.style.animation = 'fade-up 0.5s var(--ease) both';
          });
          visibleCount++;
        } else {
          project.style.display = 'none';
        }
      });

      // Affiche l'empty state si rien
      emptyState.classList.toggle('hidden', visibleCount > 0);
    });
  });

  const form = document.getElementById('contactForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Validation
    if (!name || !email || !message) {
      showToast('⚠️ Merci de remplir les champs obligatoires', 'error');
      if (!name) form.name.focus();
      else if (!email) form.email.focus();
      else form.message.focus();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('⚠️ Veuillez saisir un email valide', 'error');
      form.email.focus();
      return;
    }

    // Construction du mailto
    const subjectFinal = subject || `Contact portfolio — ${name}`;
    const body = [
      `Bonjour Moussa,`,
      ``,
      message,
      ``,
      `---`,
      `Envoyé via votre portfolio`,
      `De : ${name}`,
      `Email : ${email}`,
    ].join('\n');

    const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subjectFinal)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    showToast('📧 Ouverture de votre application email…', 'success');
  });

  const revealTargets = document.querySelectorAll(
    '.section-head, .about__text, .about__values, .exp, .project, .timeline__item, .contact__intro, .contact__form'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach(el => observer.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
})();
