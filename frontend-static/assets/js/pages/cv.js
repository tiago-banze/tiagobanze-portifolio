// Página do currículo: pré-visualização no ecrã e descarga em PDF.

function htmlEntradaCv(e) {
  return `<div class="cv-item">
    <div class="cv-item-head"><strong>${esc(e.titulo)}${e.estado ? ` (${esc(e.estado)})` : ''}</strong>${e.periodo || e.data ? `<span>${esc(e.periodo || e.data)}</span>` : ''}</div>
    ${e.organizacao || e.emissor || e.tecnologias ? `<p class="org">${esc(e.organizacao || e.emissor || e.tecnologias)}</p>` : ''}
    ${e.texto ? `<p>${esc(e.texto)}</p>` : ''}
  </div>`;
}

function renderPreVisualizacao(cv) {
  const seccao = (titulo, corpo) => (corpo ? `<h2>${titulo}</h2>${corpo}` : '');
  document.getElementById('cv-sheet').innerHTML = `
    <h1>${esc(cv.nome)}</h1>
    <p class="cv-cargos">${esc(cv.cargos.join(', '))}</p>
    <div class="cv-contactos">${cv.contactos.map((c) => `<span>${esc(c)}</span>`).join('')}</div>
    ${seccao('Perfil', `<p style="margin-top:.7rem">${esc(cv.resumo)}</p>`)}
    ${seccao('Experiência', cv.experiencia.map(htmlEntradaCv).join(''))}
    ${seccao('Formação', cv.formacao.map(htmlEntradaCv).join(''))}
    ${seccao('Projetos', cv.projetos.map(htmlEntradaCv).join(''))}
    ${seccao('Competências', cv.competencias.map((g) => `<div class="cv-skill"><strong>${esc(g.rotulo)}</strong><span>${esc(g.itens.join(', '))}</span></div>`).join(''))}
    ${seccao('Certificados e cursos', cv.certificados.map(htmlEntradaCv).join(''))}`;
}

function carregarScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = () => reject(new Error(`Não consegui carregar ${src}`));
    document.head.appendChild(s);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const botao = document.getElementById('cv-download');
  const erro = document.getElementById('cv-erro');
  let cv;
  try {
    const [perfil, formacao, experiencia, competencias, certificados, projetos] = await Promise.all([
      api.getProfile(), api.getEducation(), api.getExperience(), api.getSkills(), api.getCertifications(), api.getProjects(),
    ]);
    cv = prepararCv({ perfil, formacao, experiencia, competencias, certificados, projetos });
    renderPreVisualizacao(cv);
    botao.disabled = false;
  } catch (e) {
    console.error(e);
    showConnError(document.getElementById('cv-sheet'), 'o currículo');
    return;
  }

  botao.addEventListener('click', async () => {
    erro.textContent = '';
    botao.disabled = true;
    botao.classList.add('carregando');
    botao.textContent = 'A gerar o PDF';
    try {
      if (!window.jspdf) await carregarScript('assets/vendor/jspdf.umd.min.js');
      const doc = construirCvPdf(window.jspdf.jsPDF, cv);
      doc.save(nomeFicheiroCv(cv));
    } catch (e) {
      console.error(e);
      erro.textContent = 'Não foi possível gerar o PDF. Tenta outra vez.';
    } finally {
      botao.disabled = false;
      botao.classList.remove('carregando');
      botao.textContent = 'Descarregar PDF';
    }
  });
});
