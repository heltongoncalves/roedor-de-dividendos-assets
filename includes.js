// =======================================================================
// CARREGADOR DE DEPENDÊNCIAS (includes.js)
// =======================================================================

// Lista de todos os ficheiros na ordem exata (agora com as subpastas)
const scriptsToLoad = [
    // 1. Engine 3D
    "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    
    // 2. Arquivos de Configuração e Áudio (na raiz)
    "consts.js",
    "audio.js",
    
    // 3. Arquivos 3D (na pasta 3d/)
    "3d/3d-materials.js",
    "3d/3d-core.js",
    "3d/3d-character.js",
    "3d/3d-world.js",
    "3d/3d-entities.js",
    
    // 4. Arquivos Lógicos Modulares (na pasta game/)
    "game/game-state.js",
    "game/game-ui.js",
    "game/game-input.js",
    "game/game-core.js"
];

// Função para injetar os scripts no HTML
scriptsToLoad.forEach(src => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false; // Garante a ordem de execução
    document.head.appendChild(script);
});

console.log("Todos os módulos do jogo foram injetados com sucesso a partir das subpastas!");