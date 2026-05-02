// =======================================================================
// MONTAGEM DO PERSONAGEM PRINCIPAL (HAMSTER)
// =======================================================================

function createHamster() {
    hamsterContainer = new THREE.Group();
    hamsterContainer.position.set(-4, GROUND_Y, 0); 
    scene.add(hamsterContainer);

    hamster = new THREE.Group();
    hamster.rotation.y = Math.PI / 2; 
    hamsterContainer.add(hamster);
    
    // Corpo Base
    const bodyGeo = new THREE.SphereGeometry(0.4, 32, 32);
    bodyGeo.scale(1.1, 1.0, 1.0);
    const body = new THREE.Mesh(bodyGeo, mats.shirt);
    body.position.y = 0.5;
    body.castShadow = true;
    hamster.add(body);

    // Barriga Fofa
    const bellyGeo = new THREE.SphereGeometry(0.3, 32, 32);
    bellyGeo.scale(1.1, 1.1, 0.5);
    const belly = new THREE.Mesh(bellyGeo, mats.belly);
    belly.position.set(0, 0.45, 0.35);
    hamster.add(belly);

    // Grupo da Cabeça (Para girar/balançar separadamente)
    headGroup = new THREE.Group();
    headGroup.position.y = 0.9;
    hamster.add(headGroup);

    // Formato da Cabeça
    const headGeo = new THREE.SphereGeometry(0.35, 32, 32);
    headGeo.scale(1.15, 1.0, 1.05);
    const head = new THREE.Mesh(headGeo, mats.fur);
    head.castShadow = true;
    headGroup.add(head);

    // Focinho
    const snoutGeo = new THREE.SphereGeometry(0.15, 32, 32);
    snoutGeo.scale(1.2, 0.8, 1);
    const snout = new THREE.Mesh(snoutGeo, mats.belly);
    snout.position.set(0, -0.05, 0.3);
    headGroup.add(snout);

    // Olhos
    const eyeGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.15, 0.1, 0.3);
    headGroup.add(eyeL);
    
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(0.15, 0.1, 0.3);
    headGroup.add(eyeR);

    // Boné
    const capGeo = new THREE.SphereGeometry(0.36, 32, 32, 0, Math.PI * 2, 0, Math.PI/2.1);
    const cap = new THREE.Mesh(capGeo, mats.hat);
    cap.position.y = 0.05;
    headGroup.add(cap);
    
    const brimGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 32, 1, false, 0, Math.PI);
    const brim = new THREE.Mesh(brimGeo, mats.hat);
    brim.rotation.x = Math.PI / 2;
    brim.position.set(0, 0.05, 0.15);
    brim.scale.set(1.05, 0.8, 1.2);
    headGroup.add(brim);

    // Mochila
    const packGeo = new THREE.BoxGeometry(0.5, 0.6, 0.25);
    const pack = new THREE.Mesh(packGeo, mats.pack);
    pack.position.set(0, 0.55, -0.35);
    pack.castShadow = true;
    hamster.add(pack);

    // Membros (Pernas e Braços)
    const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.25, 16);
    const legGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.2, 16);

    leftArm = new THREE.Mesh(armGeo, mats.fur); 
    leftArm.position.set(-0.45, 0.6, 0);
    
    rightArm = new THREE.Mesh(armGeo, mats.fur); 
    rightArm.position.set(0.45, 0.6, 0);
    
    hamster.add(leftArm); 
    hamster.add(rightArm);

    leftLeg = new THREE.Mesh(legGeo, mats.fur); 
    leftLeg.position.set(-0.2, 0.2, 0); 
    leftLeg.castShadow = true;
    
    rightLeg = new THREE.Mesh(legGeo, mats.fur); 
    rightLeg.position.set(0.2, 0.2, 0); 
    rightLeg.castShadow = true;
    
    hamster.add(leftLeg); 
    hamster.add(rightLeg);
}