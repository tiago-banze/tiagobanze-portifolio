// Ligação com a API do Django — JavaScript puro, sem framework.
// IMPORTANTE: propositadamente NÃO existe nenhum "dado de exemplo" aqui.
// Se a ligação falhar, a função lança um erro e quem chamou decide como
// mostrar isso na página (nunca escondido atrás de conteúdo falso).

// Depois de publicar o backend no Vercel, troque o valor abaixo pelo
// endereço real (ex.: 'https://tiagobanze-backend.vercel.app/api').
// Em localhost, continua a usar o Django local automaticamente.
const PRODUCTION_API_BASE = 'https://tiagobanze-portifolio.vercel.app/api';

const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const API_BASE = isLocal ? 'http://localhost:8000/api' : PRODUCTION_API_BASE;

/**
 * Faz um pedido GET à API. cache:'no-store' garante que o navegador
 * nunca reutiliza uma resposta antiga — cada carregamento de página
 * busca os dados mais recentes do banco de dados.
 */
async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`A API respondeu ${res.status} em ${path}`);
  }
  return res.json();
}

function unwrap(data) {
  // A API pagina algumas listas ({count, results}); outras devolvem array direto.
  return Array.isArray(data) ? data : (data.results ?? []);
}

const api = {
  getProfile: () => apiGet('/profile/'),
  getServices: () => apiGet('/services/').then(unwrap),
  getProjects: () => apiGet('/projects/').then(unwrap),
  getPosts: () => apiGet('/posts/').then(unwrap),
  getPostBySlug: (slug) => apiGet(`/posts/${encodeURIComponent(slug)}/`),
  getEducation: () => apiGet('/education/').then(unwrap),
  getExperience: () => apiGet('/experience/').then(unwrap),
  getSkills: () => apiGet('/skills/').then(unwrap),
  getCertifications: () => apiGet('/certifications/').then(unwrap),
  getComments: (slug) => apiGet(`/comments/?post__slug=${encodeURIComponent(slug)}`).then(unwrap),

  async sendContactMessage(payload) {
    const res = await fetch(`${API_BASE}/contact/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const firstError = Object.values(data)[0];
      const detail = Array.isArray(firstError) ? firstError[0] : 'Não foi possível enviar a mensagem.';
      return { ok: false, detail };
    }
    return { ok: true, detail: data.detail || 'Mensagem enviada com sucesso!' };
  },

  async postComment(payload) {
    const res = await fetch(`${API_BASE}/comments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      const firstError = Object.values(data)[0];
      const detail = Array.isArray(firstError) ? firstError[0] : 'Não foi possível publicar o comentário.';
      return { ok: false, detail };
    }
    return { ok: true, detail: 'Comentário publicado!', comment: data };
  },
};

/** Mostra um aviso de erro visível dentro de um contentor, em vez de esconder o problema. */
function showConnError(container, context) {
  container.innerHTML = `
    <div class="conn-error">
      Não foi possível carregar "${context}" a partir do servidor.
      Verifique se o backend Django está a correr em ${API_BASE.replace('/api', '')}.
    </div>`;
}
