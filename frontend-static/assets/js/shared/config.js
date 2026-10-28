// Configuração do site. Os dados que aparecem em todas as páginas ficam aqui.
window.PORTFOLIO_CONFIG = {
  nome: 'Tiago Victor Banze',
  telefone: '+258847388489',
  ficheiroContacto: 'tiago-banze.vcf',

  // API Django. Em localhost usa o Django local; no site publicado usa o backend na Vercel.
  apiBase: ['localhost', '127.0.0.1'].includes(location.hostname)
    ? 'http://localhost:8000/api'
    : 'https://tiagobanze-portifolio.vercel.app/api',
};
