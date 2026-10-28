function cabecalho(post) {
  document.getElementById('page-title').textContent = `${post.meta_title || post.title} | Tiago Victor Banze`;
  document.getElementById('page-canonical').setAttribute('href', `https://tiagobanze-portifolio-qn47.vercel.app/post.html?slug=${post.slug}`);
  document.getElementById('page-description').setAttribute('content', post.meta_description || post.excerpt);
  document.getElementById('post-header').innerHTML = `
    ${post.category ? `<p class="muted">${esc(post.category.name)}</p>` : ''}
    <h1 style="font-size:clamp(1.9rem,4vw,2.6rem);margin-top:.4rem">${esc(post.title)}</h1>
    <p class="muted" style="margin-top:.8rem">${dataLonga(post.published_at)} · ${post.reading_time_minutes} min de leitura</p>`;
  document.getElementById('post-content').innerHTML = markdownToHtml(post.content || '');
  document.getElementById('post-tags').innerHTML = (post.tags || []).map((t) => `<li>${esc(t)}</li>`).join('');
}

function htmlComentario(c) {
  return `<div><p><strong>${esc(c.name)}</strong> <span class="muted" style="font-size:.85rem">${dataLonga(c.created_at)}</span></p><p style="margin-top:.3rem">${esc(c.content)}</p></div>`;
}

function renderComentarios(lista) {
  document.getElementById('comments-heading').textContent = lista.length ? `Comentários (${lista.length})` : 'Comentários';
  document.getElementById('comments-list').innerHTML = lista.length
    ? lista.map(htmlComentario).join('') : '<p class="empty">Ainda ninguém comentou este artigo.</p>';
}

function prepararFormularioComentario(postId) {
  const form = document.getElementById('comment-form');
  const botao = document.getElementById('comment-submit');
  const aviso = document.getElementById('comment-feedback');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    botao.disabled = true;
    botao.classList.add('carregando');
    const d = new FormData(form);
    const r = await api.postComment({ post: postId, name: d.get('name'), email: d.get('email'), content: d.get('content') })
      .catch(() => ({ ok: false, detail: 'Sem ligação ao servidor.' }));
    if (r.ok) {
      const lista = document.getElementById('comments-list');
      if (lista.querySelector('.empty')) lista.innerHTML = '';
      lista.insertAdjacentHTML('afterbegin', htmlComentario(r.dados));
      form.reset();
      mostrarResultado(aviso, form, true, 'Comentário publicado.');
    } else {
      mostrarResultado(aviso, form, false, r.detail);
    }
    botao.disabled = false;
    botao.classList.remove('carregando');
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const slug = new URLSearchParams(location.search).get('slug');
  const topo = document.getElementById('post-header');
  if (!slug) { topo.innerHTML = '<div class="conn-error">Nenhum artigo indicado.</div>'; return; }
  try {
    const post = await api.getPostBySlug(slug);
    cabecalho(post);
    if (api.temServidor()) {
      document.getElementById('comentarios').classList.remove('hidden');
      prepararFormularioComentario(post.id);
      renderComentarios(await api.getComments(slug).catch(() => []));
    }
  } catch (erro) {
    topo.innerHTML = '<div class="conn-error">Não encontrei este artigo.</div>';
    console.error(erro);
  }
});
