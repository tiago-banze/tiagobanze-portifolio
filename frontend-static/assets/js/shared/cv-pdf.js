// Desenha o currículo em PDF (A4) com a jsPDF. O texto fica selecionável e pesquisável.
// Tenta primeiro tamanhos normais e vai encolhendo até caber em 2 páginas.

function desenharCv(JsPDF, cv, k) {
  const doc = new JsPDF({ unit: 'mm', format: 'a4', compress: true });
  doc.setProperties({ title: `Currículo - ${cv.nome}`, author: cv.nome });

  const M = 16, LARGURA_PAG = 210, ALTURA_PAG = 297;
  const L = LARGURA_PAG - 2 * M;
  const COR = { ink: [22, 33, 43], muted: [86, 99, 112], accent: [28, 79, 160], line: [216, 220, 213] };
  const T = { nome: 23 * k, cargo: 10.5 * k, corpo: 9.2 * k, pequeno: 8.4 * k, titulo: 10.6 * k };
  const ALT = 1.36;                                   // altura de linha
  const mm = (pt) => pt * 0.3528 * ALT;
  let y = M;

  const nova = () => { doc.addPage(); y = M; };
  const garantir = (h) => { if (y + h > ALTURA_PAG - M) nova(); };
  const definir = (tam, estilo, cor) => { doc.setFont('helvetica', estilo); doc.setFontSize(tam); doc.setTextColor(...cor); };

  function bloco(texto, tam, estilo, cor, x = M, largura = L) {
    definir(tam, estilo, cor);
    const linhas = doc.splitTextToSize(String(texto || ''), largura);
    linhas.forEach((l) => { garantir(mm(tam)); y += mm(tam); doc.text(l, x, y - mm(tam) * 0.22); });
    return linhas.length;
  }
  const alturaBloco = (texto, tam, estilo, largura = L) => {
    definir(tam, estilo, COR.ink);
    return doc.splitTextToSize(String(texto || ''), largura).length * mm(tam);
  };

  function titulo(texto, minimoDepois) {
    garantir(mm(T.titulo) + 8 + minimoDepois);
    y += 7 * k;
    definir(T.titulo, 'bold', COR.accent);
    doc.text(texto, M, y);
    y += 1.6;
    doc.setDrawColor(...COR.line); doc.setLineWidth(0.25);
    doc.line(M, y, M + L, y);
    y += 1.2;
  }

  function entrada({ titulo: t, organizacao, periodo, texto }) {
    const h = mm(T.corpo) * 2 + (organizacao ? mm(T.pequeno) : 0) + alturaBloco(texto, T.corpo, 'normal');
    garantir(Math.min(h, 40));
    y += 2.6 * k;
    definir(T.corpo, 'bold', COR.ink);
    const larguraPeriodo = periodo ? doc.getTextWidth(periodo) + 4 : 0;
    const linhasTitulo = doc.splitTextToSize(t, L - larguraPeriodo);
    linhasTitulo.forEach((l, i) => { y += mm(T.corpo); doc.text(l, M, y - mm(T.corpo) * 0.22); if (i === 0 && periodo) { definir(T.pequeno, 'normal', COR.muted); doc.text(periodo, M + L, y - mm(T.corpo) * 0.22, { align: 'right' }); definir(T.corpo, 'bold', COR.ink); } });
    if (organizacao) bloco(organizacao, T.pequeno, 'normal', COR.muted);
    if (texto) bloco(texto, T.corpo, 'normal', COR.ink);
  }

  // Cabeçalho
  y += mm(T.nome) * 0.7;
  definir(T.nome, 'bold', COR.ink);
  doc.text(cv.nome, M, y);
  y += 1.5;
  bloco(cv.cargos.join(', '), T.cargo, 'normal', COR.accent);
  y += 0.8;
  bloco(cv.contactos.join('   |   '), T.pequeno, 'normal', COR.muted);

  // Perfil
  titulo('Perfil', mm(T.corpo) * 2);
  y += 1.4;
  bloco(cv.resumo, T.corpo, 'normal', COR.ink);

  if (cv.experiencia.length) {
    titulo('Experiência', 22);
    cv.experiencia.forEach(entrada);
  }
  if (cv.formacao.length) {
    titulo('Formação', 22);
    cv.formacao.forEach(entrada);
  }
  if (cv.projetos.length) {
    titulo('Projetos', 18);
    cv.projetos.forEach((p) => entrada({
      titulo: p.estado ? `${p.titulo} (${p.estado})` : p.titulo,
      organizacao: p.tecnologias,
      texto: p.texto,
    }));
  }
  if (cv.competencias.length) {
    titulo('Competências', 16);
    y += 1.2;
    cv.competencias.forEach((g) => {
      const larguraRotulo = 50;
      definir(T.corpo, 'bold', COR.ink);
      const rotulo = doc.splitTextToSize(g.rotulo, larguraRotulo - 4);
      definir(T.corpo, 'normal', COR.ink);
      const itens = doc.splitTextToSize(g.itens.join(', '), L - larguraRotulo);
      const linhas = Math.max(rotulo.length, itens.length);
      garantir(linhas * mm(T.corpo) + 1.6);
      y += 1.6;
      const topo = y;
      definir(T.corpo, 'bold', COR.ink);
      rotulo.forEach((l, i) => doc.text(l, M, topo + mm(T.corpo) * (i + 1) - mm(T.corpo) * 0.22));
      definir(T.corpo, 'normal', COR.ink);
      itens.forEach((l, i) => doc.text(l, M + larguraRotulo, topo + mm(T.corpo) * (i + 1) - mm(T.corpo) * 0.22));
      y = topo + linhas * mm(T.corpo);
    });
  }
  if (cv.certificados.length) {
    titulo('Certificados e cursos', 14);
    cv.certificados.forEach((c) => entrada({ titulo: c.titulo, periodo: c.data, organizacao: c.emissor }));
  }
  return { doc, paginas: doc.getNumberOfPages() };
}

function construirCvPdf(JsPDF, cv) {
  // Primeiro tenta caber numa página, com o texto o maior possível.
  for (const k of [1.1, 1.05, 1, 0.95, 0.92]) {
    const r = desenharCv(JsPDF, cv, k);
    if (r.paginas === 1) return r.doc;
  }
  // Se não couber, aceita duas páginas e encolhe só o necessário.
  for (const k of [1, 0.95, 0.9, 0.86]) {
    const r = desenharCv(JsPDF, cv, k);
    if (r.paginas <= 2) return r.doc;
  }
  // Último recurso: tira os projetos para não passar das 2 páginas.
  return desenharCv(JsPDF, { ...cv, projetos: [] }, 0.86).doc;
}

if (typeof module !== 'undefined') module.exports = { construirCvPdf, desenharCv };
