let ALL_POSTS = [];
let ACTIVE_CATEGORY = 'all';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' });
}

function renderCategories() {
  const map = new Map();
  ALL_POSTS.forEach((p) => { if (p.category) map.set(p.category.slug, p.category.name); });
  const el = document.getElementById('blog-categories');
  const btnClass = (active) => `rounded-full border px-4 py-1.5 font-body text-xs transition-colors ${
    active ? 'border-accent-dynamic bg-accent-dynamic text-[rgb(251_249_243)]' : 'border-dynamic text-ink-dynamic hover:bg-copper/10'
  }`;
  let html = `<button data-cat="all" class="${btnClass(ACTIVE_CATEGORY === 'all')}">Todas</button>`;
  map.forEach((name, slug) => { html += `<button data-cat="${slug}" class="${btnClass(ACTIVE_CATEGORY === slug)}">${name}</button>`; });
  el.innerHTML = html;
  el.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => { ACTIVE_CATEGORY = btn.dataset.cat; renderResults(); renderCategories(); });
  });
}

function renderResults() {
  const query = document.getElementById('blog-search').value.trim().toLowerCase();
  const filtered = ALL_POSTS.filter((post) => {
    const matchesCategory = ACTIVE_CATEGORY === 'all' || post.category?.slug === ACTIVE_CATEGORY;
    const matchesQuery = !query
      || post.title.toLowerCase().includes(query)
      || post.excerpt.toLowerCase().includes(query)
      || (post.tags || []).some((t) => t.toLowerCase().includes(query));
    return matchesCategory && matchesQuery;
  });

  const el = document.getElementById('blog-results');
  if (!filtered.length) {
    el.innerHTML = '<p class="col-span-full text-center font-body text-sm text-muted-dynamic">Nenhum artigo encontrado para esta pesquisa.</p>';
    return;
  }
  el.innerHTML = filtered.map((post) => `
    <a href="post.html?slug=${encodeURIComponent(post.slug)}" class="group flex flex-col rounded-2xl border border-dynamic bg-surface-card p-6 transition-colors hover:border-copper">
      ${post.category ? `<span class="font-mono text-[11px] uppercase tracking-wide text-teal-dark">${post.category.name}</span>` : ''}
      <h2 class="mt-3 font-display text-lg font-semibold text-ink-dynamic group-hover:text-accent-dynamic">${post.title}</h2>
      <p class="mt-2 flex-1 font-body text-sm leading-relaxed text-muted-dynamic">${post.excerpt}</p>
      <div class="mt-5 flex items-center justify-between font-mono text-[11px] text-muted-dynamic">
        <span>${formatDate(post.published_at)}</span>
        <span class="flex items-center gap-1">${icon('clock', 'h-3 w-3')} ${post.reading_time_minutes} min</span>
      </div>
    </a>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    ALL_POSTS = await api.getPosts();
    renderCategories();
    renderResults();
    document.getElementById('blog-search').addEventListener('input', renderResults);
  } catch (err) {
    showConnError(document.getElementById('blog-results'), 'artigos do blog');
    console.error(err);
  }
});
