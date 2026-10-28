// Animação de entrada: o conteúdo sobe e aparece quando entra no ecrã,
// com um pequeno atraso entre irmãos (cascata calculada, sem biblioteca).
// Se o navegador não suporta IntersectionObserver, ou a pessoa pediu menos
// movimento, não faz nada e o conteúdo fica logo visível.

(function () {
  const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (semMovimento || !('IntersectionObserver' in window)) return;

  const ALVOS = [
    '.hero-grid > div > *', '.portrait', '.sec-head', '.prose-text', '.facts > div', '.service',
    '.card', '.cert', '.post-row', '.contact-list li', '.contact-grid .form', '.cv-top', '.cv-sheet',
  ].join(',');

  const vistos = new WeakSet();
  const observador = new IntersectionObserver((entradas) => {
    const visiveis = entradas.filter((e) => e.isIntersecting)
      .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
    visiveis.forEach((e, i) => {
      const el = e.target;
      observador.unobserve(el);
      el.style.setProperty('--atraso', `${Math.min(i, 5) * 70}ms`);
      el.classList.add('in');
      // Depois de aparecer, devolve o elemento ao normal (para não atrapalhar o hover).
      setTimeout(() => { el.classList.remove('reveal', 'in'); el.style.removeProperty('--atraso'); }, 900 + Math.min(i, 5) * 70);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  function registar(el) {
    if (vistos.has(el)) return;
    vistos.add(el);
    el.classList.add('reveal');
    observador.observe(el);
  }
  function varrer(raiz) {
    if (raiz.nodeType !== 1) return;
    if (raiz.matches(ALVOS)) registar(raiz);
    raiz.querySelectorAll(ALVOS).forEach(registar);
  }

  varrer(document.body);
  // Conteúdo que chega depois (projetos, artigos, "Ver mais") também entra com animação.
  new MutationObserver((muts) => muts.forEach((m) => m.addedNodes.forEach(varrer)))
    .observe(document.body, { childList: true, subtree: true });
})();
