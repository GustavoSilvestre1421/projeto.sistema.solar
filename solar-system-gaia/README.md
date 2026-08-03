# Sistema Solar 3D — Projeto Gaia

Simulador tridimensional e educacional do Sistema Solar desenvolvido com JavaScript e Three.js.

## Estado atual — versão 1.0.2

O simulador original permanece disponível no Modo Exploração. O primeiro corte vertical do Modo Missão já inclui:

> Conteúdo científico revisado em 2 de agosto de 2026 com referências oficiais da NASA e da União Astronômica Internacional disponíveis em cada dossiê. Contagens de luas e outros dados sujeitos a novas descobertas incluem a data da revisão.

- escolha de modo;
- narrativa introdutória do Projeto Gaia;
- oito missões educativas, uma para cada planeta;
- identificação de planetas pelo raycasting existente;
- perguntas e feedback científico;
- XP, níveis e desbloqueio sequencial;
- curiosidades após cada missão;
- salvamento automático no navegador.
- criação e edição do perfil do comandante;
- quatro avatares de tripulação;
- briefing narrativo da Dra. Helena Vega;
- lançamento cinematográfico autorizado pelo jogador;
- scanner científico com três dados por destino;
- duas perguntas por missão, totalizando 16 perguntas na campanha;
- dossiê planetário com visão geral e três áreas de estudo;
- seção expansível Saiba mais;
- revisão do conteúdo durante as perguntas sem repetir a viagem;
- Diário de Bordo com perfil, XP, nível, progresso e precisão;
- arquivo permanente dos planetas investigados;
- acesso a dossiês e curiosidades concluídas;
- treinamento sem XP e repetição da viagem pelo Diário;
- três missões avançadas com comparação, múltiplos alvos e identificação por pistas;
- observações parciais salvas automaticamente;
- três missões avançadas completam a etapa de investigações planetárias;
- sete missões lunares: Lua, Europa, Io, Ganimedes, Titã, Encélado e Tritão;
- luas selecionáveis por mouse ou toque, com área de interação ampliada;
- campanha ampliada para 21 missões, 42 perguntas e 2.510 XP;
- perguntas em múltipla escolha, verdadeiro ou falso e ordenação científica;
- interface responsiva para celulares, tablets e orientação horizontal;
- aproximação e acompanhamento do planeta hospedeiro durante missões lunares;
- áudio procedural opcional, volume persistente e contagem regressiva de lançamento;
- alto contraste e redução de movimento salvos no navegador;
- Centro de Análise unificando scanner, evidências e dossiê em uma única tela;
- tutorial inicial opcional em português, inglês e espanhol, com instruções para computador e celular;
- tutorial persistente e reaberto a qualquer momento pelo menu de modos;
- Desafio do Dia desbloqueado após as 21 missões;
- três questões científicas diárias com apenas uma tentativa por questão;
- sequência de dias, melhor sequência, dias jogados e resultados perfeitos;
- desafios isolados do XP, das estrelas e da precisão oficial;
- Expedição Científica ilimitada com dez questões por rodada;
- três cargas de energia, pontuação crescente por combo e encerramento por falha;
- recordes de pontos, acertos e sequência máxima salvos no navegador;
- retomada da expedição em andamento após fechar ou recarregar;
- perfil renderizado exclusivamente por nós DOM, sem interpolação do nome em HTML;
- salvamento protegido contra indisponibilidade e limite do armazenamento local;
- aviso visível e traduzido quando o navegador recusa uma gravação;
- traduções do simulador e geração procedural de texturas separadas do motor principal;
- `main.js` reduzido de 1.578 para 1.340 linhas neste primeiro corte de refatoração;
- namespace SVG explícito preservando os desenhos completos dos quatro avatares;
- câmera das missões lunares presa ao planeta hospedeiro, com rotação e zoom liberados;
- deslocamento lateral bloqueado durante a precisão para manter o sistema planetário centralizado;
- botão do dossiê muda para “Voltar à pergunta” durante revisões;
- contexto da revisão preservado ao trocar o idioma com o dossiê aberto;
- navegação por teclado e gerenciamento de foco nos modais;
- preferência de idioma do simulador preservada após recarregar;
- modo de observação precisa para congelar e selecionar luas com facilidade;
- primeira passagem de direção de arte do espaço, corpos celestes e interface;
- texturas procedurais próprias para planetas, Sol, anéis e luas;
- abertura cinematográfica conectada ao carregamento real do simulador;
- sistema vetorial próprio para tripulação, foguete e ícones de interface;
- texturas compartilhadas entre corpos 3D e planetas mostrados durante a viagem;
- microinterações, feedback de XP e progresso visual da campanha;
- primeira etapa de internacionalização da interface do Modo Missão;
- primeiro lote científico traduzido integralmente para inglês e espanhol;
- reinício voluntário da campanha após a conclusão, preservando o perfil.
- camada única de armazenamento seguro para progresso, perfil, idioma, áudio, acessibilidade e preferências;
- falhas do armazenamento não interrompem as interações que podem continuar sem persistência;
- exclusão completa dos nove registros do Projeto Gaia com confirmação explícita;
- limpeza dos nós Web Audio ao silenciar, ocultar a aba e finalizar efeitos;
- aplicativo instalável com manifesto, ícones próprios e identidade visual de compartilhamento;
- motor Three.js incluído localmente e cache offline dos recursos essenciais.
- tradução integral dos textos estáticos e das mensagens dinâmicas do fluxo principal em português, inglês e espanhol;
- nomes dos corpos, níveis, avatares, mensagens de câmera e rótulos de acessibilidade acompanham o idioma selecionado;
- retomada granular da missão durante exploração, preparação de lançamento, análise e perguntas;
- etapa e pergunta pendentes permanecem salvas sem repetir XP, briefing ou viagem;
- evidências repetidas não duplicam progresso nem recompensas;
- controles de ordenação preservam corretamente os limites após uma tentativa incorreta.

## Estrutura

```text
solar-system-gaia/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── data/
│   │   └── missions.json
│   ├── icons/
│   ├── images/
│   ├── vendor/
│   └── js/
│       ├── core/
│       ├── effects/
│       ├── missions/
│       ├── persistence/
│       ├── player/
│       ├── profile/
│       ├── ui/
│       ├── MissionApp.js
│       └── main.js
├── docs/
├── pages/
├── CHANGELOG.md
├── .gitignore
└── README.md
```

- `index.html`: estrutura da página principal.
- `assets/css`: estilos visuais.
- `assets/js`: código JavaScript do simulador.
- `assets/data`: futuros arquivos JSON, incluindo missões e traduções.
- `assets/images`: imagens locais futuras.
- `pages`: páginas HTML adicionais, caso sejam necessárias.
- `docs`: decisões arquiteturais e documentação técnica.

## Executar localmente

Por utilizar módulos ES, abra o projeto por meio de um servidor local. No terminal, dentro da pasta do projeto, execute:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

Também é possível utilizar a extensão Live Server do Visual Studio Code.

## Publicação no GitHub

O `index.html` permanece na raiz para funcionar diretamente com o GitHub Pages.

## Regras atuais de progressão

- missões planetárias 1–8: `100 XP` cada;
- missões avançadas 9–11: `140 XP` cada;
- missões lunares 12–18: `120 XP` cada;
- missões bônus 19–21: `150 XP` cada;
- campanha completa: `2.510 XP`;
- três estrelas: nenhuma resposta errada;
- duas estrelas: até dois erros na missão;
- uma estrela: três ou mais erros na missão;
- recompensas já recebidas não podem ser coletadas novamente.

## Dados salvos no navegador

Os nove registros do projeto utilizam uma camada segura sobre o `localStorage`. Perfil, campanha, desafios, expedição e preferências permanecem separados. Se o navegador bloquear ou lotar o armazenamento, o jogo apresenta um aviso e mantém a interação ativa sempre que possível.

O menu de modos oferece **Apagar meus dados**, que remove apenas registros com chaves conhecidas do Projeto Gaia. Dados de outros projetos no mesmo servidor não são afetados.

## Instalação e modo offline

Depois do primeiro carregamento completo por HTTP ou HTTPS, o navegador pode instalar o Projeto Gaia e reutilizar os recursos essenciais sem conexão. O Three.js está incluído no pacote, portanto o simulador não depende de um CDN para iniciar.

No Chrome ou Edge, use a opção **Instalar aplicativo** exibida na barra de endereço ou no menu do navegador. O modo offline deve ser testado somente depois de uma primeira visita online.

## Próxima etapa

Publicar a versão `1.0` em hospedagem HTTPS para que estudantes possam acessá-la diretamente pelo navegador de computadores e celulares, sem utilizar VS Code ou executar comandos locais.
