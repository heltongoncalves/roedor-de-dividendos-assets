// =======================================================================
// LÓGICA PRINCIPAL, COLISÕES E GAME LOOP (game-core.js)
// =======================================================================

function startGame() {
    document.getElementById('start-screen').style.display='none'; 
    document.getElementById('game-over').style.display='none';
    
    worldObjects.forEach(obj => scene.remove(obj.mesh));
    worldObjects = [];

    for(let i=0; i<4; i++) {
        spawnEntity('ground', -20 + (i * 40), GROUND_Y - 0.5, 40, 1);
    }

    currentDate = new Date(2025, Math.floor(Math.random()*12), Math.floor(Math.random()*28));
    score = 100; activeBills = []; lives = 3; 
    gameSpeed = INITIAL_SPEED; frameCount = 0;
    isPaused = false; isBankDown = false; bankDownDays = 0; lockoutDays = 0;
    portfolio = { acoes: 0, fii: 0, tesouro: 0, rendafixa: 0 };
    
    player.y = GROUND_Y; player.vy = 0; player.isGrounded = true; player.jumps = 0; player.isSpin = false;
    isPlaying = true;
}

function handleSpawns(dt) {
    gameSpeed += 0.1 * dt; 
    
    if(frameCount % DAY_FRAMES === 0) {
        currentDate.setDate(currentDate.getDate()+1);
        if(lockoutDays > 0) lockoutDays--;
        if(bankDownDays > 0) { bankDownDays--; if(bankDownDays <= 0) isBankDown = false; }
        else if(Math.random() < 0.08) { isBankDown = true; bankDownDays = Math.floor(Math.random()*3)+1; }
    }

    if(frameCount % Math.floor(80 * (INITIAL_SPEED/gameSpeed)) === 0) {
        const r = Math.random();
        const spawnX = 25;
        
        if(r < 0.2) {
            const py = Math.random() * 3 + 2;
            spawnEntity('platform', spawnX, py, 4 + Math.random()*4, 0.5);
            if(Math.random() < 0.2) spawnEntity('safe', spawnX, py + 1, 1, 1);
        }
        
        if(r > 0.3 && r < 0.5) spawnEntity('boleto', spawnX, GROUND_Y + 0.5 + Math.random()*2, 0.8, 0.5);
        else if(r > 0.5 && r < 0.6) spawnEntity('imposto', spawnX, GROUND_Y + 0.5, 1, 1);
        else if(r > 0.6 && r < 0.8) spawnEntity('coin', spawnX, GROUND_Y + 1 + Math.random()*3, 0.8, 0.8);
        else if(r > 0.8) {
            const t = ['heart','acoes','fii','tesouro','rendafixa'];
            const sub = t[Math.floor(Math.random()*t.length)];
            spawnEntity(sub === 'heart' ? 'heart' : 'investment', spawnX, GROUND_Y + 1.5, 0.8, 0.8, sub);
        }
    }
}

function animate() {
    const dt = Math.min(clock.getDelta(), 0.1); 
    
    if(!isPlaying || isPaused) {
        renderer.render(scene, camera);
        return;
    }

    // Física
    player.vy -= GRAVITY * dt;
    player.y += player.vy * dt;
    player.isGrounded = false;

    // Failsafe chão contínuo
    if (player.y < GROUND_Y) {
        player.y = GROUND_Y;
        player.vy = 0;
        player.isGrounded = true;
        player.jumps = 0;
        player.isSpin = false;
    }

    handleSpawns(dt);

    const time = clock.getElapsedTime();

    // Colisões e Animações dos Props
    for(let i = worldObjects.length - 1; i >= 0; i--) {
        let obj = worldObjects[i];
        
        if(obj.type === 'particle') {
            obj.mesh.position.x += obj.mesh.userData.vx * dt;
            obj.mesh.position.y += obj.mesh.userData.vy * dt;
            obj.mesh.userData.vy -= GRAVITY * dt;
            obj.mesh.scale.multiplyScalar(0.95);
            obj.mesh.userData.life -= dt;
            if(obj.mesh.userData.life <= 0) obj.markedForDeletion = true;
            continue;
        }

        obj.mesh.position.x -= gameSpeed * dt;
        
        if(obj.type === 'coin') {
            obj.mesh.rotation.y += 4 * dt; 
        } else if(obj.type === 'safe' || obj.type === 'investment' || obj.type === 'heart') {
            obj.mesh.rotation.y += 1.5 * dt;
            obj.mesh.position.y += Math.sin(time * 5 + obj.mesh.position.x) * 0.02; 
        } else if(obj.type === 'boleto') {
            obj.mesh.position.y += Math.cos(time * 6 + obj.mesh.position.x) * 0.03;
            if(obj.mesh.userData && obj.mesh.userData.wings) {
                obj.mesh.userData.flapTime += dt * 15;
                obj.mesh.userData.wings[0].rotation.y = Math.sin(obj.mesh.userData.flapTime) * 0.5;
                obj.mesh.userData.wings[1].rotation.y = -Math.sin(obj.mesh.userData.flapTime) * 0.5;
            }
        } else if (obj.type === 'imposto') {
            obj.mesh.rotation.y += 1.0 * dt;
        }

        if(obj.type === 'ground') {
            if(obj.mesh.position.x < -60) {
                obj.mesh.position.x += 160; 
            }
        } else if(obj.mesh.position.x < -15) {
            if(obj.type === 'coin') score = Math.max(0, score - 10); 
            obj.markedForDeletion = true;
            continue;
        }

        const ow = obj.w || 1;
        const oh = obj.h || 1;
        
        const isIntersecting = (
            player.x + player.width/2 > obj.mesh.position.x - ow/2 &&
            player.x - player.width/2 < obj.mesh.position.x + ow/2 &&
            player.y + player.size > obj.mesh.position.y - oh/2 &&
            player.y < obj.mesh.position.y + oh/2
        );

        if(isIntersecting) {
            if(obj.type === 'ground' || obj.type === 'platform') {
                if(player.vy <= 0 && player.y - player.vy*dt >= obj.mesh.position.y + oh/2 - 0.5) {
                    player.y = obj.mesh.position.y + oh/2;
                    player.vy = 0;
                    player.isGrounded = true;
                    player.jumps = 0;
                    player.isSpin = false;
                } 
                else if(player.vy > 0 && player.y + player.size <= obj.mesh.position.y - oh/2 + 0.5) {
                    player.vy = -2; 
                }
            } 
            else if (obj.type === 'coin' || obj.type === 'safe' || obj.type === 'heart' || obj.type === 'investment') {
                
                // Mapeamento dos novos sons dependendo do que o jogador colecionou
                if (obj.type === 'coin') { 
                    score += obj.val; 
                    sfx.coin(); 
                } else if (obj.type === 'safe') { 
                    score += obj.val; 
                    sfx.safe(); 
                } else if (obj.type === 'heart') {
                    if (lives < 5) lives++;
                    sfx.heart(); // Toca som de vida
                } else if (obj.type === 'investment') {
                    portfolio[obj.subType]++;
                    // Despacha o som específico do investimento recolhido
                    if (obj.subType === 'acoes') sfx.acoes();
                    else if (obj.subType === 'fii') sfx.fii();
                    else if (obj.subType === 'tesouro') sfx.tesouro();
                    else if (obj.subType === 'rendafixa') sfx.rendafixa();
                }
                
                spawnParticles(obj.mesh.position.x, obj.mesh.position.y, 0xfbbf24, 8);
                obj.markedForDeletion = true;
            }
            else if (obj.type === 'boleto' || obj.type === 'imposto') {
                if(player.isSpin && player.vy < 0) {
                    score += 20;
                    player.vy = 10; 
                    sfx.coin(); // Toca som alegre ao derrotar passivos girando
                    spawnParticles(obj.mesh.position.x, obj.mesh.position.y, 0x10b981, 12);
                } else {
                    gameSpeed = INITIAL_SPEED; 
                    sfx.hit();
                    if(obj.type === 'boleto') lockoutDays = Math.floor(Math.random()*3)+1;
                    
                    activeBills.push({ t: obj.type, label: BOLETO_LABELS[Math.floor(Math.random()*BOLETO_LABELS.length)], p: obj.val, s: frameCount });
                    spawnParticles(player.x, player.y, 0xef4444, 10);
                }
                obj.markedForDeletion = true;
            }
        }
    }

    for(let i = worldObjects.length - 1; i >= 0; i--) {
        if(worldObjects[i].markedForDeletion) {
            scene.remove(worldObjects[i].mesh);
            worldObjects.splice(i, 1);
        }
    }

    hamsterContainer.position.y = player.y;
    
    if(!player.isGrounded) {
        if(player.isSpin) {
            hamster.rotation.x -= 20 * dt; 
        } else {
            hamster.rotation.x = 0;
            leftLeg.rotation.x = -Math.PI/4; rightLeg.rotation.x = Math.PI/4;
            leftArm.rotation.x = Math.PI/2; rightArm.rotation.x = Math.PI/2;
        }
    } else {
        hamster.rotation.x = 0; 
        
        const runCycle = time * gameSpeed * 1.5;
        leftLeg.rotation.x = Math.sin(runCycle) * 0.8;
        rightLeg.rotation.x = Math.sin(runCycle + Math.PI) * 0.8;
        leftArm.rotation.x = Math.sin(runCycle + Math.PI) * 0.8;
        rightArm.rotation.x = Math.sin(runCycle) * 0.8;
        
        hamster.rotation.z = -0.1 - Math.abs(Math.sin(runCycle * 2)) * 0.05; 
        hamster.position.y = Math.abs(Math.sin(runCycle * 2)) * 0.1;
        headGroup.rotation.y = Math.sin(runCycle) * 0.1;
    }

    frameCount++;
    updateHUD();

    camera.position.y += (player.y + 6 - camera.position.y) * 0.1; 
    renderer.render(scene, camera);
}

// INICIAR TUDO QUANDO A JANELA CARREGAR
window.onload = function() {
    init3D();
    setupInputs();
    renderer.setAnimationLoop(animate);
};