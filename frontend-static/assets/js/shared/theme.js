// Tema claro/escuro. A escolha fica guardada no navegador.
// O clique é escutado no document porque o botão só existe depois de o
// cabeçalho ser criado pelo partials.js.

function atualizarIconesDoTema() {
  const escuro = document.documentElement.classList.contains('dark');
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.innerHTML = icon(escuro ? 'sun' : 'moon');
    btn.setAttribute('aria-label', escuro ? 'Mudar para o tema claro' : 'Mudar para o tema escuro');
  });
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('[data-theme-toggle]')) return;
  const escuro = document.documentElement.classList.toggle('dark');
  try { localStorage.setItem('theme', escuro ? 'dark' : 'light'); } catch (_) { /* modo privado */ }
  atualizarIconesDoTema();
  e.target.closest('[data-theme-toggle]').classList.add('trocou');
});
