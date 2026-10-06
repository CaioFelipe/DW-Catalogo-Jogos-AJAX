# GameHub — Catálogo Interativo de Jogos Digitais

> **Avaliação Prática Individual — Desenvolvimento Web**  
> **Universidade do Estado de Mato Grosso (UNEMAT)**  
> **Professor:** Ivan Luiz Pedroso Pires  
> **Aluno / Autor:** Caio Felipe Gomes Lopes  
> **Data de Submissão:** 05/10/2026  
> **Link do Repositório GitHub:** [https://github.com/CaioFelipe/DW-Catalogo-Jogos-AJAX](https://github.com/CaioFelipe/DW-Catalogo-Jogos-AJAX)  

---

## 1. Visão Geral e Tema

O **GameHub** é um website interativo do tipo catálogo de jogos digitais desenvolvido para demonstrar o domínio de **HTML5 semântico**, **Bootstrap 5 UI**, **design responsivo** e **requisições assíncronas (AJAX)** com JavaScript puro (Vanilla JS), sem a utilização de frameworks como React, Vue ou Angular.

A aplicação opera sem recarregar a página (*Single Page Application experience*), gerenciando estados de carregamento, erros de conexão, buscas dinâmicas em tempo real, filtragem combinada por categorias e consulta de detalhes aprofundados por meio de uma **segunda requisição AJAX dedicada**.

---

## 2. Tecnologias Utilizadas

- **HTML5:** Marcação semântica com metadados completos (`lang="pt-BR"`, UTF-8, viewport, tags semânticas `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`).
- **CSS3 Personalizado (`css/styles.css`):** Estilização com paleta *dark gaming*, transições suaves, elevação com sombras, proporções fixas de imagem e responsividade sem rolagem horizontal.
- **Bootstrap 5.3.3 & Bootstrap Icons 1.11.3 (via CDN):** Componentes de interface (Navbar, Cards, Badges, Botões, Formulário e Modal dinâmico).
- **JavaScript Puro (ES6+ Vanilla JS com Fetch API):** Manipulação assíncrona do DOM, consumo de endpoints HTTP locais, controle de estados visuais e eventos.
- **Base de Dados JSON:** Arquitetura desacoplada em arquivos JSON locais servidos via HTTP.

---

## 3. Estrutura de Diretórios e Arquivos

```text
Prova1/
├── index.html                  # Interface semântica HTML5 e componentes Bootstrap
├── css/
│   └── styles.css              # Regras de estilo, tema dark e transições personalizadas
├── js/
│   └── app.js                  # Lógica assíncrona AJAX, eventos e renderização do DOM
├── data/
│   ├── jogos.json              # Fonte 1: Listagem inicial (10 jogos cadastrados)
│   └── detalhes/               # Fonte 2: Arquivos individuais para a 2ª requisição AJAX
│       ├── 1.json              # The Witcher 3: Wild Hunt
│       ├── 2.json              # Elden Ring
│       ├── 3.json              # Cyberpunk 2077
│       ├── 4.json              # Red Dead Redemption 2
│       ├── 5.json              # God of War Ragnarök
│       ├── 6.json              # Hollow Knight
│       ├── 7.json              # Sid Meier's Civilization VI
│       ├── 8.json              # Resident Evil 4 Remake
│       ├── 9.json              # Baldur's Gate 3
│       └── 10.json             # Forza Horizon 5
├── Avaliacao_Pratica_Desenvolvimento_Web.pdf # Enunciado oficial da avaliação
└── README.md                   # Documentação do projeto e roteiro de testes
```

---

## 4. Fonte de Dados e Atendimento aos Requisitos

Para garantir total estabilidade, ausência de limites de taxa (*rate limits*) e imunidade a indisponibilidades de APIs de terceiros na correção do professor, foram criadas **duas fontes desacopladas** de dados em conformidade estrita com o item **4** do enunciado:

1. **Fonte para Listagem (`data/jogos.json`):**  
   Retorna um array com 10 itens. Cada item possui: `id`, `titulo`, `categoria`, `resumo`, `imagem`, `ano` e `classificacao`.
2. **Fonte para Consulta de Detalhes (`data/detalhes/{id}.json`):**  
   Arquivos individuais contendo dados exclusivos não presentes na listagem original: `desenvolvedora`, `distribuidora`, `dataLancamento`, `notaMetacritic`, `plataformas`, `modosDeJogo`, `sinopseCompleta` e `requisitosSistema` (mínimos e recomendados para PC).

---

## 5. Como Iniciar o Servidor HTTP Local

> ⚠️ **IMPORTANTE:** Conforme indicado no enunciado, **não abra o arquivo HTML diretamente pelo protocolo `file:///`**, pois as políticas de segurança CORS dos navegadores modernos bloqueiam requisições `fetch()` para arquivos locais. É obrigatório executar um servidor HTTP local.

Escolha **qualquer um** dos métodos abaixo:

### Opção 1: Extensão Live Server (Visual Studio Code) — *Recomendado*
1. Abra a pasta `Prova1` no VS Code.
2. Certifique-se de ter a extensão **Live Server** (de Ritwick Dey) instalada.
3. Clique com o botão direito no arquivo `index.html` e selecione **"Open with Live Server"**.
4. O navegador abrirá automaticamente no endereço `http://127.0.0.1:5500/index.html`.

### Opção 2: Servidor Embutido do Python
Abra o terminal (PowerShell, CMD ou Bash) dentro da pasta `Prova1` e execute:
```bash
python -m http.server 8000
```
*(ou `py -m http.server 8000` no Windows)*  
Abra seu navegador e acesse: [http://localhost:8000](http://localhost:8000)

### Opção 3: Node.js (`npx serve` ou `http-server`)
Com o Node.js instalado, execute no terminal da pasta do projeto:
```bash
npx serve .
```
E acesse o endereço informado no terminal (ex.: `http://localhost:3000`).

---

## 6. Roteiro Passo a Passo de Testes para Avaliação

Abaixo está o roteiro sugerido para conferência de cada critério avaliado:

### 1. Teste da Listagem Dinâmica e Layout Responsivo
- Ao carregar a página através do servidor local, observe o indicador de carregamento (*spinner*) exibido brevemente.
- O catálogo carrega automaticamente **10 jogos** organizados na grade responsiva do Bootstrap.
- Redimensione a janela do navegador ou utilize as ferramentas de emulação de dispositivos móveis do DevTools (F12) para verificar a adaptação para telas de celular (`col-12`), tablets (`col-sm-6`), notebooks (`col-lg-4`) e desktops (`col-xl-3`), sem qualquer rolagem horizontal indesejada.

### 2. Teste da Consulta de Detalhes (2ª Requisição AJAX Obrigatória)
1. Pressione `F12` no navegador e vá para a aba **Rede (Network)**. Filtre por **Fetch/XHR**.
2. Clique no botão **"Ver Detalhes"** de qualquer jogo (ex: *Baldur's Gate 3*).
3. Observe que:
   - O **Modal do Bootstrap 5** abre imediatamente;
   - Um spinner de carregamento interno aparece no modal;
   - Uma **nova requisição HTTP individual** é disparada para `data/detalhes/9.json` (comprovando que os dados adicionais **não** estavam pré-carregados no HTML inicial);
   - A ficha técnica aprofundada é renderizada com a nota do Metacritic, desenvolvedora, plataformas, sinopse completa e requisitos de sistema;
   - Clique em **"Fechar"** ou no botão de fechar para dispensar o modal.

### 3. Teste da Busca em Tempo Real
- No campo de busca *"Pesquisar jogo"*, digite um termo existente (ex.: `Geralt`, `Anel`, `Zumbi` ou `Cyberpunk`).
- Observe que a listagem é filtrada instantaneamente sem recarregar a página, tanto por palavras presentes no título quanto no resumo.
- Clique no ícone de **"X"** ao lado do campo para limpar a busca.

### 4. Teste do Filtro por Categoria
- Clique nos botões de categoria localizados ao lado da busca (ex.: `RPG`, `Ação`, `Estratégia`, `Terror`).
- Observe que apenas os jogos pertencentes à categoria selecionada permanecem visíveis.
- Combine a busca textual com o filtro de categoria para testar a filtragem simultânea.

### 5. Teste do Estado Vazio (*Empty State*)
- Digite uma palavra inexistente no campo de busca (ex.: `xyz12345`).
- Observe que um alerta com mensagem amigável é exibido (*"Nenhum jogo encontrado"*).
- Clique no botão **"Limpar Filtros e Busca"** exibido dentro do alerta para restaurar todos os 10 jogos.

### 6. Teste do Estado de Erro e Nova Tentativa (*Retry State*)
Para comprovar o funcionamento do tratamento de falha na requisição assíncrona:
- **Método A (pelo DevTools):**
  1. Abra a aba **Rede (Network)** do DevTools (`F12`).
  2. Altere o menu de limitação de rede (*Throttling*) de "No throttling" para **"Offline"**.
  3. Recarregue a página com `Ctrl + F5`.
  4. Um aviso de erro em vermelho será exibido: *"Não foi possível carregar os jogos... Verifique se o servidor HTTP local está ativo"*, acompanhado do botão **"Tentar Novamente"**.
  5. No DevTools, volte a conexão para "No throttling" e clique no botão **"Tentar Novamente"**. O catálogo será carregado com sucesso.
- **Método B (pelo terminal/arquivos):**
  1. Renomeie temporariamente o arquivo `data/jogos.json` para `data/jogos_backup.json`.
  2. Recarregue a página e observe o alerta de erro com o botão de retry.
  3. Restaure o nome original do arquivo e clique em **"Tentar Novamente"**.

---

## 7. Instruções de Entrega

1. **Repositório GitHub:**  
   - Repositório público disponível em: [https://github.com/CaioFelipe/DW-Catalogo-Jogos-AJAX](https://github.com/CaioFelipe/DW-Catalogo-Jogos-AJAX)
   - Contém todos os arquivos, códigos comentados e dados JSON necessários à execução.
2. **Envio no SIGAA:**  
   - Submeta o link do repositório no portal SIGAA antes do encerramento do prazo em 05/10/2026.
