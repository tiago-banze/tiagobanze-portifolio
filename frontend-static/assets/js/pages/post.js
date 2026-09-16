function formatDateLong(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' });
}
function formatDateShort(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', year: 'numeric' });
}

function renderPostHeader(post) {
  document.getElementById('page-title').textContent = `${post.meta_title || post.title} — Tiago Victor Banze`;
  document.getElementById('page-description').setAttribute('content', post.meta_description || post.excerpt);
  document.getElementById('page-canonical').setAttribute('href', `https://tiagobanze-portifolio-qn47.vercel.app/post.html?slug=${post.slug}`);

  document.getElementById('post-header').innerHTML = `
    ${post.category ? `<span class="font-mono text-xs uppercase tracking-wide text-teal-dark">${post.category.name}</span>` : ''}
    <h1 class="mt-3 font-display text-3xl font-semibold leading-tight text-ink-dynamic sm:text-4xl">${post.title}</h1>
    <div class="mt-4 flex items-center gap-4 font-mono text-xs text-muted-dynamic">
      <span>${formatDateLong(post.published_at)}</span>
      <span class="flex items-center gap-1">${icon('clock', 'h-3.5 w-3.5')} ${post.reading_time_minutes} min de leitura</span>
    </div>`;

  document.getElementById('post-content').innerHTML = markdownToHtml(post.content || '');

  if (post.tags && post.tags.length) {
    document.getElementById('post-tags').innerHTML = post.tags.map(
      (t) => `<span class="rounded-full bg-teal/10 px-3 py-1 font-mono text-[11px] text-teal-dark">#${t}</span>`
    ).join('');
  }
}

function renderComments(comments) {
  const heading = document.getElementById('comments-heading');
  heading.textContent = comments.length > 0 ? `Comentários (${comments.length})` : 'Comentários';

  const list = document.getElementById('comments-list');
  if (!comments.length) {
    list.innerHTML = '<p class="font-body text-sm text-muted-dynamic">Seja o primeiro a comentar este artigo.</p>';
    return;
  }
  list.innerHTML = comments.map((c) => `
    <div class="border-b border-dynamic pb-6 last:border-0">
      <div class="flex items-center justify-between">
        <p class="font-body text-sm font-semibold text-ink-dynamic">${c.name}</p>
        <p class="font-mono text-[11px] text-muted-dynamic">${formatDateShort(c.created_at)}</p>
      </div>
      <p class="mt-2 font-body text-sm leading-relaxed text-ink-dynamic/90">${c.content}</p>
    </div>`).join('');
}

function setupCommentForm(postId, slug) {
  const form = document.getElementById('comment-form');
  const submitBtn = document.getElementById('comment-submit');
  const feedback = document.getElementById('comment-feedback');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = `${icon('loader', 'h-4 w-4 animate-spin')} A publicar...`;
    feedback.textContent = '';

    const data = new FormData(form);
    const payload = {
      post: postId,
      name: String(data.get('name') || ''),
      email: String(data.get('email') || ''),
      content: String(data.get('content') || ''),
    };

    const result = await api.postComment(payload);
    if (result.ok && result.comment) {
      const list = document.getElementById('comments-list');
      if (list.querySelector('p')) list.innerHTML = '';
      list.insertAdjacentHTML('afterbegin', `
        <div class="border-b border-dynamic pb-6 last:border-0">
          <div class="flex items-center justify-between">
            <p class="font-body text-sm font-semibold text-ink-dynamic">${result.comment.name}</p>
            <p class="font-mono text-[11px] text-muted-dynamic">${formatDateShort(result.comment.created_at)}</p>
          </div>
          <p class="mt-2 font-body text-sm leading-relaxed text-ink-dynamic/90">${result.comment.content}</p>
        </div>`);
      form.reset();
      feedback.className = 'font-body text-sm';
    } else {
      feedback.className = 'font-body text-sm flex items-center gap-2 text-red-600';
      feedback.innerHTML = `${icon('alert-circle', 'h-4 w-4')} ${result.detail}`;
    }
    submitBtn.disabled = false;
    submitBtn.textContent = 'Publicar comentário';
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) {
    document.getElementById('post-header').innerHTML = '<div class="conn-error">Nenhum artigo especificado.</div>';
    return;
  }

  try {
    const post = await api.getPostBySlug(slug);
    renderPostHeader(post);
    setupCommentForm(post.id, slug);

    try {
      renderComments(await api.getComments(slug));
    } catch (err) {
      showConnError(document.getElementById('comments-list'), 'comentários');
      console.error(err);
    }
  } catch (err) {
    document.getElementById('post-header').innerHTML = '<div class="conn-error">Este artigo não foi encontrado ou o servidor não respondeu.</div>';
    console.error(err);
  }
});
