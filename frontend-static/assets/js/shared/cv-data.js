// Organiza os dados do site no formato do currículo.
// O PDF (cv-pdf.js) e a pré-visualização (pages/cv.js) usam o mesmo resultado.

const CV_CATEGORIAS = [
  ['backend', 'Back-end'],
  ['frontend', 'Front-end'],
  ['embedded', 'Eletrónica e sistemas embebidos'],
  ['network', 'Redes e infraestrutura'],
  ['tools', 'Ferramentas e outras'],
];
const CV_ESTADO = { production: 'em produção', completed: 'concluído', in_progress: 'em desenvolvimento', archived: 'arquivado' };

function cvPeriodo(inicio, fim, atual) {
  const a = mesAnoCurto(inicio);
  if (atual || !fim) return `${a} - atualidade`;
  const b = mesAnoCurto(fim);
  return a === b ? a : `${a} - ${b}`;
}

function prepararCv({ perfil, formacao, experiencia, competencias, certificados, projetos }) {
  const ordemData = (x, y) => (lerData(y.start_date) || 0) - (lerData(x.start_date) || 0);

  const grupos = CV_CATEGORIAS.map(([chave, rotulo]) => ({
    rotulo,
    itens: competencias.filter((s) => s.category === chave)
      .sort((x, y) => y.proficiency - x.proficiency).map((s) => s.name),
  })).filter((g) => g.itens.length);

  return {
    nome: perfil.full_name,
    cargos: perfil.headline.split('|').map((t) => t.trim()).filter(Boolean),
    contactos: [
      telefoneLegivel(perfil.whatsapp_number),
      perfil.email,
      perfil.location,
      String(perfil.github_url || '').replace(/^https?:\/\//, '').replace(/\/$/, ''),
    ].filter(Boolean),
    resumo: perfil.bio_short,
    experiencia: [...experiencia].filter((e) => e.experience_type !== 'certification').sort(ordemData).map((e) => ({
      titulo: e.title,
      organizacao: [e.organization, e.location].filter(Boolean).join(', '),
      periodo: cvPeriodo(e.start_date, e.end_date, e.is_current),
      texto: e.description,
    })),
    formacao: [...formacao].sort(ordemData).map((f) => ({
      titulo: f.degree,
      organizacao: [f.institution, f.location].filter(Boolean).join(', '),
      periodo: cvPeriodo(f.start_date, f.end_date, false),
      texto: f.description,
    })),
    projetos: projetos.slice(0, 4).map((p) => ({
      titulo: p.title,
      estado: CV_ESTADO[p.status] || '',
      texto: p.summary,
      tecnologias: (p.tech_tags || []).join(', '),
    })),
    competencias: grupos,
    certificados: certificados.map((c) => ({
      titulo: c.title,
      emissor: c.issuer,
      data: String(lerData(c.issue_date).getFullYear()),
    })),
  };
}

function nomeFicheiroCv(cv) {
  const base = cv.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `Curriculo-${base}.pdf`;
}
