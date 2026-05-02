// =======================================================================
// CRIADORES DE MODELOS 3D E SISTEMA DE SPAWN
// =======================================================================

function createCoinMesh() {
    const group = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.15, 32), mats.coin);
    base.rotation.x = Math.PI / 2;
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.18, 32), mats.coinInner);
    inner.rotation.x = Math.PI / 2;
    group.add(base); group.add(inner);
    return group;
}

function createBoletoTexture(valor) {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#f5e6ca';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = 'bold 40px Poppins, sans-serif';
    ctx.fillStyle = '#372d24'; 
    ctx.textAlign = 'center';
    ctx.fillText('BOLETO', canvas.width / 2, 50);

    ctx.font = 'bold 50px Poppins, sans-serif';
    ctx.fillStyle = '#c0392b'; 
    ctx.fillText(`-$${valor}`, canvas.width / 2, 100);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true; return texture;
}

function createBoletoMesh(valor) {
    const group = new THREE.Group();
    const envelope = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.6, 0.1), mats.boletoBase);
    group.add(envelope);

    const textGeo = new THREE.PlaneGeometry(0.85, 0.55);
    const textMat = new THREE.MeshBasicMaterial({ map: createBoletoTexture(valor), transparent: true });
    const textPlane = new THREE.Mesh(textGeo, textMat);
    textPlane.position.z = 0.06; 
    group.add(textPlane);
    
    const wingGeo = new THREE.ConeGeometry(0.25, 0.7, 3);
    wingGeo.scale(1, 1, 0.1); 
    
    const wingL = new THREE.Mesh(wingGeo, mats.batWing);
    wingL.position.set(-0.55, 0.2, -0.05); wingL.rotation.z = Math.PI / 4;
    group.add(wingL);
    
    const wingR = new THREE.Mesh(wingGeo, mats.batWing);
    wingR.position.set(0.55, 0.2, -0.05); wingR.rotation.z = -Math.PI / 4;
    group.add(wingR);
    
    group.userData = { wings: [wingL, wingR], flapTime: Math.random() * 10 };
    return group;
}

function createCrystalMesh() {
    const group = new THREE.Group();
    for(let i=0; i<4; i++) {
        const crystal = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.0, 5), mats.imposto);
        crystal.position.set((Math.random()-0.5)*0.4, 0.5, (Math.random()-0.5)*0.4);
        crystal.rotation.set((Math.random()-0.5)*0.5, Math.random()*Math.PI, (Math.random()-0.5)*0.5);
        crystal.castShadow = true;
        group.add(crystal);
    }
    return group;
}

function createSafeMesh() {
    const group = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.2), mats.safeBody);
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 0.1), mats.safeDial);
    door.position.set(0, 0, 0.6);
    const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1, 16), mats.safeBody);
    dial.rotation.x = Math.PI / 2; dial.position.set(0, 0, 0.65);
    group.add(body); group.add(door); group.add(dial);
    return group;
}

function createInvestmentMesh(subType) {
    const group = new THREE.Group();
    if (subType === 'acoes') {
        const stem = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 0.2), mats.acoes);
        const head = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.4, 4), mats.acoes);
        head.position.y = 0.5; head.rotation.y = Math.PI / 4;
        group.add(stem); group.add(head);
    } else if (subType === 'fii') {
        const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.4, 0.25), mats.fii); b1.position.set(-0.35, -0.1, 0);
        const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.6, 0.25), mats.fii); b2.position.set(0, 0, 0);
        const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.9, 0.25), mats.fii); b3.position.set(0.35, 0.15, 0);
        group.add(b1); group.add(b2); group.add(b3);
    } else if (subType === 'tesouro') {
        const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.8, 16), mats.tesouro);
        scroll.rotation.z = Math.PI / 2;
        group.add(scroll);
    } else if (subType === 'rendafixa') {
        const pig = new THREE.Mesh(new THREE.SphereGeometry(0.4, 16, 16), mats.rendafixa);
        const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16), mats.belly);
        snout.rotation.x = Math.PI / 2; snout.position.set(0, 0, 0.35);
        group.add(pig); group.add(snout);
    }
    return group;
}

function spawnEntity(type, x, y, width, height, subType = null) {
    let mesh;
    let collisionType = type;
    let val = 0;

    if(type === 'ground' || type === 'platform') {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, 2), mats.wood);
        mesh.receiveShadow = true;
    } else if (type === 'coin') {
        mesh = createCoinMesh(); val = 10;
    } else if (type === 'boleto') {
        val = Math.floor(Math.random()*80)+40;
        mesh = createBoletoMesh(val); mesh.castShadow = true;
    } else if (type === 'imposto') {
        mesh = createCrystalMesh(); val = Math.floor(Math.random()*80)+40;
    } else if (type === 'safe') {
        mesh = createSafeMesh(); val = 100;
    } else if (type === 'heart') {
        mesh = new THREE.Mesh(new THREE.SphereGeometry(0.4), mats.heart);
    } else if (type === 'investment') {
        mesh = createInvestmentMesh(subType);
    }

    mesh.position.set(x, y, 0);
    scene.add(mesh);
    worldObjects.push({ mesh, type: collisionType, subType, w: width, h: height, val, markedForDeletion: false });
}

function spawnParticles(x, y, colorHex, count) {
    const geom = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const mat = new THREE.MeshBasicMaterial({ color: colorHex });
    for(let i=0; i<count; i++) {
        const p = new THREE.Mesh(geom, mat);
        p.position.set(x + (Math.random()-0.5), y + (Math.random()-0.5), 0);
        p.mesh = p; 
        p.userData = { vx: (Math.random()-0.5)*10, vy: Math.random()*10, life: 1.0 };
        scene.add(p);
        worldObjects.push({ mesh: p, type: 'particle' });
    }
}