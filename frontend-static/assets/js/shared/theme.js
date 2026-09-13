// Alternância de tema claro/escuro — JavaScript puro, sem dependências.
// A escolha do utilizador fica guardada no localStorage do navegador.
//
// Usamos "delegação de evento" (o clique é escutado no document, não no
// botão em si) porque o botão só existe depois do navbar.js o injetar —
// isso evita o bug de o clique nunca ficar ligado a nada.

function isDarkMode() {
  return document.documentElement.classList.contains('dark');
}

function updateToggleIcon(btn) {
  btn.innerHTML = isDarkMode() ? icon('sun', 'h-4 w-4') : icon('moon', 'h-4 w-4');
}

function refreshThemeIcons() {
  document.querySelectorAll('[data-theme-toggle]').forEach(updateToggleIcon);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  refreshThemeIcons();
}

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-theme-toggle]');
  if (btn) toggleTheme();
});

document.addEventListener('DOMContentLoaded', refreshThemeIcons);
