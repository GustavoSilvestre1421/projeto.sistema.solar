# Histórico de versões

## v1.0.2

- removido o campo `xp` dos 21 registros de missão para eliminar uma fonte de dados duplicada e enganosa;
- `Mission.progressionXP` passa a ser explicitamente a única fonte das recompensas por categoria;
- a regressão agora impede que o campo de XP volte aos arquivos de conteúdo;
- o Navegador Celeste avisa, em três idiomas e por região acessível, quando reativa planetas anões, Halley ou luas;
- gestos de pinça no canvas deixam de terminar como uma seleção acidental;
- alturas estruturais utilizam `100dvh`, preservando `100vh` como fallback;
- cache atualizado para `projeto-gaia-v1.0.2`.

## v1.0.1

- corrigida a sobreposição entre o botão de modo e o Navegador Celeste no Modo Exploração;
- modo, navegador e seletor de idioma agora pertencem ao mesmo agrupamento responsivo;
- preservado o reposicionamento conjunto dos controles no Modo Missão;
- cache atualizado para `projeto-gaia-v1.0.1`.

## v1.0 — primeiro lançamento oficial

- base funcional da v0.27 homologada como primeiro lançamento estável;
- removida a identificação de versão candidata da abertura e das traduções;
- versão do aplicativo alinhada em HTML, JavaScript, manifesto e documentação;
- cache offline promovido para `projeto-gaia-v1.0`;
- preservadas as 21 missões, 42 perguntas, 2.510 XP e 63 estrelas;
- mantida compatibilidade com perfis, progresso e preferências das versões anteriores;
- projeto preparado para a próxima etapa de publicação na web.

## v0.27

- adicionado Navegador Celeste acessível por teclado, toque e leitores de tela;
- corpos celestes passam a poder ser selecionados sem depender do clique no ambiente 3D;
- seleção acessível integra exploração, acompanhamento da câmera e objetivos de missão;
- foco de teclado ganhou destaque visível de alto contraste;
- saves com coleções ou mapas estruturalmente corrompidos são recuperados com segurança;
- a tela de sucesso da missão volta corretamente após recarregar antes de avançar;
- adicionados perfis gráficos Automático, Alto, Médio e Leve;
- celulares e dispositivos limitados reduzem automaticamente resolução, sombras e asteroides;
- preferência gráfica passa a ser salva e incluída em `Apagar meus dados`;
- criada suíte permanente de regressão para campanha, fontes, save e retomada;
- cache atualizado para `projeto-gaia-v0.27`.

## v0.26

- realizada auditoria científica das 21 missões e 42 perguntas com fontes oficiais da NASA e da IAU;
- cada dossiê agora apresenta fontes verificáveis e a data da revisão científica;
- Júpiter atualizado de 95 para 101 luas oficialmente reconhecidas em março de 2026;
- dados de Vênus harmonizados com a NASA: aproximadamente 467 °C e pressão superficial 93 vezes a terrestre;
- temperatura média de Marte ajustada para aproximadamente −65 °C;
- painel corrigido de `Diâmetro Equatorial` para `Diâmetro médio`, de acordo com os valores apresentados;
- descrição dimensional de Ganimedes reescrita para eliminar uma classificação ambígua;
- validação impede o carregamento de missões sem fontes científicas HTTPS;
- cache atualizado para `projeto-gaia-v0.26`.

## v0.25

- corrigidos os controles em espanhol que podiam reaparecer em inglês (`Mover`, `Vista Norte` e `Velocidade`);
- a validação de atualização agora inclui o dicionário do simulador, além dos textos do Modo Missão;
- cópias antigas das traduções são detectadas e substituídas automaticamente;
- desativada a tradução automática externa da página para evitar interfaces com idiomas misturados;
- adicionados controles independentes para exibir ou ocultar Ceres e Plutão;
- adicionado controle independente para exibir ou ocultar o Cometa Halley;
- objetos ocultos também deixam de mostrar órbitas, nomes, caudas e áreas de seleção;
- corpos opcionais continuam disponíveis automaticamente no Modo Missão;
- cache atualizado para `projeto-gaia-v0.25`.

## v0.24.1

- corrigida a mistura entre o HTML novo e módulos antigos preservados pelo cache offline;
- entrada principal passa a utilizar uma identificação de build explícita;
- o aplicativo detecta automaticamente pacotes de tradução incompatíveis, limpa somente os caches do Projeto Gaia e recarrega os arquivos corretos;
- atualizações do Service Worker ignoram o cache HTTP e recarregam a interface quando o novo controlador assume;
- recursos online passam a usar rede primeiro, mantendo o cache como retorno offline;
- corrigida a exibição literal de chaves como `modeTitle`, `analysisEyebrow`, `profileEyebrow` e `prepareLaunch`;
- cache atualizado para `projeto-gaia-v0.24.1`.

## v0.24 — continuidade e internacionalização

- ampliada a internacionalização para textos estáticos, perfil, níveis, Diário, câmera, foguete, feedback e mensagens de sistema;
- nomes de corpos celestes e níveis passam a acompanhar o idioma selecionado;
- placeholders, títulos e rótulos acessíveis agora são traduzidos junto com a interface visível;
- corrigidas traduções e acentuação remanescentes do simulador em espanhol;
- adicionada persistência granular das etapas `exploring`, `launch-ready`, `analysis-ready`, `questions` e `completed`;
- recarregar durante uma missão retoma a exploração, o lançamento, o dossiê ou a pergunta correta;
- saves anteriores são migrados sem sobrescrever etapas novas já registradas;
- alvos já observados geram aviso próprio e não duplicam XP ou contagem de evidências;
- botões de ordenação preservam seu estado correto após o intervalo de nova tentativa;
- barra de campanha e controles globais receberam rótulos adicionais para tecnologias assistivas;
- cache offline atualizado para `projeto-gaia-v0.24`.

## v0.23.1

- corrigida a clonagem tardia de respostas no Service Worker;
- respostas agora são clonadas antes de qualquer espera assíncrona do cache;
- gravação no cache é aguardada sem impedir o carregamento quando o armazenamento offline falha;
- navegação e recursos estáticos reutilizam a mesma rotina segura de rede e cache;
- cache atualizado para `projeto-gaia-v0.23.1`, forçando a substituição do worker anterior.

## v0.23 — candidata à versão final

- criada uma camada central de armazenamento seguro para todas as operações do Projeto Gaia;
- acessibilidade, perfil, áudio, introdução, tutorial, idioma, campanha, desafio diário e expedição deixam de acessar o `localStorage` diretamente;
- erros de leitura, serialização, gravação e remoção são capturados e comunicados sem derrubar a interface;
- alterações de idioma, áudio e acessibilidade continuam funcionando na sessão mesmo quando não podem ser persistidas;
- perfil informa claramente quando o navegador recusa a gravação;
- adicionada a ação **Apagar meus dados**, protegida por uma segunda tela de confirmação;
- exclusão remove somente as nove chaves conhecidas do Projeto Gaia e preserva dados alheios;
- efeitos sonoros desconectam oscilador e envelope após o término;
- ambiente sonoro é interrompido e desconectado ao silenciar ou ocultar a página;
- contexto de áudio é suspenso em segundo plano e retomado com segurança;
- adicionado manifesto de aplicativo web com nome, cores, ícones e captura promocional;
- adicionados ícones próprios de 192 e 512 pixels;
- substituída a fotografia genérica de compartilhamento por arte original do Projeto Gaia;
- Three.js e OrbitControls passam a acompanhar localmente o pacote;
- adicionado Service Worker com cache versionado de 41 recursos essenciais;
- navegação usa estratégia de rede com retorno offline e recursos estáticos usam cache local;
- caches antigos do Projeto Gaia são removidos durante a ativação;
- validada a sintaxe de todos os módulos, o manifesto, os recursos offline, o servidor local, o armazenamento bloqueado e a limpeza de áudio.

## v0.22.4

- corrigido o rótulo do botão ao rever o dossiê durante uma pergunta;
- botão passa de “Rever dossiê” para “Voltar à pergunta” dentro da revisão;
- novos rótulos adicionados em português, inglês e espanhol;
- ação continua retornando exatamente à questão pendente;
- contexto do dossiê agora é preservado ao alterar o idioma;
- consulta inicial continua exibindo “Ir para as perguntas”;
- consulta pelo Diário continua retornando ao Diário de Bordo.

## v0.22.3

- câmera das missões lunares continua acompanhando o planeta hospedeiro;
- rotação ao redor do planeta passa a funcionar durante o modo de precisão;
- zoom por roda do mouse ou gesto de pinça permanece disponível;
- deslocamento lateral é bloqueado temporariamente para o planeta não escapar do centro;
- iniciar um gesto de câmera não cancela mais o acompanhamento durante missões lunares;
- movimento orbital continua congelado enquanto a lua é procurada;
- controles normais são restaurados ao sair do modo de precisão;
- mensagens da missão agora orientam o jogador a girar a câmera e usar o zoom;
- comportamento beneficia mouse, toque e telas pequenas.

## v0.22.2

- corrigido o desaparecimento dos desenhos dos avatares introduzido na v0.22.1;
- raiz dos avatares passa a declarar explicitamente o namespace SVG;
- círculos, caminhos, uniforme e visor voltam a ser reconhecidos pelo navegador;
- letras A, C, E e G permanecem apenas como insígnias no uniforme;
- os quatro avatares foram verificados quanto a namespace e elementos gráficos;
- correção mantém o nome do comandante inserido exclusivamente por `textContent`;
- `ProfileUI` continua sem utilizar `innerHTML`.

## v0.22.1

- removida a interpolação do nome do comandante em `innerHTML` no menu de modos;
- `ProfileUI` deixa de usar `innerHTML`, inclusive ao montar opções e retratos de avatar;
- nome do perfil agora é inserido somente por `textContent`;
- `SaveManager.save()` passa a proteger serialização e gravação com `try/catch`;
- gravações bem-sucedidas retornam `true` e falhas retornam `false`;
- falhas emitem o evento `save:error` com o erro original;
- interface apresenta aviso traduzido quando o armazenamento do navegador recusa o progresso;
- falha de cota foi simulada e validada sem interromper o jogo;
- dicionários do simulador foram extraídos para `SimulatorTranslations.js`;
- geração procedural de superfícies foi extraída para `CelestialTextureFactory.js`;
- chamadas de texturas de planetas e luas foram adaptadas ao novo módulo;
- `main.js` foi reduzido de 1.578 para 1.340 linhas, aproximadamente 15%;
- campanha e modos pós-campanha permanecem funcionalmente compatíveis.

## v0.22

- nova Expedição Científica liberada após concluir a campanha;
- cada rodada reúne dez questões sem repetição interna;
- jogador inicia com três cargas de energia e perde uma a cada erro;
- expedição termina após dez respostas ou quando a energia chega a zero;
- acertos consecutivos formam combos e aumentam progressivamente a pontuação;
- pontuação começa em 100 e recebe mais 25 pontos a cada nível de combo;
- HUD próprio mostra questão, energia, pontos e sequência atual;
- explicação revela resposta esperada e registro científico após cada tentativa;
- sessões em andamento são recuperadas após fechar ou recarregar a página;
- recordes de pontos, acertos, combo e total de expedições são persistidos;
- múltipla escolha, verdadeiro ou falso e ordenação são compatíveis;
- interface completa disponível em português, inglês e espanhol;
- acesso pelo menu de modos e pela conclusão da campanha;
- expedições não alteram XP, estrelas ou precisão oficial;
- tutorial passa a apresentar as duas atividades pós-campanha.

## v0.21

- novo Desafio do Dia desbloqueado após concluir as 21 missões;
- cada transmissão diária seleciona três questões do banco científico completo;
- seleção de perguntas e ordem das alternativas permanecem estáveis durante o mesmo dia;
- cada pergunta permite apenas uma tentativa, evitando respostas por eliminação repetida;
- feedback revela a resposta esperada e recupera a curiosidade científica relacionada;
- desafios aceitam múltipla escolha, verdadeiro ou falso e ordenação;
- progresso é salvo depois de cada resposta e não pode ser repetido ao recarregar;
- painel registra dias jogados, dias perfeitos, sequência atual e melhor sequência;
- atividade disponível em português, inglês e espanhol;
- o desafio não altera XP, estrelas, precisão nem progresso da campanha;
- acesso disponível no menu de modos e na conclusão da campanha;
- campanha oficial permanece com 21 missões, 42 perguntas, 2.510 XP e 63 estrelas.

## v0.20

- Scanner Científico e Dossiê foram fundidos no novo Centro de Análise;
- lançamento passa diretamente para uma tela única de evidências e conteúdo científico;
- perguntas são liberadas somente após a conclusão do processamento dos sensores;
- revisões pelo questionário e pelo Diário mostram os dados imediatamente, sem repetir a animação;
- tutorial inicial de cinco etapas explica modos, câmera, seleção, missões e progresso;
- instruções específicas foram incluídas para mouse, toque e gesto de pinça;
- tutorial disponível em português, inglês e espanhol;
- conclusão do tutorial é salva separadamente do perfil e da campanha;
- tutorial pode ser ignorado, controlado pelo teclado e reaberto pelo menu;
- campanha permanece com 21 missões, 42 perguntas, 2.510 XP e máximo de 63 estrelas.

## v0.19

- campanha ampliada de 18 para 21 missões;
- adicionadas investigações bônus sobre Ceres, Plutão e o Cometa Halley;
- campanha passa de 36 para 42 perguntas e totaliza 2.510 XP;
- novo capítulo Arquivo Bônus é desbloqueado após Tritão;
- novo nível final Pioneiro das Fronteiras exige 2.450 XP;
- Ceres foi adicionado como corpo selecionável no cinturão de asteroides;
- Plutão foi adicionado além da órbita de Netuno;
- Cometa Halley recebeu órbita alongada, inclinada e retrógrada;
- cauda translúcida do cometa aponta dinamicamente para longe do Sol;
- novos corpos participam do raycasting, foco de câmera, etiquetas, órbitas e painel informativo;
- alvos possuem áreas de toque ampliadas para celulares;
- scanners, dossiês, Saiba mais, curiosidades e perguntas foram adicionados nos três idiomas;
- saves com 18 missões concluídas começam diretamente na missão de Ceres;
- campanha perfeita passa a oferecer no máximo 63 estrelas;
- marcos de capítulo passam a ocorrer nas missões 8, 11, 15, 18 e 21.

## v0.18

- motor de perguntas passa a aceitar tipos definidos por dados;
- 30 questões permanecem em múltipla escolha;
- quatro questões foram convertidas para verdadeiro ou falso;
- duas questões foram convertidas para ordenação científica;
- desafios de ordenação utilizam controles para mover itens para cima e para baixo;
- controles funcionam com mouse, toque e teclado;
- ordem escolhida é salva após cada movimento;
- treinamento também suporta verdadeiro ou falso e ordenação;
- novos conteúdos foram localizados em português, inglês e espanhol;
- migração invalida automaticamente ordens antigas com quantidade incompatível de itens;
- respostas, dicas progressivas, estrelas e precisão funcionam nos três formatos;
- campanha permanece com 36 perguntas, 2.060 XP e máximo de 54 estrelas;
- arquitetura permite adicionar novos tipos sem alterar as regras de progressão.

## v0.17

- progressão passa a considerar três categorias de dificuldade;
- missões planetárias continuam valendo 100 XP;
- missões avançadas passam a valer 140 XP;
- missões lunares passam a valer 120 XP;
- campanha completa passa a totalizar 2.060 XP;
- último nível passa a exigir 2.000 XP;
- cada missão concluída recebe avaliação de uma a três estrelas conforme as tentativas;
- HUD apresenta capítulo atual e progresso dentro do capítulo;
- Diário mostra estrelas totais e avaliação individual de cada missão;
- marcos aparecem ao concluir as missões 8, 11, 15 e 18;
- campanha foi organizada em Atlas Planetário, Análise Avançada, Luas da Terra e de Júpiter e Fronteiras Exteriores;
- nomes dos capítulos e rótulos de estrelas foram localizados em português, inglês e espanhol;
- saves da v0.16 têm XP recalculado automaticamente pelos tokens de recompensa;
- missões antigas sem tentativas granulares recebem estrelas de compatibilidade;
- formato interno do save foi ampliado para a versão 3 sem alterar a chave de armazenamento.

## v0.16

- alternativas das 36 perguntas passam a ser embaralhadas na campanha e no treinamento;
- cada botão conserva o índice científico original, mantendo os gabaritos corretos nos três idiomas;
- ordem criada para cada pergunta é salva e permanece estável após recarregar a página;
- respostas erradas aplicam uma pausa curta antes da nova tentativa;
- primeiro erro apresenta uma pista obtida pelo scanner;
- segundo erro apresenta uma evidência contextual do dossiê;
- erros seguintes recomendam a revisão completa do conteúdo;
- feedback identifica a alternativa escolhida e explica que ela não corresponde às evidências;
- índice da pergunta atual, tentativas e início do questionário passam a integrar o save;
- campanha é retomada exatamente na pergunta pendente;
- recarregar antes do questionário não pula lançamento, scanner ou dossiê;
- saves antigos inferem perguntas já premiadas pelos tokens de XP e evitam recompensas duplicadas;
- formato interno do save foi ampliado para a versão 2 sem trocar a chave de armazenamento;
- XP, níveis, conteúdo, progresso oficial e compatibilidade de perfil permanecem inalterados.

## v0.15.3

- missões 13 a 18 traduzidas integralmente para inglês e espanhol;
- lote lunar cobre Europa, Io, Ganimedes, Titã, Encélado e Tritão;
- traduzidos briefings, objetivos, scanners, dossiês, Saiba mais, perguntas, alternativas e curiosidades;
- campanha completa passa a oferecer 18 missões e 36 perguntas em português, inglês e espanhol;
- Diário de Bordo e treinamento conseguem consultar todo o arquivo científico no idioma selecionado;
- aviso de conteúdo temporariamente em português foi removido por não haver mais missões pendentes;
- mecanismo interno de fallback foi preservado para tolerar futuros pacotes incompletos;
- identificação das luas, gabaritos, XP, progresso e saves permanecem inalterados.

## v0.15.2

- missões 7 a 12 traduzidas integralmente para inglês e espanhol;
- lote cobre Urano, Netuno, a comparação Mercúrio × Vênus, a análise Terra × Júpiter × Netuno, o planeta oculto e a Lua;
- briefings, objetivos, scanners, dossiês, Saiba mais, perguntas, alternativas e curiosidades foram localizados;
- missões comparativas preservam múltiplos alvos e progresso parcial;
- a missão confidencial continua ocultando a identidade do planeta até a descoberta;
- primeira missão da campanha lunar passa a acompanhar o idioma selecionado;
- campanha chega a 12 missões e 24 perguntas traduzidas por idioma;
- missões 13 a 18 continuam usando o conteúdo original em português como fallback;
- índices dos gabaritos, XP, progresso e compatibilidade dos saves permanecem inalterados.

## v0.15.1

- criada arquitetura de pacotes científicos externos por idioma;
- missões 1 a 6 traduzidas integralmente para inglês e espanhol;
- traduzidos briefings, objetivos, scanners, dossiês, Saiba mais, perguntas, alternativas e curiosidades;
- lote cobre Terra, Marte, Júpiter, Vênus, Mercúrio e Saturno;
- troca de idioma durante briefing, dossiê ou pergunta preserva o estado atual;
- Diário e treinamento também passam a usar o conteúdo localizado;
- ausência de pacote utiliza português como fallback sem impedir a campanha;
- aviso de conteúdo aparece somente nas missões que ainda não foram traduzidas;
- índices de respostas e regras de XP continuam compartilhados entre os idiomas.

## v0.15

- criada arquitetura central de idiomas para o Modo Missão;
- português, inglês e espanhol passam a atualizar os principais controles da interface;
- traduzidos seleção de modos, Diário, lançamento, análise, acessibilidade, som e conclusão;
- seletor de idioma permanece disponível durante as missões;
- idioma do documento é atualizado para tecnologias assistivas;
- componentes dinâmicos recebem notificação quando o idioma muda;
- aviso transparente informa que o conteúdo científico ainda está em português;
- preparada a v0.15.1 para traduzir briefings, dossiês e perguntas;
- campanha, XP e saves permanecem inalterados.

## v0.14

- adicionada barra visual de progresso da campanha no HUD;
- recompensas de descoberta e respostas aparecem como animações de XP;
- alternativa incorreta recebe resposta visual localizada;
- conclusão de missão produz pulso luminoso no painel;
- modais ganharam entrada suave com profundidade e desfoque;
- cartões do Diário de Bordo surgem em sequência;
- botões receberam resposta tátil visual ao clique;
- efeitos foram reposicionados para celulares;
- preferência Reduzir animações neutraliza automaticamente as microinterações;
- valores de XP, níveis, perguntas e regras permanecem inalterados.

## v0.13.1

- animação de viagem passou a reutilizar as texturas procedurais do simulador;
- destinos não aparecem mais apenas como círculos de cor básica;
- planetas e luas mantêm a mesma identidade visual entre exploração e lançamento;
- Saturno recebe representação própria de seus anéis durante a chegada;
- textura do destino apresenta rotação visual discreta;
- movimento reduzido desativa automaticamente essa rotação;
- fallback de cor continua disponível caso uma superfície não seja gerada.

## v0.13

- emojis principais substituídos por ilustrações vetoriais próprias;
- quatro avatares de tripulação redesenhados com cores e emblemas distintos;
- perfis existentes recebem automaticamente os novos avatares sem alterar o save;
- Dra. Helena Vega ganhou retrato vetorial exclusivo;
- foguete do Projeto Gaia redesenhado para autorização e sequência de lançamento;
- Diário de Bordo recebeu ícone vetorial consistente;
- controles de som receberam estados vetoriais ligado e desligado;
- SVGs permanecem nítidos em telas pequenas e de alta resolução;
- elementos possuem rótulos acessíveis e respeitam alto contraste;
- nenhuma dependência ou imagem externa foi adicionada.

## v0.12

- criada tela cinematográfica de inicialização do Projeto Gaia;
- identidade tipográfica e símbolo orbital próprios;
- barra acompanha etapas reais do carregamento tridimensional e educacional;
- mensagens informam renderização, estrelas, planetas, luas e arquivos científicos;
- botão Entrar no sistema aparece somente quando o projeto está pronto;
- preferência permite pular automaticamente a abertura nas próximas visitas;
- movimento reduzido encurta e remove animações da introdução;
- falha isolada no Modo Missão não impede o acesso ao simulador livre;
- abertura adaptada para celulares e orientação horizontal;
- nenhuma missão, resposta, recompensa ou save foi alterado.

## v0.11.2

- corrigida a interrupção `Cannot read properties of undefined (reading 'r')`;
- causa identificada nas bandas procedurais dos anéis de Saturno;
- índice de cor agora é limitado ao intervalo válido entre 0 e 3;
- adicionada cor de segurança caso um vértice produza valor inesperado;
- texturas dos planetas e luas permanecem habilitadas;
- nenhuma alteração foi feita na campanha ou nos saves.

## v0.11.1

- isolada a geração de cada textura procedural para impedir que uma falha apague toda a cena;
- material básico do corpo celeste é usado automaticamente como fallback;
- aviso de interrupção agora apresenta a mensagem técnica real para facilitar diagnóstico;
- texturas compatíveis continuam sendo aplicadas normalmente;
- campanha, saves e progressão permanecem inalterados.

## v0.11

- criadas texturas procedurais determinísticas para todos os planetas e luas exibidos;
- Mercúrio ganhou superfície rochosa e crateras;
- Vênus ganhou camadas de nuvens amareladas;
- Terra recebeu oceanos, continentes, calotas polares e nuvens;
- Marte recebeu relevo manchado e calotas polares;
- Júpiter ganhou faixas atmosféricas e Grande Mancha Vermelha;
- Saturno ganhou faixas e anéis divididos em diferentes bandas;
- Urano e Netuno receberam atmosferas e tempestades visualmente distintas;
- Io, Europa, Encélado e Titã receberam identidades específicas;
- luas rochosas passaram a apresentar crateras e variações de terreno;
- Sol ganhou granulação superficial e pulsação luminosa discreta;
- texturas são geradas localmente uma única vez, sem downloads externos;
- redução de movimento também desativa a pulsação do Sol;
- nenhuma regra educacional ou de progressão foi alterada.

## v0.10

- primeira passagem completa de direção de arte, ainda sem marcar o projeto como versão final;
- fundo espacial aprofundado com 4.200 estrelas de cores e intensidades variadas;
- adicionadas nebulosas procedurais sutis sem imagens externas;
- Sol recebeu coroa luminosa com mistura aditiva;
- sete planetas receberam camadas atmosféricas discretas;
- renderizador atualizado com espaço de cor sRGB e tone mapping cinematográfico;
- névoa espacial exponencial adicionada para reforçar profundidade;
- densidade de pixels limitada a 2 para proteger o desempenho em celulares de alta resolução;
- HUD, modais, cartões, botões e rótulos receberam identidade visual unificada;
- nenhuma regra de missão, pergunta, XP ou save foi alterada.

## v0.9.2

- criado o Modo de Observação Precisa para missões lunares;
- movimento orbital é congelado automaticamente ao aproximar do planeta hospedeiro;
- controles de arrasto da câmera são bloqueados durante a seleção;
- nome da lua procurada recebe destaque maior e área de toque de 44 px;
- tocar no rótulo da lua também realiza sua seleção;
- movimento e câmera são liberados ao encontrar a lua ou voltar à visão geral;
- estado anterior da animação é restaurado sem iniciar um sistema que já estava pausado;
- sair do Modo Missão também encerra o modo de precisão com segurança.

## v0.9.1

- adicionadas preferências persistentes de redução de movimento e alto contraste;
- foco do teclado passa automaticamente para cada modal aberto;
- tecla Tab permanece contida na janela ativa;
- foco retorna ao controle anterior quando uma janela fecha;
- estilos de foco visível foram reforçados em todos os botões e campos;
- animação de lançamento respeita a preferência interna de movimento reduzido;
- preferência de idioma do simulador agora permanece salva após recarregar;
- controles de acessibilidade adaptados para telas estreitas.

## v0.9

- criado sistema de áudio procedural sem arquivos externos;
- adicionada música ambiente espacial opcional;
- efeitos sonoros para comunicação, contagem regressiva, decolagem, scanner, acerto, erro e conclusão;
- sons de feedback também funcionam no treinamento do Diário;
- botão para ativar ou silenciar o áudio no HUD;
- controle de volume integrado ao HUD;
- preferências de áudio persistidas separadamente do perfil e do progresso;
- reprodução iniciada somente após interação permitida pelo navegador;
- lançamento agora apresenta contagem regressiva 3, 2, 1 e LANÇAR;
- interface de áudio adaptada para celular e orientação horizontal.

## v0.8.1

- adicionado botão contextual para aproximar a câmera do planeta hospedeiro nas missões lunares;
- tocar diretamente em Terra, Júpiter, Saturno ou Netuno durante a missão de sua lua inicia o acompanhamento, sem registrar erro;
- câmera passa a seguir o planeta usando o sistema já existente no Modo Exploração;
- luas e rótulos são ativados automaticamente durante a aproximação;
- botão permite retornar à visão geral do Sistema Solar;
- melhoria pensada especialmente para facilitar a seleção das luas em celulares.

## v0.8

- adicionadas sete missões lunares para Lua, Europa, Io, Ganimedes, Titã, Encélado e Tritão;
- campanha ampliada para 18 missões e 36 perguntas;
- progressão final ampliada para 1.800 XP e nível Explorador do Sistema Solar;
- luas integradas ao raycasting do simulador;
- áreas invisíveis de seleção ampliam a precisão no mouse e em telas de toque;
- coordenadas de toque calculadas no momento da seleção;
- painel informativo tornou-se tolerante a dados incompletos das luas;
- HUD, modais, perguntas, dossiês, Diário, perfil e lançamento adaptados para celular;
- suporte a áreas seguras, orientação horizontal e botões com tamanho mínimo para toque;
- saves da v0.7 permanecem compatíveis e continuam a campanha a partir da missão 12.

## v0.7

- arquitetura generalizada para missões com um ou vários corpos-alvo;
- observações parciais persistidas no save;
- nova missão comparativa entre Mercúrio e Vênus;
- nova missão orbital envolvendo Terra, Júpiter e Netuno;
- nova missão misteriosa baseada em identificação por evidências;
- campanha ampliada para 11 missões e 22 perguntas;
- dossiês comparativos e conteúdo científico específico para os novos desafios;
- Diário de Bordo adaptado aos nomes comparativos e ao alvo confidencial;
- progressão final de 1.100 XP e nível Comandante.

## v0.6

- criado o Diário de Bordo do comandante;
- adicionados indicadores de XP, nível, missões concluídas, tentativas e precisão;
- cartões de planeta com estados concluído, atual e bloqueado;
- dossiês concluídos podem ser consultados sem reiniciar a campanha;
- curiosidades científicas permanecem arquivadas;
- lançamentos concluídos podem ser assistidos novamente;
- modo de treinamento permite repetir perguntas sem conceder XP;
- tentativas de treinamento não alteram as estatísticas oficiais;
- saves anteriores permanecem compatíveis com os novos contadores.

## v0.5

- criado o Dossiê Planetário para os oito destinos;
- cada dossiê contém visão geral, ambiente, características físicas e exploração científica;
- seção expansível Saiba mais com conteúdo aprofundado;
- botão Rever dossiê disponível durante as perguntas;
- retorno à mesma pergunta sem repetir briefing, lançamento ou scanner;
- feedback de erro orienta explicitamente a revisão do conteúdo;
- correção da referência à pergunta final durante a conclusão da missão.

## v0.4

- briefing narrativo apresentado pela Dra. Helena Vega;
- sequência de lançamento iniciada voluntariamente pelo jogador;
- animação cinematográfica de 3,2 segundos com destino planetário;
- scanner científico com três observações em cada missão;
- duas perguntas por missão, totalizando 16 na campanha;
- 80 XP educacionais divididos igualmente entre as perguntas;
- estrutura preparada para bancos maiores de perguntas;
- animação rápida anterior substituída pela viagem contextual.

## v0.3.1

- adicionada a opção de reiniciar a campanha após concluir todas as missões;
- confirmação antes de apagar XP e progresso;
- nome e avatar são preservados durante o reinício;
- a primeira missão é reaberta imediatamente, permitindo testar novamente o foguete e as perguntas.

## v0.3

- cadastro do nome do comandante;
- seleção entre quatro avatares de tripulação;
- edição posterior do perfil pelo HUD e pela seleção de modos;
- perfil salvo separadamente do progresso educacional;
- animação de foguete ao selecionar qualquer corpo celeste;
- pergunta da missão sincronizada com a chegada do foguete;
- respeito à preferência de acessibilidade por movimento reduzido.

## v0.2

- campanha ampliada de três para oito missões;
- todos os planetas passaram a integrar o ciclo educacional;
- novos conceitos: efeito estufa, período orbital, anéis, inclinação axial e dinâmica atmosférica;
- tela de conclusão agora calcula quantidade de missões, XP e nível dinamicamente;
- documentação atualizada.

## v0.1

- primeiro corte vertical do Modo Missão;
- escolha entre Exploração e Missão;
- missões da Terra, de Marte e de Júpiter;
- XP, níveis, perguntas, curiosidades e progresso sequencial;
- salvamento automático no navegador;
- integração desacoplada com o raycasting existente.
