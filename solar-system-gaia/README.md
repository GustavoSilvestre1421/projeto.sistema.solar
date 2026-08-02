# Sistema Solar 3D — Projeto Gaia

Simulador tridimensional e educacional do Sistema Solar desenvolvido com JavaScript e Three.js.

## Estado atual

Esta primeira organização preserva integralmente o simulador existente e separa suas responsabilidades em arquivos próprios. O Modo Missão será implementado de forma incremental sobre esta base.

## Estrutura

```text
solar-system-gaia/
├── index.html
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── data/
│   ├── images/
│   └── js/
│       └── main.js
├── docs/
├── pages/
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

## Próxima etapa

Introduzir a separação interna do JavaScript e o Modo Missão por módulos, sem reescrever os sistemas existentes de renderização, órbitas, câmera, seleção ou tradução.
