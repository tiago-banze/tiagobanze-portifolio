const TYPE_LABEL = { work: 'Experiência', project: 'Projeto Autónomo', certification: 'Certificação' };
const SKILL_CATEGORY_LABEL = {
  backend: 'Back-End', frontend: 'Front-End', embedded: 'Eletrónica & Embarcados',
  network: 'Redes & Infraestrutura', tools: 'Ferramentas',
};

function formatMonthYear(dateStr) {
  if (!dateStr) return 'Atual';
  return new Date(dateStr).toLocaleDateString('pt-MZ', { month: 'short', year: 'numeric' });
}

function renderProfileHeader(profile) {
  const nameEl = document.getElementById('cv-name');
  nameEl.textContent = profile.full_name;
  nameEl.classList.remove('skeleton', 'h-10', 'w-64');
  document.getElementById('cv-headline').textContent = profile.headline;

  if (profile.cv_file) {
    const btn = document.getElementById('cv-download');
    btn.href = profile.cv_file;
    btn.setAttribute('download', '');
    btn.classList.remove('hidden');
  }
}

function renderTimeline(education, experience) {
  const items = [
    ...education.map((e) => ({
      key: `edu-${e.id}`, title: e.degree, org: e.institution, start: e.start_date, end: e.end_date,
      label: 'Formação Académica', description: e.description,
    })),
    ...experience.map((e) => ({
      key: `exp-${e.id}`, title: e.title, org: e.organization, start: e.start_date,
      end: e.is_current ? null : e.end_date, label: TYPE_LABEL[e.experience_type] || 'Experiência',
      description: e.description,
    })),
  ].sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());

  const el = document.getElementById('cv-timeline');
  if (!items.length) {
    el.innerHTML = '<p class="font-body text-sm text-muted-dynamic">Ainda sem itens.</p>';
    return;
  }
  el.innerHTML = items.map((item) => `
    <li class="relative">
      <span aria-hidden class="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-dynamic"></span>
      <p class="font-mono text-[11px] uppercase tracking-wide text-teal-dark">${item.label} · ${formatMonthYear(item.start)} — ${formatMonthYear(item.end)}</p>
      <p class="mt-1.5 font-display text-base font-semibold text-ink-dynamic">${item.title}</p>
      ${item.org ? `<p class="font-body text-sm text-muted-dynamic">${item.org}</p>` : ''}
      <p class="mt-2 font-body text-sm leading-relaxed text-ink-dynamic/85">${item.description || ''}</p>
    </li>`).join('');
}

function renderSkills(skills) {
  const byCategory = {};
  skills.forEach((s) => { (byCategory[s.category] ||= []).push(s); });

  const el = document.getElementById('cv-skills');
  const entries = Object.entries(byCategory);
  if (!entries.length) {
    el.innerHTML = '<p class="font-body text-sm text-muted-dynamic">Ainda sem competências listadas.</p>';
    return;
  }
  el.innerHTML = entries.map(([category, items]) => `
    <div>
      <p class="font-mono text-[11px] uppercase tracking-wide text-muted-dynamic">${SKILL_CATEGORY_LABEL[category] || category}</p>
      <ul class="mt-3 space-y-3">
        ${items.map((skill) => `
          <li>
            <div class="flex items-center justify-between font-body text-sm text-ink-dynamic">
              <span>${skill.name}</span>
              <span class="font-mono text-xs text-muted-dynamic">${skill.proficiency}%</span>
            </div>
            <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style="background-color: rgb(var(--border));">
              <div class="h-full rounded-full bg-accent-dynamic" style="width: ${skill.proficiency}%;"></div>
            </div>
          </li>`).join('')}
      </ul>
    </div>`).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
  document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon, 'h-4 w-4'); });

  try {
    const [profile, education, experience, skills] = await Promise.all([
      api.getProfile(), api.getEducation(), api.getExperience(), api.getSkills(),
    ]);
    renderProfileHeader(profile);
    renderTimeline(education, experience);
    renderSkills(skills);
  } catch (err) {
    showConnError(document.getElementById('cv-timeline-wrap'), 'curriculum');
    console.error(err);
  }
});
