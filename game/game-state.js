// =======================================================================
// ESTADO DO JOGO E VARIÁVEIS GLOBAIS (game-state.js)
// =======================================================================

let isPlaying = false;
let isPaused = false;
let score = 100;
let lives = 3;
let gameSpeed = INITIAL_SPEED;
let frameCount = 0;
let activeBills = [];
let portfolio = { acoes: 0, fii: 0, tesouro: 0, rendafixa: 0 };
let currentDate;
let isBankDown = false;
let bankDownDays = 0;
let lockoutDays = 0;
let clock = new THREE.Clock();

// Estado específico do personagem
let player = {
    y: 0, 
    vy: 0, 
    x: -4, 
    size: 1.2, 
    width: 0.8,
    isGrounded: true,
    jumps: 0,
    isSpin: false
};

// Controlo de teclas premidas
const keys = { space: false, right: false };