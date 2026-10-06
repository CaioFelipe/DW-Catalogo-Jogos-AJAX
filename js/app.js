/**
 * ====================================================================
 * AVALIAÇÃO PRÁTICA INDIVIDUAL - DESENVOLVIMENTO WEB (UNEMAT)
 * Professor: Ivan Luiz Pedroso Pires
 * Aluno: Caio Felipe Gomes Lopes
 * Arquivo: js/app.js
 * Descrição: Lógica JavaScript pura (Vanilla JS) para consumo de dados
 *            via AJAX (Fetch API), manipulação do DOM e componentes Bootstrap 5.
 * ====================================================================
 */

// Estado global da aplicação
const estadoApp = {
  jogos: [],              // Armazena a lista de jogos obtida na 1ª requisição AJAX
  categoriaSelecionada: 'todas', // Categoria ativa no filtro
  termoPesquisa: '',      // Texto digitado no campo de busca
  modalBootstrap: null    // Instância do Modal do Bootstrap 5
};

// Elementos do DOM frequentemente acessados
const dom = {
  gridJogos: document.getElementById('gridJogos'),
  contadorJogos: document.getElementById('contadorJogos'),
  campoBusca: document.getElementById('campoBusca'),
  btnLimparBusca: document.getElementById('btnLimparBusca'),
  grupoCategorias: document.getElementById('grupoCategorias'),
  botoesFiltro: document.querySelectorAll('.filtro-btn'),
  
  // Contêineres de estados da interface
  estadoCarregamento: document.getElementById('estadoCarregamento'),
  estadoErro: document.getElementById('estadoErro'),
  mensagemErroTexto: document.getElementById('mensagemErroTexto'),
  btnTentarNovamente: document.getElementById('btnTentarNovamente'),
  estadoVazio: document.getElementById('estadoVazio'),
  btnResetarFiltros: document.getElementById('btnResetarFiltros'),

  // Elementos do Modal de Detalhes
  modalElemento: document.getElementById('modalDetalhes'),
  modalTitulo: document.getElementById('modalTitulo'),
  modalLoading: document.getElementById('modalLoading'),
  modalErro: document.getElementById('modalErro'),
  modalConteudo: document.getElementById('modalConteudo'),
  modalImagem: document.getElementById('modalImagem'),
  modalCategoria: document.getElementById('modalCategoria'),
  modalClassificacao: document.getElementById('modalClassificacao'),
  modalMetacritic: document.getElementById('modalMetacritic'),
  modalDesenvolvedora: document.getElementById('modalDesenvolvedora'),
  modalDistribuidora: document.getElementById('modalDistribuidora'),
  modalLancamento: document.getElementById('modalLancamento'),
  modalPlataformas: document.getElementById('modalPlataformas'),
  modalModos: document.getElementById('modalModos'),
  modalSinopse: document.getElementById('modalSinopse'),
  modalReqMinimos: document.getElementById('modalReqMinimos'),
  modalReqRecomendados: document.getElementById('modalReqRecomendados')
};

/**
 * Inicialização quando o DOM estiver completamente carregado
 */
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa o componente Modal do Bootstrap 5
  if (dom.modalElemento && typeof bootstrap !== 'undefined') {
    estadoApp.modalBootstrap = new bootstrap.Modal(dom.modalElemento);
  }

  // Registra todos os ouvintes de eventos
  configurarEventos();

  // Executa a primeira requisição AJAX obrigatória (carregar o catálogo)
  carregarCatalogo();
});

/**
 * Configuração dos manipuladores de eventos da página
 */
function configurarEventos() {
  // Evento de digitação na busca com resposta em tempo real
  dom.campoBusca.addEventListener('input', (e) => {
    estadoApp.termoPesquisa = e.target.value.trim().toLowerCase();
    aplicarFiltros();
  });

  // Botão para limpar o campo de busca
  dom.btnLimparBusca.addEventListener('click', () => {
    dom.campoBusca.value = '';
    estadoApp.termoPesquisa = '';
    aplicarFiltros();
    dom.campoBusca.focus();
  });

  // Filtro por botões de categoria
  dom.botoesFiltro.forEach((botao) => {
    botao.addEventListener('click', () => {
      // Atualiza a classe ativa visualmente
      dom.botoesFiltro.forEach((b) => {
        b.classList.remove('btn-primary', 'active');
        b.classList.add('btn-outline-secondary');
      });
      botao.classList.remove('btn-outline-secondary');
      botao.classList.add('btn-primary', 'active');

      // Atualiza o estado da categoria
      estadoApp.categoriaSelecionada = botao.getAttribute('data-categoria');
      aplicarFiltros();
    });
  });

  // Botão de nova tentativa em caso de erro na 1ª requisição
  dom.btnTentarNovamente.addEventListener('click', () => {
    carregarCatalogo();
  });

  // Botão de limpar filtros a partir do estado vazio
  dom.btnResetarFiltros.addEventListener('click', () => {
    resetarFiltros();
  });

  // Delegação de eventos para os botões "Ver Detalhes" dos cards
  dom.gridJogos.addEventListener('click', (e) => {
    const botaoDetalhes = e.target.closest('.btn-detalhes');
    if (botaoDetalhes) {
      const idJogo = botaoDetalhes.getAttribute('data-id');
      if (idJogo) {
        consultarDetalhesJogo(idJogo);
      }
    }
  });
}

/**
 * ====================================================================
 * FUNCIONALIDADE AJAX 1: Listagem Dinâmica de Jogos
 * Carrega a lista com pelo menos 8 itens (carregamos 10 itens) de 'data/jogos.json'
 * ====================================================================
 */
async function carregarCatalogo() {
  // Transição de interface para o estado de carregamento
  mostrarCarregamento(true);
  ocultarErro();
  ocultarVazio();
  dom.gridJogos.innerHTML = '';
  dom.contadorJogos.textContent = 'Carregando...';

  try {
    // Requisição assíncrona HTTP utilizando Fetch API
    const resposta = await fetch('data/jogos.json');

    if (!resposta.ok) {
      throw new Error(`Falha na requisição HTTP: status ${resposta.status}`);
    }

    const dados = await resposta.json();

    if (!Array.isArray(dados) || dados.length === 0) {
      throw new Error('A fonte de dados retornou uma lista vazia ou inválida.');
    }

    // Armazena no estado global e renderiza
    estadoApp.jogos = dados;
    mostrarCarregamento(false);
    aplicarFiltros();

  } catch (erro) {
    console.error('Erro ao carregar o catálogo de jogos:', erro);
    mostrarCarregamento(false);
    mostrarErro(`Não foi possível carregar os jogos (${erro.message}). Verifique se o servidor HTTP local está ativo.`);
  }
}

/**
 * ====================================================================
 * FUNCIONALIDADE AJAX 2: Consulta de Detalhes do Item
 * Requisito estrito: Executa nova requisição AJAX separada para 'data/detalhes/{id}.json'
 * e exibe as informações exclusivas dentro do Modal do Bootstrap 5.
 * ====================================================================
 */
async function consultarDetalhesJogo(id) {
  // Localiza os dados preliminares do jogo já carregados
  const jogoBase = estadoApp.jogos.find((j) => j.id == id);

  // Define título inicial no modal e abre o componente Bootstrap
  dom.modalTitulo.textContent = jogoBase ? jogoBase.titulo : 'Carregando detalhes...';
  
  // Prepara o estado visual interno do modal (spinner visível)
  dom.modalLoading.classList.remove('d-none');
  dom.modalErro.classList.add('d-none');
  dom.modalConteudo.classList.add('d-none');

  if (estadoApp.modalBootstrap) {
    estadoApp.modalBootstrap.show();
  }

  try {
    // NOVA REQUISIÇÃO AJAX (Fetch para obter dados aprofundados)
    const resposta = await fetch(`data/detalhes/${id}.json`);

    if (!resposta.ok) {
      throw new Error(`Erro ao obter detalhes (Status HTTP ${resposta.status})`);
    }

    const detalhes = await resposta.json();

    // Renderiza os dados exclusivos obtidos da 2ª requisição
    preencherModalComDetalhes(jogoBase, detalhes);

    // Exibe o conteúdo completo e oculta o spinner interno
    dom.modalLoading.classList.add('d-none');
    dom.modalConteudo.classList.remove('d-none');

  } catch (erro) {
    console.error(`Erro ao consultar detalhes do jogo ID ${id}:`, erro);
    dom.modalLoading.classList.add('d-none');
    dom.modalErro.classList.remove('d-none');
  }
}

/**
 * Preenche a janela modal com os dados detalhados retornados da 2ª requisição
 */
function preencherModalComDetalhes(jogoBase, detalhes) {
  dom.modalTitulo.textContent = detalhes.titulo || (jogoBase ? jogoBase.titulo : 'Detalhes do Jogo');
  
  if (jogoBase && jogoBase.imagem) {
    dom.modalImagem.src = jogoBase.imagem;
    dom.modalImagem.alt = `Capa do jogo ${detalhes.titulo}`;
  }

  dom.modalCategoria.textContent = (jogoBase && jogoBase.categoria) ? jogoBase.categoria : 'Geral';
  dom.modalClassificacao.textContent = (jogoBase && jogoBase.classificacao) ? `Classificação: ${jogoBase.classificacao}` : 'Livre';
  
  dom.modalMetacritic.textContent = detalhes.notaMetacritic || 'N/A';
  dom.modalDesenvolvedora.textContent = detalhes.desenvolvedora || 'Não informada';
  dom.modalDistribuidora.textContent = detalhes.distribuidora || 'Não informada';
  dom.modalLancamento.textContent = detalhes.dataLancamento || 'Não informada';
  
  dom.modalPlataformas.textContent = Array.isArray(detalhes.plataformas) 
    ? detalhes.plataformas.join(', ') 
    : 'Diversas';
    
  dom.modalModos.textContent = Array.isArray(detalhes.modosDeJogo) 
    ? detalhes.modosDeJogo.join(', ') 
    : 'Um jogador';

  dom.modalSinopse.textContent = detalhes.sinopseCompleta || 'Sinopse não disponível.';

  // Renderiza Requisitos Mínimos
  dom.modalReqMinimos.innerHTML = '';
  if (detalhes.requisitosSistema && detalhes.requisitosSistema.minimos) {
    const min = detalhes.requisitosSistema.minimos;
    dom.modalReqMinimos.innerHTML = `
      <li><strong>SO:</strong> ${escapeHtml(min.so || '-')}</li>
      <li><strong>Processador:</strong> ${escapeHtml(min.processador || '-')}</li>
      <li><strong>Memória:</strong> ${escapeHtml(min.memoria || '-')}</li>
      <li><strong>Placa de Vídeo:</strong> ${escapeHtml(min.placaVideo || '-')}</li>
      <li><strong>Espaço:</strong> ${escapeHtml(min.armazenamento || '-')}</li>
    `;
  } else {
    dom.modalReqMinimos.innerHTML = '<li>Informações não especificadas.</li>';
  }

  // Renderiza Requisitos Recomendados
  dom.modalReqRecomendados.innerHTML = '';
  if (detalhes.requisitosSistema && detalhes.requisitosSistema.recomendados) {
    const rec = detalhes.requisitosSistema.recomendados;
    dom.modalReqRecomendados.innerHTML = `
      <li><strong>SO:</strong> ${escapeHtml(rec.so || '-')}</li>
      <li><strong>Processador:</strong> ${escapeHtml(rec.processador || '-')}</li>
      <li><strong>Memória:</strong> ${escapeHtml(rec.memoria || '-')}</li>
      <li><strong>Placa de Vídeo:</strong> ${escapeHtml(rec.placaVideo || '-')}</li>
      <li><strong>Espaço:</strong> ${escapeHtml(rec.armazenamento || '-')}</li>
    `;
  } else {
    dom.modalReqRecomendados.innerHTML = '<li>Informações não especificadas.</li>';
  }
}

/**
 * ====================================================================
 * FUNCIONALIDADE DE BUSCA E FILTRAGEM
 * Atualiza os resultados sem recarregar a página
 * ====================================================================
 */
function aplicarFiltros() {
  const { jogos, categoriaSelecionada, termoPesquisa } = estadoApp;

  // Filtra simultaneamente por texto e categoria
  const jogosFiltrados = jogos.filter((jogo) => {
    // Verificação de categoria
    const atendeCategoria = (categoriaSelecionada === 'todas') || 
      (jogo.categoria.toLowerCase() === categoriaSelecionada.toLowerCase());

    // Verificação de texto (busca no título ou no resumo)
    const atendeBusca = (termoPesquisa === '') ||
      jogo.titulo.toLowerCase().includes(termoPesquisa) ||
      jogo.resumo.toLowerCase().includes(termoPesquisa);

    return atendeCategoria && atendeBusca;
  });

  renderizarCards(jogosFiltrados);
}

/**
 * Renderiza os cards de jogos dinamicamente no DOM
 */
function renderizarCards(itens) {
  dom.gridJogos.innerHTML = '';

  if (itens.length === 0) {
    mostrarVazio();
    dom.contadorJogos.textContent = '0 jogos encontrados';
    return;
  }

  ocultarVazio();
  dom.contadorJogos.textContent = `${itens.length} de ${estadoApp.jogos.length} jogos exibidos`;

  // Monta os cards utilizando template strings e boas práticas semânticas
  itens.forEach((jogo) => {
    const article = document.createElement('article');
    article.className = 'col-12 col-sm-6 col-lg-4 col-xl-3 animar-fade-in';

    article.innerHTML = `
      <div class="card card-jogo h-100 shadow-sm d-flex flex-column">
        <div class="card-img-wrapper position-relative">
          <img 
            src="${escapeHtml(jogo.imagem)}" 
            class="card-img-top" 
            alt="Capa do jogo ${escapeHtml(jogo.titulo)}"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'"
          >
          <span class="badge badge-categoria-float text-white">
            ${escapeHtml(jogo.categoria)}
          </span>
          <span class="badge badge-ano-float text-light">
            <i class="bi bi-calendar3 me-1"></i>${escapeHtml(String(jogo.ano || ''))}
          </span>
        </div>
        <div class="card-body d-flex flex-column p-3">
          <h3 class="h5 card-title fw-bold text-white mb-2 line-clamp-1" title="${escapeHtml(jogo.titulo)}">
            ${escapeHtml(jogo.titulo)}
          </h3>
          <p class="card-text text-secondary small flex-grow-1 mb-3">
            ${escapeHtml(jogo.resumo)}
          </p>
          <button 
            type="button" 
            class="btn btn-primary btn-sm rounded-pill w-100 mt-auto btn-detalhes d-flex align-items-center justify-content-center gap-2" 
            data-id="${jogo.id}"
            aria-label="Ver mais detalhes sobre ${escapeHtml(jogo.titulo)}"
          >
            <i class="bi bi-info-circle"></i>
            <span>Ver Detalhes</span>
          </button>
        </div>
      </div>
    `;

    dom.gridJogos.appendChild(article);
  });
}

/**
 * Reseta todos os filtros e campo de busca para o estado inicial
 */
function resetarFiltros() {
  dom.campoBusca.value = '';
  estadoApp.termoPesquisa = '';
  estadoApp.categoriaSelecionada = 'todas';

  dom.botoesFiltro.forEach((b) => {
    b.classList.remove('btn-primary', 'active');
    b.classList.add('btn-outline-secondary');
    if (b.getAttribute('data-categoria') === 'todas') {
      b.classList.remove('btn-outline-secondary');
      b.classList.add('btn-primary', 'active');
    }
  });

  aplicarFiltros();
}

/**
 * ====================================================================
 * FUNÇÕES DE CONTROLE DE ESTADOS VISUAIS (Loading, Erro, Vazio)
 * ====================================================================
 */
function mostrarCarregamento(ativo) {
  if (ativo) {
    dom.estadoCarregamento.classList.remove('d-none');
  } else {
    dom.estadoCarregamento.classList.add('d-none');
  }
}

function mostrarErro(mensagem) {
  dom.mensagemErroTexto.textContent = mensagem;
  dom.estadoErro.classList.remove('d-none');
}

function ocultarErro() {
  dom.estadoErro.classList.add('d-none');
}

function mostrarVazio() {
  dom.estadoVazio.classList.remove('d-none');
}

function ocultarVazio() {
  dom.estadoVazio.classList.add('d-none');
}

/**
 * Função utilitária para prevenir injeção XSS em dados de texto
 */
function escapeHtml(texto) {
  if (texto === null || texto === undefined) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
