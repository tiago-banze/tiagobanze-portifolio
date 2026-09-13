// Preenche a página inicial com dados reais vindos da API do Django.
// Sem dados de exemplo: se algo falhar, mostra um aviso visível.

const STATUS_LABEL = {
  production: 'Em produção',
  completed: 'Concluído',
  in_progress: 'Em desenvolvimento',
  archived: 'Arquivado',
};

const SERVICE_ICON_MAP = {
  code: 'code2', 'graduation-cap': 'graduation-cap', monitor: 'monitor',
  cpu: 'cpu', zap: 'zap', smartphone: 'smartphone',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' });
}

function renderHero(profile) {
  document.getElementById('hero-name').textContent = profile.full_name;
  document.getElementById('hero-name').classList.remove('skeleton', 'h-14', 'w-3/4');

  const titlesEl = document.getElementById('hero-titles');
  titlesEl.innerHTML = profile.headline.split('|').map(
    (t) => `<span class="rounded-full border border-dynamic px-3 py-1 font-body text-xs font-medium text-muted-dynamic sm:text-sm">${t.trim()}</span>`
  ).join('');

  const bioEl = document.getElementById('hero-bio');
  bioEl.textContent = profile.bio_short;
  bioEl.classList.remove('skeleton', 'h-16', 'w-full');

  const wa = document.getElementById('hero-whatsapp');
  wa.href = `https://wa.me/${profile.whatsapp_number.replace(/\D/g, '')}`;
  wa.innerHTML = `Falar no WhatsApp ${icon('arrow-right', 'h-4 w-4')}`;

  const cvBtn = document.getElementById('hero-cv');
  if (profile.cv_file) {
    cvBtn.href = profile.cv_file;
    cvBtn.setAttribute('download', '');
  }
  cvBtn.innerHTML = `${icon('download', 'h-4 w-4')} ${profile.cv_file ? 'Baixar CV' : 'Ver Curriculum Vitae'}`;

  document.getElementById('hero-github').href = profile.github_url;
  document.getElementById('hero-github').innerHTML = icon('github', 'h-4 w-4');
  document.getElementById('hero-facebook').href = profile.facebook_url;
  document.getElementById('hero-facebook').innerHTML = icon('facebook', 'h-4 w-4');

  const portrait = document.getElementById('hero-portrait');
  if (profile.avatar) {
    portrait.innerHTML = `
      <span aria-hidden class="absolute h-[85%] w-[85%] rounded-full opacity-40 blur-3xl"
            style="background: radial-gradient(circle at 35% 30%, rgb(var(--accent)/0.55), rgb(var(--accent-2)/0.4) 60%, transparent 80%);"></span>
      <div class="relative flex h-full w-full flex-col items-center justify-center gap-4 rounded-[2.5rem] border p-6 backdrop-blur-xl sm:p-8"
           style="border-color: rgb(var(--fg)/0.12); background-color: rgb(var(--bg-card)/0.35); box-shadow: 0 8px 40px -12px rgb(var(--fg)/0.25);">
        <div class="relative aspect-square w-full max-w-[280px] overflow-hidden rounded-[2rem] border-2 shadow-lg" style="border-color: rgb(var(--accent)/0.6);">
          <img src="${profile.avatar}" alt="Fotografia de ${profile.full_name}" class="h-full w-full object-cover" loading="eager">
        </div>
        <div class="flex items-center gap-2 rounded-full border px-4 py-1.5 backdrop-blur-md" style="border-color: rgb(var(--fg)/0.12); background-color: rgb(var(--bg)/0.4);">
          <span class="h-1.5 w-1.5 rounded-full bg-teal"></span>
          <span class="font-mono text-[11px] uppercase tracking-wide text-muted-dynamic">${profile.full_name}</span>
        </div>
      </div>
      <span aria-hidden class="absolute -left-2 top-8 h-2.5 w-2.5 rounded-full bg-accent-dynamic"></span>
      <span aria-hidden class="absolute -right-1 bottom-10 h-2.5 w-2.5 rounded-full bg-teal"></span>`;
  } else {
    portrait.innerHTML = `
      <svg viewBox="0 0 400 400" class="h-full w-full" role="img" aria-label="Ilustração de circuito eletrónico estilizado">
        <circle cx="200" cy="200" r="170" fill="none" stroke="rgb(var(--border))" stroke-width="1"/>
        <g stroke="rgb(var(--accent))" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="1000" class="animate-trace-in">
          <path d="M60 120 H150 V80 H260 V140 H340"/>
          <path d="M60 220 H120 V260 H200 V320 H300 V260 H340"/>
          <path d="M100 200 V140 H180 V200"/>
          <path d="M240 200 H300 V160"/>
        </g>
        <g fill="rgb(var(--accent))">
          <circle cx="60" cy="120" r="5"/><circle cx="340" cy="140" r="5"/><circle cx="60" cy="220" r="5"/>
          <circle cx="340" cy="260" r="5"/><circle cx="200" cy="320" r="5"/>
        </g>
        <g fill="rgb(var(--accent-2))" opacity="0.9">
          <circle cx="150" cy="80" r="3.5"/><circle cx="180" cy="200" r="3.5"/><circle cx="300" cy="160" r="3.5"/>
        </g>
        <text x="200" y="215" text-anchor="middle" class="font-display" style="font-size:64px;font-weight:600;fill:rgb(var(--fg));">TB</text>
      </svg>`;
  }
}

function renderAbout(profile) {
  const el = document.getElementById('about-bio');
  el.textContent = profile.bio_long;
  el.classList.remove('skeleton', 'h-24', 'w-full');

  const imgWrap = document.getElementById('about-image-wrap');
  if (profile.about_image) {
    imgWrap.innerHTML = `
      <img src="${profile.about_image}" alt="Imagem de ${profile.full_name}"
           class="mt-2 aspect-video w-full max-w-2xl rounded-2xl border border-dynamic object-cover">`;
  }
}

function renderCertifications(certs) {
  const emptyMsg = document.getElementById('certifications-empty');
  const sliderWrap = document.getElementById('certifications-slider-wrap');
  if (!certs.length) {
    emptyMsg.textContent = 'Nenhuma certificação publicada ainda.';
    return;
  }
  emptyMsg.classList.add('hidden');
  sliderWrap.classList.remove('hidden');

  const track = document.getElementById('certifications-track');
  const dots = document.getElementById('cert-dots');

  track.innerHTML = certs.map((c) => `
    <div class="flex w-full shrink-0 flex-col gap-5 p-6 sm:flex-row sm:items-center sm:p-8">
      <div class="mx-auto w-full max-w-xs shrink-0 sm:mx-0">
        ${c.file
          ? (c.is_pdf
              ? `<a href="${c.file}" target="_blank" rel="noopener noreferrer"
                    class="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dynamic bg-surface text-muted-dynamic hover:text-accent-dynamic">
                   ${icon('external-link', 'h-8 w-8')}
                   <span class="font-body text-xs">Abrir PDF do certificado</span>
                 </a>`
              : `<img src="${c.file}" alt="Certificado: ${c.title}" class="aspect-[4/3] w-full rounded-xl border border-dynamic object-cover">`)
          : `<div class="flex aspect-[4/3] w-full items-center justify-center rounded-xl border border-dynamic bg-surface text-muted-dynamic">${icon('graduation-cap', 'h-8 w-8')}</div>`}
      </div>
      <div>
        <p class="font-mono text-xs uppercase tracking-wide text-teal-dark">${new Date(c.issue_date).toLocaleDateString('pt-MZ', { month: 'long', year: 'numeric' })}</p>
        <h3 class="mt-1.5 font-display text-lg font-semibold text-ink-dynamic">${c.title}</h3>
        <p class="mt-1 font-body text-sm text-muted-dynamic">
          ${c.issuer_url ? `<a href="${c.issuer_url}" target="_blank" rel="noopener noreferrer" class="link-underline">${c.issuer}</a>` : c.issuer}
        </p>
        ${c.credential_url ? `<a href="${c.credential_url}" target="_blank" rel="noopener noreferrer" class="mt-3 inline-flex items-center gap-1.5 font-body text-sm text-accent-dynamic link-underline">Ver credencial ${icon('external-link', 'h-3.5 w-3.5')}</a>` : ''}
      </div>
    </div>`).join('');

  dots.innerHTML = certs.map((_, i) =>
    `<button type="button" data-dot="${i}" aria-label="Ir para certificado ${i + 1}" class="h-2 w-2 rounded-full bg-dynamic"></button>`
  ).join('');

  let current = 0;
  function goTo(i) {
    current = (i + certs.length) % certs.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.querySelectorAll('button').forEach((d, idx) => {
      d.style.backgroundColor = idx === current ? 'rgb(var(--accent))' : 'rgb(var(--border))';
    });
  }
  dots.querySelectorAll('button').forEach((d) => d.addEventListener('click', () => goTo(Number(d.dataset.dot))));
  document.getElementById('cert-prev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('cert-next').addEventListener('click', () => goTo(current + 1));
  goTo(0);
}

function renderServices(services) {
  const grid = document.getElementById('services-grid');
  if (!services.length) { grid.innerHTML = '<p class="text-muted-dynamic">Nenhum serviço publicado ainda.</p>'; return; }
  grid.innerHTML = services.map((s) => `
    <article class="group relative overflow-hidden rounded-2xl border border-dynamic bg-surface-card p-6 transition-colors hover:border-copper">
      <span aria-hidden class="absolute left-0 top-0 h-full w-1 bg-teal transition-all group-hover:w-1.5"></span>
      ${icon(SERVICE_ICON_MAP[s.icon] || 'code2', 'h-6 w-6 text-accent-dynamic')}
      <h3 class="mt-4 font-display text-lg font-semibold text-ink-dynamic">${s.title}</h3>
      <p class="mt-2 font-body text-sm leading-relaxed text-muted-dynamic">${s.short_description}</p>
      <p class="mt-3 font-body text-sm leading-relaxed text-ink-dynamic/80">${s.description}</p>
    </article>`).join('');
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  const featured = projects.slice(0, 4);
  if (!featured.length) { grid.innerHTML = '<p class="text-muted-dynamic">Nenhum projeto publicado ainda.</p>'; return; }
  grid.innerHTML = featured.map((p) => `
    <article class="flex flex-col justify-between overflow-hidden rounded-2xl border border-dynamic bg-surface-card">
      ${p.cover_image ? `<img src="${p.cover_image}" alt="${p.title}" class="h-44 w-full object-cover">` : ''}
      <div class="p-7">
        <div class="flex items-center justify-between gap-3">
          <span class="rounded-full border border-dynamic px-3 py-1 font-mono text-[11px] text-muted-dynamic">${STATUS_LABEL[p.status] || p.status}</span>
          <div class="flex items-center gap-2">
            ${p.repo_url ? `<a href="${p.repo_url}" target="_blank" rel="noopener noreferrer" aria-label="Repositório" class="text-muted-dynamic hover:text-accent-dynamic">${icon('github', 'h-4 w-4')}</a>` : ''}
            ${p.live_url ? `<a href="${p.live_url}" target="_blank" rel="noopener noreferrer" aria-label="Demo" class="text-muted-dynamic hover:text-accent-dynamic">${icon('external-link', 'h-4 w-4')}</a>` : ''}
          </div>
        </div>
        <h3 class="mt-5 font-display text-xl font-semibold text-ink-dynamic">${p.title}</h3>
        <p class="mt-2 font-body text-sm leading-relaxed text-muted-dynamic">${p.summary}</p>
        ${p.solution ? `<p class="mt-3 font-body text-sm leading-relaxed text-ink-dynamic/85"><span class="font-medium text-ink-dynamic">Solução: </span>${p.solution}</p>` : ''}
      </div>
      <div class="flex flex-wrap gap-2 px-7 pb-7">
        ${(p.tech_tags || []).map((t) => `<span class="rounded-full bg-teal/10 px-3 py-1 font-mono text-[11px] text-teal-dark">${t}</span>`).join('')}
      </div>
    </article>`).join('');
}

function renderBlog(posts) {
  const grid = document.getElementById('blog-grid');
  const latest = posts.slice(0, 3);
  if (!latest.length) { grid.innerHTML = '<p class="text-muted-dynamic">Nenhum artigo publicado ainda.</p>'; return; }
  grid.innerHTML = latest.map((post) => `
    <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="group flex flex-col rounded-2xl border border-dynamic bg-surface-card p-6 transition-colors hover:border-copper">
      ${post.category ? `<span class="font-mono text-[11px] uppercase tracking-wide text-teal-dark">${post.category.name}</span>` : ''}
      <h3 class="mt-3 font-display text-lg font-semibold text-ink-dynamic group-hover:text-accent-dynamic">${post.title}</h3>
      <p class="mt-2 flex-1 font-body text-sm leading-relaxed text-muted-dynamic">${post.excerpt}</p>
      <div class="mt-5 flex items-center justify-between font-mono text-[11px] text-muted-dynamic">
        <span>${formatDate(post.published_at)}</span>
        <span class="flex items-center gap-1">${icon('clock', 'h-3 w-3')} ${post.reading_time_minutes} min</span>
      </div>
    </a>`).join('');
}

function renderContactInfo(profile) {
  document.getElementById('contact-info').innerHTML = `
    <li class="flex items-center gap-3">${icon('phone', 'h-4 w-4 text-accent-dynamic')}
      <a href="https://wa.me/${profile.whatsapp_number.replace(/\D/g, '')}" class="link-underline">${profile.whatsapp_number}</a></li>
    <li class="flex items-center gap-3">${icon('mail', 'h-4 w-4 text-accent-dynamic')}
      <a href="mailto:${profile.email}" class="link-underline">${profile.email}</a></li>
    <li class="flex items-center gap-3">${icon('map-pin', 'h-4 w-4 text-accent-dynamic')} <span>${profile.location}</span></li>`;
}

function setupContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('contact-submit');
  const feedback = document.getElementById('contact-feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = `${icon('loader', 'h-4 w-4 animate-spin')} A enviar...`;
    feedback.className = 'font-body text-sm';
    feedback.textContent = '';

    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      subject: String(data.get('subject') || ''),
      message: String(data.get('message') || ''),
    };

    try {
      const result = await api.sendContactMessage(payload);
      feedback.textContent = result.detail;
      feedback.className = `font-body text-sm flex items-center gap-2 ${result.ok ? 'text-teal-dark' : 'text-red-600'}`;
      feedback.innerHTML = `${icon(result.ok ? 'check-circle' : 'alert-circle', 'h-4 w-4')} ${result.detail}`;
      if (result.ok) form.reset();
    } catch (err) {
      feedback.className = 'font-body text-sm flex items-center gap-2 text-red-600';
      feedback.innerHTML = `${icon('alert-circle', 'h-4 w-4')} Erro de rede. Tente novamente ou contacte via WhatsApp.`;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mensagem';
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('[data-icon]').forEach((el) => {
    el.innerHTML = icon(el.dataset.icon, 'h-5 w-5');
  });

  setupContactForm();

  try {
    const profile = await api.getProfile();
    renderHero(profile);
    renderAbout(profile);
    renderContactInfo(profile);
  } catch (err) {
    showConnError(document.getElementById('hero-bio'), 'perfil');
    console.error(err);
  }

  try {
    renderCertifications(await api.getCertifications());
  } catch (err) {
    document.getElementById('certifications-empty').textContent = 'Não foi possível carregar as certificações.';
    console.error(err);
  }

  try {
    renderServices(await api.getServices());
  } catch (err) {
    showConnError(document.getElementById('services-grid'), 'serviços');
    console.error(err);
  }

  try {
    renderProjects(await api.getProjects());
  } catch (err) {
    showConnError(document.getElementById('projects-grid'), 'projetos');
    console.error(err);
  }

  try {
    renderBlog(await api.getPosts());
  } catch (err) {
    showConnError(document.getElementById('blog-grid'), 'artigos do blog');
    console.error(err);
  }
});
