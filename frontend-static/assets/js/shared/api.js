// Acesso aos dados do site: tudo vem da API Django (em localhost, o Django local).
// Não há dados de exemplo escondidos aqui. Se a ligação falhar, a página mostra
// um aviso claro em vez de conteúdo inventado.

const CFG = window.PORTFOLIO_CONFIG;
const ESTADO = { modo: 'api' };

async function pedir(url, opcoes) {
  const res = await fetch(url, { cache: 'no-store', ...opcoes });
  if (!res.ok) throw new Error(`${res.status} em ${url}`);
  return res.json();
}

/** A API devolve listas paginadas ({count, next, results}). Junta todas as páginas. */
async function lerTodasAsPaginas(caminho) {
  const saida = [];
  for (let pagina = 1; pagina < 50; pagina++) {
    const dados = await pedir(`${CFG.apiBase}${caminho}?page=${pagina}`);
    if (Array.isArray(dados)) return dados;
    saida.push(...(dados.results || []));
    if (!dados.next) break;
  }
  return saida;
}

async function carregar(caminhoApi, _ficheiro, { lista = false } = {}) {
  return lista ? lerTodasAsPaginas(caminhoApi) : pedir(`${CFG.apiBase}${caminhoApi}`);
}

const api = {
  estado: ESTADO,
  getProfile: () => carregar('/profile/', 'profile'),
  getServices: () => carregar('/services/', 'services', { lista: true }),
  getProjects: () => carregar('/projects/', 'projects', { lista: true }),
  getPosts: () => carregar('/posts/', 'posts', { lista: true }),
  getPostBySlug: (slug) => carregar(`/posts/${encodeURIComponent(slug)}/`, `posts/${encodeURIComponent(slug)}`),
  getEducation: () => carregar('/education/', 'education', { lista: true }),
  getExperience: () => carregar('/experience/', 'experience', { lista: true }),
  getSkills: () => carregar('/skills/', 'skills', { lista: true }),
  getCertifications: () => carregar('/certifications/', 'certifications', { lista: true }),

  /** Comentários e mensagens precisam do servidor. Sem ele, não há onde os guardar. */
  temServidor: () => true,

  async getComments(slug) {
    if (!api.temServidor()) return [];
    const dados = await pedir(`${CFG.apiBase}/comments/?post__slug=${encodeURIComponent(slug)}`);
    return Array.isArray(dados) ? dados : (dados.results || []);
  },

  async enviar(caminho, corpo, mensagemErro) {
    const res = await fetch(`${CFG.apiBase}${caminho}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(corpo),
    });
    const dados = await res.json().catch(() => ({}));
    if (!res.ok) {
      const primeiro = Object.values(dados)[0];
      return { ok: false, detail: Array.isArray(primeiro) ? primeiro[0] : (dados.detail || mensagemErro) };
    }
    return { ok: true, dados };
  },
  sendContactMessage: (corpo) => api.enviar('/contact/', corpo, 'Não foi possível enviar a mensagem.'),
  postComment: (corpo) => api.enviar('/comments/', corpo, 'Não foi possível publicar o comentário.'),
};

/** Aviso visível dentro de um contentor, para nunca esconder um erro de ligação. */
function showConnError(contentor, o_que) {
  contentor.innerHTML = `<div class="conn-error">Não foi possível carregar ${esc(o_que)}. `
    + 'Se estás a testar no teu computador, confirma que o Django está a correr (python manage.py runserver).</div>';
}
