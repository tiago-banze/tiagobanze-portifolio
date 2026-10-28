// Cabeçalho, rodapé e botão do WhatsApp. São criados aqui uma vez
// e inseridos em todas as páginas.

const WA_TEXTO = 'Olá Tiago, vi o seu portefólio e gostava de falar consigo.';
const NAV_LINKS = [
  { href: 'index.html#sobre', label: 'Sobre' },
  { href: 'index.html#servicos', label: 'Serviços' },
  { href: 'index.html#projetos', label: 'Projetos' },
  { href: 'blog.html', label: 'Blog' },
  { href: 'cv.html', label: 'Currículo' },
  { href: 'index.html#contacto', label: 'Contacto' },
];

function paginaAtual() {
  const f = location.pathname.split('/').pop();
  return f || 'index.html';
}

function renderNavbar() {
  const mount = document.getElementById('navbar-mount');
  if (!mount) return;
  const wa = linkWhatsApp(null, WA_TEXTO);
  const atual = paginaAtual();
  const marca = (l) => (l.href === atual ? ' aria-current="page"' : '');
  const links = NAV_LINKS.map((l) => `<a href="${l.href}"${marca(l)}>${l.label}</a>`).join('');
  const movel = NAV_LINKS.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join('');

  mount.innerHTML = `
    <header class="site-header">
      <div class="wrap nav">
        <a class="brand" href="index.html">Tiago Banze</a>
        <nav class="nav-links" aria-label="Navegação principal">${links}</nav>
        <div class="nav-right">
          <button type="button" class="icon-btn" data-theme-toggle></button>
          <a class="btn btn-small nav-wa" href="${wa}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <button type="button" class="icon-btn menu-btn" id="menu-btn" aria-label="Abrir menu" aria-expanded="false">${icon('menu')}</button>
        </div>
      </div>
      <div class="mobile-menu" id="mobile-menu"><div class="wrap"><ul>${movel}</ul></div></div>
    </header>`;

  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn.addEventListener('click', () => {
    const aberto = menu.classList.toggle('aberto');
    btn.setAttribute('aria-expanded', String(aberto));
    btn.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    btn.innerHTML = icon(aberto ? 'x' : 'menu');
  });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) menu.classList.remove('aberto'); });
  atualizarIconesDoTema();
}

function renderFooter() {
  const mount = document.getElementById('footer-mount');
  if (!mount) return;
  const cfg = window.PORTFOLIO_CONFIG;
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div>
            <p><strong>${esc(cfg.nome)}</strong></p>
            <p class="muted">Engenheiro informático na Maxixe, Inhambane.</p>
          </div>
          <div>
            <h2>Páginas</h2>
            <ul>
              <li><a href="index.html#projetos">Projetos</a></li>
              <li><a href="blog.html">Blog</a></li>
              <li><a href="cv.html">Currículo</a></li>
            </ul>
          </div>
          <div>
            <h2>Contacto</h2>
            <ul>
              <li>${htmlTelefone(null, { semBotao: true })}</li>
              <li><a href="${linkWhatsApp(null, WA_TEXTO)}" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
              <li><a href="https://github.com/tiago-banze" target="_blank" rel="noopener noreferrer">GitHub</a></li>
            </ul>
          </div>
        </div>
        <p class="copy">© ${new Date().getFullYear()} ${esc(cfg.nome)}</p>
      </div>
    </footer>`;
}

function renderWhatsAppFloat() {
  const mount = document.getElementById('whatsapp-float-mount');
  if (!mount) return;
  mount.innerHTML = `<a class="wa-float" href="${linkWhatsApp(null, WA_TEXTO)}" target="_blank" rel="noopener noreferrer" aria-label="Falar no WhatsApp">${icon('message')}</a>`;
}

function renderBackToTop() {
  const mount = document.getElementById('back-to-top-mount');
  if (!mount) return;
  mount.innerHTML = `<button type="button" class="to-top" id="to-top-btn" aria-label="Voltar ao topo da página">${icon('chevron-up')}</button>`;
  const btn = document.getElementById('to-top-btn');
  const atualizar = () => btn.classList.toggle('visivel', window.scrollY > 400);
  window.addEventListener('scroll', atualizar, { passive: true });
  atualizar();
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

document.addEventListener('DOMContentLoaded', () => {
  renderBackToTop();
  renderNavbar();
  renderFooter();
  renderWhatsAppFloat();
});
