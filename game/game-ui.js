// =======================================================================
// INTERFACE DE UTILIZADOR E MENUS (game-ui.js)
// =======================================================================

function playIntro() {
    document.getElementById('initial-click-screen').style.display = 'none';
    const introContainer = document.getElementById('intro-container');
    const introVideo = document.getElementById('intro-video');
    
    introContainer.style.display = 'flex';
    introVideo.play().catch(e => {
        console.log("Autoplay bloqueado pelo browser: ", e);
        endIntro(); 
    });
}

function skipIntro() { document.getElementById('intro-video').pause(); endIntro(); }

function endIntro() {
    document.getElementById('intro-container').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
}

function isBankOpen(date) {
    const day = date.getDay();
    if (day === 0 || day === 6) return { open: false, reason: "Bancos fechados ao fim de semana." };
    if (isBankDown) return { open: false, reason: "ERRO: Sistema indisponível." };
    const holiday = HOLIDAYS.find(h => h.m === date.getMonth() && h.d === date.getDate());
    if (holiday) return { open: false, reason: `Feriado: ${holiday.n}.` };
    if (lockoutDays > 0) return { open: false, reason: `Compensação em curso (${lockoutDays}d).` };
    return { open: true };
}

function updateHUD() {
    const totalD = activeBills.reduce((acc, b) => acc + (b.p * Math.pow(1+INTEREST, frameCount-b.s)), 0);
    
    if (totalD > score && isPlaying) {
        lives--; score = 0; activeBills = []; 
        camera.position.y += Math.random() * 0.5 - 0.25;
        if (lives <= 0) gameOver();
    }

    document.getElementById('lives').innerText = lives;
    document.getElementById('seeds').innerText = Math.floor(score);
    document.getElementById('debt-value').innerText = totalD > 0 ? "-"+Math.floor(totalD) : "0";
    document.getElementById('game-date').innerText = `${String(currentDate.getDate()).padStart(2,'0')}/${String(currentDate.getMonth()+1).padStart(2,'0')}`;
    document.getElementById('game-weekday').innerText = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"][currentDate.getDay()];
    document.getElementById('bank-alert').style.display = isBankDown ? 'block' : 'none';
    document.getElementById('count-acoes').innerText = portfolio.acoes;
    document.getElementById('count-fii').innerText = portfolio.fii;
    document.getElementById('count-tesouro').innerText = portfolio.tesouro;
    document.getElementById('count-rendafixa').innerText = portfolio.rendafixa;
}

function gameOver() { 
    isPlaying = false; 
    document.getElementById('funny-message').innerText = FUNNY_MESSAGES[Math.floor(Math.random()*FUNNY_MESSAGES.length)]; 
    document.getElementById('game-over').style.display='flex'; 
}

function openDebtScreen() {
    if(isBankDown) return;
    document.getElementById('pause-screen').style.display = 'none';
    const list = document.getElementById('debt-list-container');
    const warn = document.getElementById('bank-warning');
    
    list.innerHTML = ""; 
    let t = 0;
    
    activeBills.forEach(b => {
        const cur = b.p * Math.pow(1+INTEREST, frameCount-b.s); 
        const juros = cur - b.p; 
        t += cur;
        
        list.innerHTML += `
            <div class="debt-card" style="align-items: center;">
                <div>
                    <b style="display: block; margin-bottom: 2px;">${b.label}</b>
                    <span style="font-size: 0.7rem; color: #94a3b8;">
                        Principal: ${Math.floor(b.p)} | 
                        Juros: <span style="color: #ef4444;">+${Math.floor(juros)}</span>
                    </span>
                </div>
                <span style="font-weight: bold; font-size: 1rem;">💰 ${Math.floor(cur)}</span>
            </div>
        `;
    });
    
    const status = isBankOpen(currentDate);
    if(!status.open) { 
        warn.innerText = status.reason; warn.style.display="block"; 
        document.getElementById('btn-confirm-pay').disabled = true; 
    } else { 
        warn.style.display="none"; 
        document.getElementById('btn-confirm-pay').disabled = (score < t || activeBills.length === 0); 
    }
    
    document.getElementById('debt-total').innerText = Math.floor(t); 
    document.getElementById('debt-saldo').innerText = Math.floor(score);
    document.getElementById('debt-screen').style.display = 'flex';
}

function closeDebtScreen() { 
    document.getElementById('debt-screen').style.display='none'; 
    document.getElementById('pause-screen').style.display='flex'; 
}

function payAllDebts() { 
    let t = activeBills.reduce((acc, b) => acc + (b.p * Math.pow(1+INTEREST, frameCount-b.s)), 0); 
    if(score >= t) { 
        score -= t; activeBills = []; 
        sfx.safe();
        closeDebtScreen(); updateHUD(); 
    } 
}

function togglePause() { 
    if(!isPlaying || document.getElementById('debt-screen').style.display==='flex') return; 
    isPaused = !isPaused; 
    document.getElementById('pause-btn-debt').disabled = isBankDown;
    document.getElementById('pause-btn-invest').disabled = isBankDown;
    document.getElementById('pause-feedback').innerText = isBankDown ? "⚠️ Sem conexão com o banco." : "";
    document.getElementById('pause-screen').style.display = isPaused ? 'flex' : 'none'; 
    if(!isPaused) clock.getDelta(); 
}

function showPauseMsg(m) { if(!isBankDown) document.getElementById('pause-feedback').innerText = m; }