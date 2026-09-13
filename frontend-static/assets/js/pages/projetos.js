const STATUS_LABEL = {
  production: 'Em produção',
  completed: 'Concluído',
  in_progress: 'Em desenvolvimento',
  archived: 'Arquivado',
};

function renderProjectsPage(projects) {
  const grid = document.getElementById('projects-grid');
  if (!projects.length) {
    grid.innerHTML = '<p class="text-muted-dynamic">Nenhum projeto publicado ainda.</p>';
    return;
  }
  grid.innerHTML = projects.map((p) => `
    <article class="overflow-hidden rounded-2xl border border-dynamic bg-surface-card">
      ${p.cover_image ? `<img src="${p.cover_image}" alt="${p.title}" class="h-48 w-full object-cover">` : ''}
      <div class="p-7">
      <div class="flex items-center justify-between gap-3">
        <span class="rounded-full border border-dynamic px-3 py-1 font-mono text-[11px] text-muted-dynamic">${STATUS_LABEL[p.status] || p.status}</span>
        <div class="flex items-center gap-2">
          ${p.repo_url ? `<a href="${p.repo_url}" target="_blank" rel="noopener noreferrer" aria-label="Repositório" class="text-muted-dynamic hover:text-accent-dynamic">${icon('github', 'h-4 w-4')}</a>` : ''}
          ${p.live_url ? `<a href="${p.live_url}" target="_blank" rel="noopener noreferrer" aria-label="Demo" class="text-muted-dynamic hover:text-accent-dynamic">${icon('external-link', 'h-4 w-4')}</a>` : ''}
        </div>
      </div>
      <h2 class="mt-5 font-display text-xl font-semibold text-ink-dynamic">${p.title}</h2>
      <p class="mt-2 font-body text-sm leading-relaxed text-muted-dynamic">${p.summary}</p>
      ${p.problem ? `<p class="mt-3 font-body text-sm leading-relaxed text-ink-dynamic/85"><span class="font-medium text-ink-dynamic">Problema: </span>${p.problem}</p>` : ''}
      ${p.solution ? `<p class="mt-2 font-body text-sm leading-relaxed text-ink-dynamic/85"><span class="font-medium text-ink-dynamic">Solução: </span>${p.solution}</p>` : ''}
      <div class="mt-6 flex flex-wrap gap-2">
        ${(p.tech_tags || []).map((t) => `<span class="rounded-full bg-teal/10 px-3 py-1 font-mono text-[11px] text-teal-dark">${t}</span>`).join('')}
      </div>
      </div>
    </article>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    renderProjectsPage(await api.getProjects());
  } catch (err) {
    showConnError(document.getElementById('projects-grid'), 'projetos');
    console.error(err);
  }
});
