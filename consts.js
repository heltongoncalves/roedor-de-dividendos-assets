// =======================================================================
// CONSTANTES DO JOGO E DADOS DE NEGÓCIO
// =======================================================================

const FUNNY_MESSAGES = [
    "Compraste no topo e vendeste no fundo!", 
    "A inflação comeu as tuas sementes!", 
    "Circuit breaker na tua carteira!", 
    "Falência técnica: juros maiores que o salto!", 
    "O banco caiu na hora de pagar!"
];

const BOLETO_LABELS = [
    "Taxa de Fofura", 
    "Aluguel da Roda", 
    "Multa de Giro", 
    "Imposto de Girassol"
];

const HOLIDAYS = [
    {m:0,d:1,n:"Ano Novo"}, 
    {m:3,d:21,n:"Tiradentes"}, 
    {m:4,d:1,n:"Trabalho"}, 
    {m:8,d:7,n:"Independência"}, 
    {m:9,d:12,n:"Aparecida"}, 
    {m:10,d:2,n:"Finados"}, 
    {m:10,d:15,n:"República"}, 
    {m:11,d:25,n:"Natal"}
];

// --- CONFIGURAÇÕES DA FÍSICA E JOGO ---
const INITIAL_SPEED = 12;
const GRAVITY = 45;
const JUMP_FORCE = 18;
const SPIN_JUMP_FORCE = 14.4; 
const INTEREST = 0.00018; 
const DAY_FRAMES = 600; 
const GROUND_Y = -1;