document.addEventListener('DOMContentLoaded', async () => {
  const grelha = document.getElementById('projects-grid');
  try {
    montarProjetos(grelha, null, await api.getProjects(), { inicial: 1000 });
  } catch (erro) {
    showConnError(grelha, 'os projetos');
    console.error(erro);
  }
});
