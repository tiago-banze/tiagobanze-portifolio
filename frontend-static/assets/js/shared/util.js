// Funções pequenas usadas em várias páginas.

/** Escapa texto vindo da base de dados antes de o pôr em HTML. */
function esc(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const MESES_CURTOS = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];

function lerData(texto) {
  if (!texto) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(texto);
}
/** 13 de setembro de 2026 */
function dataLonga(texto) {
  const d = lerData(texto);
  return d ? `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}` : '';
}
/** setembro de 2026 */
function mesAno(texto) {
  const d = lerData(texto);
  return d ? `${MESES[d.getMonth()]} de ${d.getFullYear()}` : '';
}
/** set. 2026 */
function mesAnoCurto(texto) {
  const d = lerData(texto);
  return d ? `${MESES_CURTOS[d.getMonth()]} ${d.getFullYear()}` : '';
}

/** +258847388489 -> +258 84 738 8489 */
function telefoneLegivel(numero) {
  const d = String(numero || '').replace(/\D/g, '');
  if (d.length === 12 && d.startsWith('258')) return `+258 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
  return numero || '';
}
function soDigitos(numero) { return String(numero || '').replace(/\D/g, ''); }

/**
 * O número abre o cartão de contacto (.vcf): no telemóvel, o sistema pergunta se
 * queres guardá-lo nos contactos. O botão ao lado liga diretamente.
 */
function htmlTelefone(numero, opcoes = {}) {
  const cfg = window.PORTFOLIO_CONFIG;
  const legivel = telefoneLegivel(numero || cfg.telefone);
  const ligar = `tel:+${soDigitos(numero || cfg.telefone)}`;
  return `<a class="tel" href="${cfg.ficheiroContacto}" download="Eng-Tiago-Banze.vcf" title="Guardar nos contactos">${legivel}</a>`
    + (opcoes.semBotao ? '' : ` <a class="icon-btn" href="${ligar}" aria-label="Ligar para ${legivel}" title="Ligar">${icon('phone')}</a>`);
}

function linkWhatsApp(numero, texto) {
  const base = `https://wa.me/${soDigitos(numero || window.PORTFOLIO_CONFIG.telefone)}`;
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base;
}
