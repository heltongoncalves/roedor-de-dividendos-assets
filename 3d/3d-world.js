// =======================================================================
// CONSTRUÇÃO DO CENÁRIO, FUNDO DE PARALLAX E LÍQUIDOS
// =======================================================================

// --- INICIALIZAÇÃO DE ELEMENTOS DO MUNDO ---
// NOTA: Esta função não é chamada no init3D para deixar a tela de introdução mais limpa.
// Ela deverá ser acionada caso decidam reintroduzir a cidade.
function createBackground() {
    /* O código abaixo cria parallax com imagens e edifícios em 3D.
    Nesta versão atual mantivemos este ambiente limpo porque usamos o background em CSS no HTML.
    Caso queiras restaurar a água ou os prédios, basta chamar createBackground() novamente.
    */
    
    const cityTex = spriteTexture.clone();
    cityTex.needsUpdate = true;
    cityTex.repeat.set(0.3, 0.22); 
    cityTex.offset.set(0.005, 1.0 - 0.78 - 0.22); 

    for(let i=0; i<3; i++) {
        const bgGeo = new THREE.PlaneGeometry(60, 30);
        const bgMat = new THREE.MeshBasicMaterial({ map: cityTex, transparent: true });
        const bgPlane = new THREE.Mesh(bgGeo, bgMat);
        bgPlane.position.set(i * 59 - 20, 12, -25); 
        scene.add(bgPlane);
        bgPlanes.push(bgPlane);
    }

    const waterGeo = new THREE.PlaneGeometry(100, 20, 32, 8);
    const waterMat = new THREE.MeshStandardMaterial({ color: 0x0ea5e9, roughness: 0.1, flatShading: true, transparent: true, opacity: 0.85 });
    waterPlane = new THREE.Mesh(waterGeo, waterMat);
    waterPlane.rotation.x = -Math.PI / 2;
    waterPlane.position.set(0, -2, -5);
    scene.add(waterPlane);

    for(let i=0; i<20; i++) {
        const h = Math.random() * 8 + 4;
        const building = new THREE.Mesh(
            new THREE.BoxGeometry(Math.random()*2+2, h, Math.random()*2+2),
            new THREE.MeshLambertMaterial({ color: 0x0f172a })
        );
        building.position.set((Math.random() - 0.5) * 80, h/2 - 2, -12 - Math.random() * 5);
        scene.add(building);
        cityBuildings.push(building);
    }
}