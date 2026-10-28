// Preenche a página inicial com os dados do site.

function paragrafos(texto) {
  return String(texto || '').split(/\n{2,}/).map((p) => `<p>${esc(p.trim())}</p>`).join('');
}

function renderHero(perfil) {
  const cargos = perfil.headline.split('|').map((t) => t.trim()).filter(Boolean);
  document.getElementById('hero-local').textContent = perfil.location;
  document.getElementById('hero-nome').textContent = perfil.full_name;
  document.getElementById('hero-cargos').textContent = cargos.join(', ');
  document.getElementById('hero-bio').textContent = perfil.bio_short;
  document.getElementById('hero-whatsapp').href = linkWhatsApp(perfil.whatsapp_number, WA_TEXTO);
  document.getElementById('hero-contacto').innerHTML = `
    <span class="tel-line">${icon('phone')} ${htmlTelefone(perfil.whatsapp_number)}</span>
    <a class="link" href="mailto:${esc(perfil.email)}">${esc(perfil.email)}</a>`;

  const retrato = document.getElementById('hero-retrato');
  if (perfil.avatar) {
    retrato.innerHTML = `<img src="${esc(perfil.avatar)}" alt="Fotografia de ${esc(perfil.full_name)}" width="640" height="800">`;
  } else {
    retrato.remove();
  }
}

function renderSobre(perfil, formacao) {
  document.getElementById('sobre-texto').innerHTML = paragrafos(perfil.bio_long);
  const f = formacao[0];
  document.getElementById('sobre-factos').innerHTML = `
    ${f ? `<div><dt>Formação</dt><dd>${esc(f.degree)}, ${esc(f.institution)}</dd></div>` : ''}
    <div><dt>Onde vivo</dt><dd>${esc(perfil.location)}</dd></div>`;
  if (perfil.about_image) {
    document.getElementById('sobre-imagem').innerHTML =
      `<img src="${esc(perfil.about_image)}" alt="" loading="lazy" style="margin-top:2rem;border-radius:var(--radius);max-width:40rem;width:100%">`;
  }
}

function renderServicos(servicos) {
  const el = document.getElementById('servicos-lista');
  el.innerHTML = servicos.length
    ? servicos.map((s) => `<li class="service"><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></li>`).join('')
    : '<li class="empty">Sem serviços publicados.</li>';
}

function renderCertificados(certs) {
  const sec = document.getElementById('certificados');
  if (!certs.length) { sec.classList.add('hidden'); return; }
  document.getElementById('certificados-lista').innerHTML = certs.map((c) => {
    const miniatura = !c.file ? `<div class="cert-thumb">${icon('file', 'icon-grande')}</div>`
      : c.is_pdf
        ? `<a class="cert-thumb" href="${esc(c.file)}" target="_blank" rel="noopener noreferrer">${icon('file')}<span>Abrir o PDF</span></a>`
        : `<a class="cert-thumb" href="${esc(c.file)}" target="_blank" rel="noopener noreferrer"><img src="${esc(c.file)}" alt="Certificado: ${esc(c.title)}" loading="lazy"></a>`;
    const emissor = c.issuer_url
      ? `<a class="link" href="${esc(c.issuer_url)}" target="_blank" rel="noopener noreferrer">${esc(c.issuer)}</a>` : esc(c.issuer);
    return `<li class="cert">${miniatura}<div class="cert-body"><h3>${esc(c.title)}</h3><p>${emissor}</p><p>${mesAno(c.issue_date)}</p>
      ${c.credential_url ? `<p><a class="link" href="${esc(c.credential_url)}" target="_blank" rel="noopener noreferrer">Ver credencial</a></p>` : ''}</div></li>`;
  }).join('');
}

function renderBlog(posts) {
  const el = document.getElementById('blog-lista');
  const ultimos = posts.slice(0, 3);
  if (!ultimos.length) { el.innerHTML = '<p class="empty">Ainda não há artigos.</p>'; return; }
  el.innerHTML = ultimos.map((p) => `
    <li><a class="post-row" href="post.html?slug=${encodeURIComponent(p.slug)}">
      <div class="meta"><time datetime="${esc(p.published_at)}">${dataLonga(p.published_at)}</time><br>${p.reading_time_minutes} min de leitura</div>
      <div><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></div>
    </a></li>`).join('');
}

function renderContacto(perfil) {
  document.getElementById('contacto-lista').innerHTML = `
    <li>${icon('phone')} ${htmlTelefone(perfil.whatsapp_number)}</li>
    <li>${icon('message')} <a class="link" href="${linkWhatsApp(perfil.whatsapp_number, WA_TEXTO)}" target="_blank" rel="noopener noreferrer">Conversar no WhatsApp</a></li>
    <li>${icon('mail')} <a class="link" href="mailto:${esc(perfil.email)}">${esc(perfil.email)}</a></li>
    <li>${icon('map-pin')} <span>${esc(perfil.location)}</span></li>
    <li>${icon('github')} <a class="link" href="${esc(perfil.github_url)}" target="_blank" rel="noopener noreferrer">GitHub</a>
        &nbsp; ${icon('facebook')} <a class="link" href="${esc(perfil.facebook_url)}" target="_blank" rel="noopener noreferrer">Facebook</a></li>`;
  document.getElementById('contacto-dica').textContent =
    'Toca no número para o guardares nos teus contactos como "Eng. Tiago Banze".';
}

function prepararFormulario(perfil) {
  const form = document.getElementById('contact-form');
  const botao = document.getElementById('contact-submit');
  const aviso = document.getElementById('contact-feedback');
  const comServidor = api.temServidor();
  botao.textContent = comServidor ? 'Enviar mensagem' : 'Enviar pelo WhatsApp';
  document.getElementById('form-nota').textContent = comServidor
    ? '' : 'A mensagem abre no WhatsApp, já escrita. Só tens de carregar em enviar.';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const nome = String(d.get('name') || '').trim();
    const email = String(d.get('email') || '').trim();
    const assunto = String(d.get('subject') || '').trim();
    const mensagem = String(d.get('message') || '').trim();
    aviso.className = 'feedback';
    if (nome.length < 2 || mensagem.length < 10) {
      aviso.className = 'feedback erro';
      aviso.textContent = 'Preenche o nome e escreve uma mensagem com pelo menos 10 caracteres.';
      return;
    }
    if (comServidor && !email) {
      aviso.className = 'feedback erro';
      aviso.textContent = 'Indica o teu email para eu poder responder.';
      return;
    }
    if (!comServidor) {
      const texto = `Olá Tiago, sou ${nome}.${assunto ? ` Assunto: ${assunto}.` : ''}\n\n${mensagem}${email ? `\n\nEmail: ${email}` : ''}`;
      window.open(linkWhatsApp(perfil.whatsapp_number, texto), '_blank', 'noopener');
      return;
    }
    botao.disabled = true;
    botao.textContent = 'A enviar...';
    const r = await api.sendContactMessage({ name: nome, email, subject: assunto, message: mensagem })
      .catch(() => ({ ok: false, detail: 'Sem ligação ao servidor. Tenta outra vez ou fala comigo pelo WhatsApp.' }));
    aviso.className = `feedback ${r.ok ? 'ok' : 'erro'}`;
    aviso.textContent = r.ok ? 'Mensagem enviada. Obrigado pelo contacto.' : r.detail;
    if (r.ok) form.reset();
    botao.disabled = false;
    botao.textContent = 'Enviar mensagem';
  });
}

async function tentar(promessa, aoFalhar) {
  try { return await promessa; } catch (erro) { console.error(erro); aoFalhar(); return null; }
}

document.addEventListener('DOMContentLoaded', async () => {
  const perfil = await tentar(api.getProfile(), () => {
    showConnError(document.getElementById('hero-bio'), 'o perfil');
  });
  const [formacao, servicos, projetos, certs, posts] = await Promise.all([
    tentar(api.getEducation(), () => {}),
    tentar(api.getServices(), () => showConnError(document.getElementById('servicos-lista'), 'os serviços')),
    tentar(api.getProjects(), () => showConnError(document.getElementById('projects-grid'), 'os projetos')),
    tentar(api.getCertifications(), () => {}),
    tentar(api.getPosts(), () => showConnError(document.getElementById('blog-lista'), 'os artigos')),
  ]);

  if (perfil) {
    renderHero(perfil);
    renderSobre(perfil, formacao || []);
    renderContacto(perfil);
    prepararFormulario(perfil);
  }
  if (servicos) renderServicos(servicos);
  if (projetos) montarProjetos(document.getElementById('projects-grid'), document.getElementById('projects-more'), projetos);
  if (certs) renderCertificados(certs);
  if (posts) renderBlog(posts);
});
