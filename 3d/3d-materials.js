// =======================================================================
// TEXTURAS E MATERIAIS
// =======================================================================

// --- TEXTURAS ---
const textureLoader = new THREE.TextureLoader();
const spriteTexture = textureLoader.load('https://heltongoncalves.github.io/roedor-de-dividendos-assets/G0001.png');
spriteTexture.magFilter = THREE.NearestFilter; 

// --- MATERIAIS LÚDICOS ---
const mats = {
    // Personagem
    fur: new THREE.MeshStandardMaterial({ color: 0xff9f43, roughness: 0.6 }),
    belly: new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 0.7 }),
    shirt: new THREE.MeshStandardMaterial({ color: 0xff6b00, roughness: 0.5 }),
    hat: new THREE.MeshStandardMaterial({ color: 0x2ecc71, roughness: 0.6 }),
    pack: new THREE.MeshStandardMaterial({ color: 0x8d5524, roughness: 0.7 }),
    
    // Mundo e Objetos Básicos
    wood: new THREE.MeshStandardMaterial({ color: 0xA0522D, roughness: 0.9 }),
    
    // Moedas e Valores
    coin: new THREE.MeshStandardMaterial({ 
        color: 0xffd700, emissive: 0xffa500, emissiveIntensity: 0.6, metalness: 1.0, roughness: 0.2
    }),
    coinInner: new THREE.MeshStandardMaterial({ 
        color: 0xffc107, emissive: 0xff8c00, emissiveIntensity: 0.4, metalness: 0.9, roughness: 0.3
    }),
    
    // Inimigos (Passivos/Impostos)
    boletoBase: new THREE.MeshStandardMaterial({ color: 0xf5e6ca, roughness: 0.8 }), 
    batWing: new THREE.MeshStandardMaterial({ color: 0x372d24, roughness: 0.7 }),
    imposto: new THREE.MeshStandardMaterial({ color: 0x9b59b6, roughness: 0.3, metalness: 0.6, emissive: 0x8e44ad, emissiveIntensity: 0.2 }), 
    
    // Colecionáveis e Interativos
    safeBody: new THREE.MeshStandardMaterial({ color: 0x7f8c8d, metalness: 0.8, roughness: 0.3 }),
    safeDial: new THREE.MeshStandardMaterial({ color: 0xbdc3c7, metalness: 0.9, roughness: 0.2 }),
    heart: new THREE.MeshStandardMaterial({ color: 0xe91e63, roughness: 0.4, emissive: 0xc2185b, emissiveIntensity: 0.3 }),
    
    // Ativos da Carteira (HUD/Investimentos)
    acoes: new THREE.MeshStandardMaterial({ color: 0x2ecc71, emissive: 0x27ae60, emissiveIntensity: 0.2 }), 
    fii: new THREE.MeshStandardMaterial({ color: 0x3498db, emissive: 0x2980b9, emissiveIntensity: 0.2 }), 
    tesouro: new THREE.MeshStandardMaterial({ color: 0xf1c40f, emissive: 0xf39c12, emissiveIntensity: 0.2 }), 
    rendafixa: new THREE.MeshStandardMaterial({ color: 0x9b59b6, emissive: 0x8e44ad, emissiveIntensity: 0.2 }) 
};