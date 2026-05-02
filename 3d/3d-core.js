// =======================================================================
// NÚCLEO DO THREE.JS E VARIÁVEIS GLOBAIS DE CENA
// =======================================================================

// Globais da Cena
let scene, camera, renderer, dirLight;

// Globais do Cenário (Background)
let cityBuildings = [];
let waterPlane;
let bgPlanes = []; 

// Globais do Personagem
let hamsterContainer, hamster, headGroup, leftLeg, rightLeg, leftArm, rightArm;

// Globais de Objetos Instanciados (Entidades em movimento)
let worldObjects = []; 

// --- INICIALIZAÇÃO DO MOTOR 3D ---
function init3D() {
    const container = document.getElementById('game-container');
    
    // Cena
    scene = new THREE.Scene();
    
    // Câmara
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3, 16); 
    camera.lookAt(0, 1, 0);

    // Renderizador (com fundo transparente para mostrar o CSS de fundo)
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Iluminação Base
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Iluminação Direcional (Sol / Sombras)
    dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(5, 15, 5);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    scene.add(dirLight);

    // Construtores Iniciais
    createHamster();

    // Evento de Redimensionamento da Janela
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}