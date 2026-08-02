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

## Arquitetura planejada para o Modo Missão

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

As missões serão armazenadas em `assets/data/missions.json` e utilizarão identificadores estáveis, independentes do idioma exibido ao jogador.

## Integração prevista

O raycasting continuará pertencendo ao simulador. Quando um corpo for selecionado, `SimulatorBridge` transformará essa ação em um evento consumido pelo `MissionManager`. Dessa forma, a camada educacional não conhecerá objetos internos do Three.js.
