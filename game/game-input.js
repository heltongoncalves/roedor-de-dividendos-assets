// =======================================================================
// INPUTS, CONTROLES E MECÂNICA DE SALTO (game-input.js)
// =======================================================================

function setupInputs() {
    // Controlos PC (Teclado)
    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape') togglePause();
        if(!isPlaying || isPaused) return;
        
        if(e.code === 'Space' || e.code === 'ArrowUp') {
            if(!keys.space) { handleJump(); keys.space = true; }
        }
        if(e.code === 'ArrowRight') {
            if(!player.isGrounded) player.isSpin = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if(e.code === 'Space' || e.code === 'ArrowUp') keys.space = false;
    });

    // Controlos Mobile (Toque)
    const btnJump = document.getElementById('btn-jump');
    const btnSpin = document.getElementById('btn-spin');
    
    if (btnJump && btnSpin) {
        // Usamos touchstart e preventDefault() para evitar zoom ou duplo-clique acidental
        btnJump.addEventListener('touchstart', (e) => { 
            e.preventDefault(); 
            if(!isPlaying || isPaused) return;
            handleJump(); 
        }, { passive: false });
        
        btnSpin.addEventListener('touchstart', (e) => { 
            e.preventDefault(); 
            if(!isPlaying || isPaused) return;
            if(!player.isGrounded) player.isSpin = true; 
        }, { passive: false });
        
        // Mantemos o mousedown como fallback caso testem o layout mobile num PC usando rato
        btnJump.addEventListener('mousedown', (e) => { if(isPlaying && !isPaused) handleJump(); });
        btnSpin.addEventListener('mousedown', (e) => { if(isPlaying && !isPaused && !player.isGrounded) player.isSpin = true; });
    }
}

function handleJump() {
    if(player.jumps < 2) {
        player.vy = (player.isSpin) ? SPIN_JUMP_FORCE : (player.jumps === 0 ? JUMP_FORCE : 14);
        player.isGrounded = false;
        player.jumps++;
        
        if (player.isSpin) sfx.spin(); else sfx.jump();
        
        spawnParticles(player.x, player.y + 0.5, player.isSpin ? 0xffd700 : 0xcbd5e1, 5);
    }
}