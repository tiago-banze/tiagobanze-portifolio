// Navbar, rodapé e botão flutuante do WhatsApp — construídos uma vez aqui
// e injetados em todas as páginas, para não repetir o HTML à mão em cada ficheiro.

const WHATSAPP_NUMBER = '258847388489';
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=Ol%C3%A1%20Tiago%2C%20vi%20o%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20falar%20consigo.`;

const NAV_LINKS = [
  { href: 'index.html#sobre', label: 'Sobre' },
  { href: 'index.html#servicos', label: 'Serviços' },
  { href: 'projetos.html', label: 'Projetos' },
  { href: 'blog.html', label: 'Blog' },
  { href: 'cv.html', label: 'CV' },
  { href: 'index.html#contacto', label: 'Contacto' },
];

function renderNavbar() {
  const mount = document.getElementById('navbar-mount');
  if (!mount) return;

  const links = NAV_LINKS.map(
    (l) => `<li><a href="${l.href}" class="link-underline pb-1 font-body text-sm text-ink-dynamic/90 hover:text-ink-dynamic">${l.label}</a></li>`
  ).join('');

  const mobileLinks = NAV_LINKS.map(
    (l) => `<li><a href="${l.href}" class="block rounded-lg px-3 py-2.5 font-body text-sm text-ink-dynamic hover:bg-copper/10">${l.label}</a></li>`
  ).join('');

  mount.innerHTML = `
    <header class="sticky top-0 z-50 border-b border-dynamic bg-surface/85 backdrop-blur-md">
      <nav class="container-shell flex h-16 items-center justify-between" aria-label="Navegação principal">
        <a href="index.html" class="font-display text-lg font-semibold tracking-tight text-ink-dynamic">
          Tiago<span class="text-accent-dynamic">.</span>Banze
        </a>
        <ul class="hidden items-center gap-8 md:flex">${links}</ul>
        <div class="hidden items-center gap-3 md:flex">
          <button type="button" data-theme-toggle aria-label="Alternar tema" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-dynamic text-ink-dynamic"></button>
          <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener noreferrer"
             class="rounded-full bg-accent-dynamic px-4 py-2 font-body text-sm font-medium text-[rgb(251_249_243)] transition-transform hover:scale-[1.03] active:scale-[0.98]">
            Falar no WhatsApp
          </a>
        </div>
        <div class="flex items-center gap-2 md:hidden">
          <button type="button" data-theme-toggle aria-label="Alternar tema" class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-dynamic text-ink-dynamic"></button>
          <button type="button" id="mobile-menu-btn" aria-label="Abrir menu" aria-expanded="false"
                  class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-dynamic text-ink-dynamic">${icon('menu', 'h-4 w-4')}</button>
        </div>
      </nav>
      <div id="mobile-menu" class="hidden border-t border-dynamic bg-surface md:hidden">
        <ul class="container-shell flex flex-col gap-1 py-4">
          ${mobileLinks}
          <li class="pt-2">
            <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener noreferrer"
               class="block rounded-full bg-accent-dynamic px-4 py-2.5 text-center font-body text-sm font-medium text-[rgb(251_249_243)]">
              Falar no WhatsApp
            </a>
          </li>
        </ul>
      </div>
    </header>`;

  const menuBtn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  menuBtn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    menuBtn.setAttribute('aria-expanded', String(!isOpen));
    menuBtn.innerHTML = isOpen ? icon('menu', 'h-4 w-4') : icon('x', 'h-4 w-4');
  });

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    const isDark = document.documentElement.classList.contains('dark');
    btn.innerHTML = isDark ? icon('sun', 'h-4 w-4') : icon('moon', 'h-4 w-4');
  });
}

function renderFooter() {
  const mount = document.getElementById('footer-mount');
  if (!mount) return;
  const year = new Date().getFullYear();
  mount.innerHTML = `
    <footer class="border-t border-dynamic bg-surface-soft">
      <div class="container-shell grid gap-10 py-16 sm:grid-cols-3">
        <div>
          <p class="font-display text-lg font-semibold text-ink-dynamic">Tiago<span class="text-accent-dynamic">.</span>Banze</p>
          <p class="mt-3 max-w-xs font-body text-sm leading-relaxed text-muted-dynamic">
            Engenheiro Informático &amp; Desenvolvedor Full-Stack, a construir sistemas funcionais a partir da Maxixe, Inhambane.
          </p>
          <p class="mt-4 flex items-center gap-1.5 font-body text-sm text-muted-dynamic">
            ${icon('map-pin', 'h-3.5 w-3.5')} Maxixe, Inhambane, Moçambique
          </p>
        </div>
        <div>
          <p class="font-body text-sm font-medium text-ink-dynamic">Navegação</p>
          <ul class="mt-3 space-y-2 font-body text-sm text-muted-dynamic">
            <li><a href="index.html#sobre" class="link-underline hover:text-ink-dynamic">Sobre</a></li>
            <li><a href="projetos.html" class="link-underline hover:text-ink-dynamic">Projetos</a></li>
            <li><a href="blog.html" class="link-underline hover:text-ink-dynamic">Blog</a></li>
            <li><a href="cv.html" class="link-underline hover:text-ink-dynamic">Curriculum Vitae</a></li>
          </ul>
        </div>
        <div>
          <p class="font-body text-sm font-medium text-ink-dynamic">Contacto</p>
          <div class="mt-3 flex items-center gap-3">
            <a href="https://github.com/tiago-banze" target="_blank" rel="noopener noreferrer" aria-label="Perfil no GitHub"
               class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-dynamic text-ink-dynamic hover:bg-copper/10">${icon('github', 'h-4 w-4')}</a>
            <a href="https://www.facebook.com/tiago.banze.1" target="_blank" rel="noopener noreferrer" aria-label="Perfil no Facebook"
               class="inline-flex h-9 w-9 items-center justify-center rounded-full border border-dynamic text-ink-dynamic hover:bg-copper/10">${icon('facebook', 'h-4 w-4')}</a>
          </div>
          <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener noreferrer" class="mt-4 inline-block font-body text-sm text-accent-dynamic link-underline">
            +258 84 738 8489 (WhatsApp)
          </a>
        </div>
      </div>
      <div class="border-t border-dynamic py-6">
        <p class="container-shell font-body text-xs text-muted-dynamic">© ${year} Tiago Victor Banze. Todos os direitos reservados.</p>
      </div>
    </footer>`;
}

function renderWhatsAppFloat() {
  const mount = document.getElementById('whatsapp-float-mount');
  if (!mount) return;
  mount.innerHTML = `
    <a href="${WHATSAPP_HREF}" target="_blank" rel="noopener noreferrer" aria-label="Contactar Tiago Victor Banze via WhatsApp"
       class="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 active:scale-95 sm:bottom-8 sm:right-8">
      ${icon('message', 'h-7 w-7')}
      <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-20"></span>
    </a>`;
}

document.addEventListener('DOMContentLoaded', () => {
  renderNavbar();
  renderFooter();
  renderWhatsAppFloat();
});
