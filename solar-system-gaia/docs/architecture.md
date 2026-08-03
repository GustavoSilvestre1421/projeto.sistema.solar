# Arquitetura do Projeto Gaia

## Princípio central

O simulador existente é a base do produto. Novas funcionalidades serão integradas por módulos independentes, preservando órbitas, câmera, raycasting, acompanhamento de corpos celestes, painel informativo e internacionalização.

## Organização atual

A primeira etapa separa apresentação, estilos e comportamento:

- `index.html`: marcação e carregamento dos recursos;
- `assets/css/styles.css`: interface visual;
- `assets/js/main.js`: comportamento atual do simulador;
- `assets/data`: dados externos que não devem ficar embutidos na lógica.

O arquivo `main.js` ainda contém o código legado completo propositalmente. A separação interna será incremental para reduzir o risco de regressões.

## Arquitetura implementada para o Modo Missão

```text
assets/js/
├── main.js
├── core/
│   └── SimulatorBridge.js
├── missions/
│   ├── Mission.js
│   └── MissionManager.js
├── player/
│   ├── Player.js
│   └── XPSystem.js
├── persistence/
│   └── SaveManager.js
└── ui/
    └── MissionUI.js
```

As missões são armazenadas em `assets/data/missions.json`. O nome canônico do corpo celeste faz a ligação com os dados atuais do simulador; as futuras traduções serão apenas uma camada de apresentação.

## Integração prevista

O raycasting continua pertencendo ao simulador. Quando um corpo é selecionado, `SimulatorBridge` transforma essa ação em um evento consumido pelo `MissionManager`. Dessa forma, a camada educacional não conhece objetos internos do Three.js.

## Fluxo de dados

1. `main.js` detecta o corpo selecionado pelo raycasting.
2. `SimulatorBridge` publica o evento `body:selected`.
3. `MissionManager` compara o corpo com o alvo da missão.
4. `Player` registra recompensas de maneira idempotente.
5. `SaveManager` persiste somente dados serializáveis no `localStorage`.
6. `MissionUI` reage aos eventos e atualiza a interface.

As regras não manipulam câmera, cena, meshes ou controles orbitais.
## Evoluções da v0.23

### Persistência

`SafeStorage` é o único ponto autorizado a acessar o armazenamento nativo do navegador. Os demais módulos usam `getItem`, `getJSON`, `setItem`, `setJSON` e `removeItem`, que retornam valores seguros e emitem `storage:error` quando uma operação falha.

A exclusão total usa uma lista explícita de nove chaves. O projeto não chama `localStorage.clear()`, pois o mesmo servidor pode hospedar outras atividades escolares.

### Aplicativo instalável

`manifest.webmanifest` descreve a instalação, os ícones e a identidade do aplicativo. `service-worker.js` mantém um cache versionado dos arquivos essenciais. Three.js e OrbitControls são dependências locais para que a primeira visita completa possa preparar a execução offline.

O documento HTML é atualizado pela rede quando disponível e retorna ao cache quando offline. Recursos estáticos usam o cache e recorrem à rede quando ainda não estiverem armazenados.

### Áudio

`SoundManager` mantém no máximo um conjunto de ambiente ativo. Efeitos curtos desconectam seus nós no evento `ended`; o ambiente é interrompido ao silenciar ou ocultar a página, e o contexto é suspenso em segundo plano.
