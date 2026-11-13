const search = document.querySelector('#project-search');
const company = document.querySelector('#company-filter');
const items = [...document.querySelectorAll('.archive-item')];
function filterProjects() {
  const query = search.value.trim().toLowerCase();
  let count = 0;
  items.forEach(item => {
    const visible = (company.value === 'all' || item.dataset.company === company.value) && item.dataset.search.includes(query);
    item.hidden = !visible;
    if (visible) count++;
  });
  document.querySelector('.results-count').textContent = `${count}개 프로젝트`;
  document.querySelector('.empty-state').hidden = count !== 0;
}
if (search && company) {
  search.addEventListener('input', filterProjects);
  company.addEventListener('change', filterProjects);
  document.querySelectorAll('[data-company-jump]').forEach(a => a.addEventListener('click', () => {
    company.value = a.dataset.companyJump;
    search.value = '';
    filterProjects();
  }));
  const revealHash = () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target?.classList.contains('archive-item')) {
      search.value = '';
      company.value = 'all';
      filterProjects();
      target.open = true;
      requestAnimationFrame(() => target.scrollIntoView({block:'start'}));
    }
  };
  window.addEventListener('hashchange', revealHash);
  revealHash();
}
if ('IntersectionObserver' in window && !location.pathname.includes('/projects/')) {
  const links = [...document.querySelectorAll('nav a')];
  const observer = new IntersectionObserver(entries => {
    const active = entries.filter(e => e.isIntersecting).sort((a,b) => a.boundingClientRect.top-b.boundingClientRect.top)[0];
    if (!active) return;
    links.forEach(link => {
      const current = link.hash === `#${active.target.id}`;
      link.classList.toggle('active',current);
      if (current) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }, {rootMargin:'-10% 0px -50% 0px'});
  document.querySelectorAll('main > section[id]').forEach(s => observer.observe(s));
}
