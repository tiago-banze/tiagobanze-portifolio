let TODOS = [];
let CATEGORIA = 'todas';

function renderCategorias() {
  const mapa = new Map();
  TODOS.forEach((p) => { if (p.category) mapa.set(p.category.slug, p.category.name); });
  const el = document.getElementById('blog-categories');
  const botoes = [['todas', 'Todas'], ...mapa.entries()];
  el.innerHTML = botoes.map(([slug, nome]) =>
    `<button type="button" class="chip" data-cat="${esc(slug)}" aria-pressed="${slug === CATEGORIA}">${esc(nome)}</button>`).join('');
  el.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
    CATEGORIA = b.dataset.cat; renderCategorias(); renderResultados();
  }));
}

function renderResultados() {
  const q = document.getElementById('blog-search').value.trim().toLowerCase();
  const lista = TODOS.filter((p) => {
    const categoriaOk = CATEGORIA === 'todas' || (p.category && p.category.slug === CATEGORIA);
    const textoOk = !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)
      || (p.tags || []).some((t) => t.toLowerCase().includes(q));
    return categoriaOk && textoOk;
  });
  const el = document.getElementById('blog-results');
  if (!lista.length) { el.innerHTML = '<li class="empty">Nenhum artigo encontrado.</li>'; return; }
  el.innerHTML = lista.map((p) => `
    <li><a class="post-row" href="post.html?slug=${encodeURIComponent(p.slug)}">
      <div class="meta"><time datetime="${esc(p.published_at)}">${dataLonga(p.published_at)}</time><br>${p.reading_time_minutes} min de leitura${p.category ? `<br>${esc(p.category.name)}` : ''}</div>
      <div><h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p></div>
    </a></li>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    TODOS = await api.getPosts();
    renderCategorias();
    renderResultados();
    document.getElementById('blog-search').addEventListener('input', renderResultados);
  } catch (erro) {
    showConnError(document.getElementById('blog-results'), 'os artigos');
    console.error(erro);
  }
});
