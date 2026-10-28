// Cartões de projetos, usados na página inicial e em projetos.html.

const ESTADO_PROJETO = {
  production: 'Em produção',
  completed: 'Concluído',
  in_progress: 'Em desenvolvimento',
  archived: 'Arquivado',
};

function htmlProjeto(p) {
  const tags = (p.tech_tags || []).map((t) => `<li>${esc(t)}</li>`).join('');
  const detalhes = (p.problem || p.solution) ? `
    <details>
      <summary>Ver detalhes</summary>
      <dl>
        ${p.problem ? `<div><dt>Problema</dt><dd>${esc(p.problem)}</dd></div>` : ''}
        ${p.solution ? `<div><dt>Solução</dt><dd>${esc(p.solution)}</dd></div>` : ''}
      </dl>
    </details>` : '';
  const links = [
    p.live_url ? `<a class="link" href="${esc(p.live_url)}" target="_blank" rel="noopener noreferrer">Abrir projeto</a>` : '',
    p.repo_url ? `<a class="link" href="${esc(p.repo_url)}" target="_blank" rel="noopener noreferrer">Código no GitHub</a>` : '',
  ].join('');
  return `
    <article class="card">
      ${p.cover_image ? `<img class="card-media" src="${esc(p.cover_image)}" alt="Imagem do projeto ${esc(p.title)}" loading="lazy">` : ''}
      <div class="card-body">
        <p class="status status-${esc(p.status)}">${esc(ESTADO_PROJETO[p.status] || p.status)}</p>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.summary)}</p>
        ${tags ? `<ul class="tags">${tags}</ul>` : ''}
        ${detalhes}
        ${links ? `<p class="card-links">${links}</p>` : ''}
      </div>
    </article>`;
}

/**
 * Mostra `inicial` projetos e um botão "Ver mais" que revela os seguintes.
 * Quando tiveres mais projetos, aparecem aqui sozinhos.
 */
function montarProjetos(grelha, botaoWrap, projetos, { inicial = 4, passo = 4 } = {}) {
  if (!projetos.length) {
    grelha.innerHTML = '<p class="empty">Ainda não há projetos publicados.</p>';
    return;
  }
  let mostrados = 0;
  function mostrar(ate) {
    // acrescenta só os novos, para não fechar os "Ver detalhes" que já abriste
    grelha.insertAdjacentHTML('beforeend', projetos.slice(mostrados, ate).map(htmlProjeto).join(''));
    mostrados = Math.min(ate, projetos.length);
    if (!botaoWrap) return;
    const falta = projetos.length - mostrados;
    botaoWrap.classList.toggle('hidden', falta <= 0);
    botaoWrap.innerHTML = falta > 0 ? `<button type="button" class="btn btn-line">Ver mais projetos (${falta})</button>` : '';
    if (falta > 0) botaoWrap.firstElementChild.addEventListener('click', () => mostrar(mostrados + passo));
  }
  grelha.innerHTML = '';
  mostrar(inicial);
}
