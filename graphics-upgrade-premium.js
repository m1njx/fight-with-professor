// ================================================
//  초고퀄리티 그래픽 시스템 (Ultra Premium Edition)
// ================================================

// 전역 유틸리티
const lerp = (a, b, t) => a + (b - a) * t;

// ════════════════════════════════════════════════════════
//  배경 시스템 (Parallax & Depth)
// ════════════════════════════════════════════════════════

function drawBackground_Premium() {
    const theme = BG_THEMES[currentRound];
    drawBgDecoration_Premium(theme);
}

function drawBgDecoration_Premium(theme) {
    ctx.save();
    const time = Date.now() * 0.001;

    // 1. 기본 하늘 레이어
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    if (currentRound === 0) { // 강의실
        skyGrad.addColorStop(0, '#e8eef2');
        skyGrad.addColorStop(1, '#d1dce5');
    } else if (currentRound === 1) { // 도서관
        skyGrad.addColorStop(0, '#2c1e12');
        skyGrad.addColorStop(1, '#4a3520');
    } else if (currentRound === 2) { // 캠퍼스
        skyGrad.addColorStop(0, '#5eb1ff');
        skyGrad.addColorStop(1, '#a1d6ff');
    } else { // 졸업식
        skyGrad.addColorStop(0, '#1a0a2e');
        skyGrad.addColorStop(1, '#3d1a5e');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, GROUND_Y);

    if (currentRound === 0) {
        // [라운드 1: 모던 강의실]
        // 창문 너머 풍경 (Parallax)
        const windowX = 150;
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(windowX, 80, 200, 150);
        // 지나가는 구름
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        const cloudX = (time * 10) % 300 - 50;
        ctx.beginPath();
        ctx.arc(windowX + cloudX, 120, 20, 0, Math.PI*2);
        ctx.arc(windowX + cloudX + 25, 115, 25, 0, Math.PI*2);
        ctx.fill();
        
        // 창틀
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.strokeRect(windowX, 80, 200, 150);
        ctx.beginPath();
        ctx.moveTo(windowX + 100, 80); ctx.lineTo(windowX + 100, 230);
        ctx.moveTo(windowX, 155); ctx.lineTo(windowX + 200, 155);
        ctx.stroke();

        // 칠판 (리얼한 질감)
        const boardX = 400, boardY = 70, boardW = 450, boardH = 180;
        const bGrad = ctx.createLinearGradient(boardX, boardY, boardX, boardY + boardH);
        bGrad.addColorStop(0, '#1e3d2e');
        bGrad.addColorStop(1, '#132b20');
        ctx.fillStyle = bGrad;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 10;
        ctx.fillRect(boardX, boardY, boardW, boardH);
        ctx.shadowBlur = 0;
        
        // 칠판 낙서 (수식)
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1.5;
        ctx.font = '14px "Courier New"';
        ctx.strokeText('E = mc²', boardX + 30, boardY + 40);
        ctx.strokeText('∫ f(x)dx = F(x)', boardX + 30, boardY + 70);
        ctx.strokeText('Grade = F', boardX + 300, boardY + 150);

        // 조명 (천장)
        for(let i=0; i<3; i++) {
            const lx = 200 + i*300;
            const glow = ctx.createRadialGradient(lx, 30, 0, lx, 30, 150);
            glow.addColorStop(0, 'rgba(255,255,200,0.2)');
            glow.addColorStop(1, 'rgba(255,255,200,0)');
            ctx.fillStyle = glow;
            ctx.fillRect(lx-150, 0, 300, 100);
        }

    } else if (currentRound === 1) {
        // [라운드 2: 클래식 도서관]
        // 대형 책장
        for(let i=0; i<6; i++) {
            const sx = i * 160;
            ctx.fillStyle = '#3d2616';
            ctx.fillRect(sx, 50, 140, GROUND_Y-50);
            // 책들
            for(let j=0; j<8; j++) {
                const sy = 60 + j*45;
                ctx.fillStyle = '#2a1a0f';
                ctx.fillRect(sx+5, sy+38, 130, 4); // 선반
                for(let k=0; k<10; k++) {
                    const bx = sx + 8 + k*12;
                    const bh = 25 + Math.random()*10;
                    const hue = (i*60 + j*40 + k*20) % 360;
                    ctx.fillStyle = `hsl(${hue}, 40%, 30%)`;
                    ctx.fillRect(bx, sy + (35-bh), 10, bh);
                }
            }
        }
        // 먼지 파티클 효과
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        for(let i=0; i<20; i++) {
            const px = (time * 20 + i * 100) % canvas.width;
            const py = (Math.sin(time + i) * 50 + 200);
            ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI*2); ctx.fill();
        }

    } else if (currentRound === 2) {
        // [라운드 3: 캠퍼스 중앙 광장]
        // 구름 Parallax
        ctx.fillStyle = 'rgba(255,255,255,0.8)';
        for(let i=0; i<3; i++) {
            const cx = (time * (10 + i*5) + i*400) % (canvas.width + 200) - 100;
            const cy = 50 + i*40;
            ctx.beginPath();
            ctx.arc(cx, cy, 30, 0, Math.PI*2);
            ctx.arc(cx+30, cy-10, 40, 0, Math.PI*2);
            ctx.arc(cx+70, cy, 30, 0, Math.PI*2);
            ctx.fill();
        }
        // 멀리 보이는 시계탑
        ctx.fillStyle = '#a89078';
        ctx.fillRect(600, 100, 60, GROUND_Y-100);
        ctx.fillStyle = '#8b7355';
        ctx.beginPath(); ctx.moveTo(600,100); ctx.lineTo(630,50); ctx.lineTo(660,100); ctx.fill();
        // 나무들
        for(let i=0; i<4; i++) {
            const tx = 50 + i*250 + Math.sin(time + i)*5;
            ctx.fillStyle = '#5a4a3a'; ctx.fillRect(tx, GROUND_Y-80, 20, 80);
            ctx.fillStyle = '#2d5a27';
            ctx.beginPath(); ctx.arc(tx+10, GROUND_Y-100, 50, 0, Math.PI*2); ctx.fill();
        }

    } else {
        // [라운드 4: 졸업식 무대]
        // 스포트라이트
        const spots = [200, 450, 700];
        spots.forEach((sx, idx) => {
            const sTime = time + idx;
            const targetX = sx + Math.sin(sTime) * 100;
            const grad = ctx.createLinearGradient(450, 0, targetX, GROUND_Y);
            grad.addColorStop(0, 'rgba(255,255,255,0.4)');
            grad.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(450, -50);
            ctx.lineTo(targetX - 80, GROUND_Y);
            ctx.lineTo(targetX + 80, GROUND_Y);
            ctx.fill();
        });
        // 휘날리는 꽃가루
        for(let i=0; i<30; i++) {
            const px = (i * 137) % canvas.width;
            const py = (time * 100 + i * 50) % canvas.height;
            ctx.fillStyle = `hsl(${(time*50 + i*20)%360}, 100%, 50%)`;
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(time * 5 + i);
            ctx.fillRect(-3, -3, 6, 6);
            ctx.restore();
        }
    }

    // 2. 바닥 레이어
    const groundGrad = ctx.createLinearGradient(0, GROUND_Y, 0, canvas.height);
    groundGrad.addColorStop(0, theme.ground);
    groundGrad.addColorStop(1, '#000');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);
    
    // 바닥 반사광 (Glossy effect)
    ctx.globalCompositeOperation = 'screen';
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(0, GROUND_Y, canvas.width, 20);
    ctx.globalCompositeOperation = 'source-over';

    ctx.restore();
}

// ════════════════════════════════════════════════════════
//  캐릭터 시스템 (Advanced Anatomy & Animation)
// ════════════════════════════════════════════════════════

// [공통 드로잉 유틸리티]
function drawCapsule(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x - w/2, y, w, h, w/2);
    ctx.fill();
}

// [학생 - 학생 고유 비주얼]
function drawStudentBase(w, h, state, pose) {
    const t = Date.now() * 0.005;
    const breathe = (state === 'idle') ? Math.sin(t) * 3 : 0;
    
    ctx.save();
    ctx.translate(0, breathe);

    // 1. 그림자
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(0, 5 - breathe, 30, 8, 0, 0, Math.PI*2); ctx.fill();

    // 2. 다리 & 보행 애니메이션
    const walkCycle = (state === 'walk') ? Math.sin(t * 2) : 0;
    const legW = 18;
    ctx.fillStyle = '#1a1a2e';
    // 왼쪽 다리
    ctx.save();
    ctx.translate(-12, -h*0.4);
    ctx.rotate(walkCycle * 0.4);
    drawCapsule(0, 0, legW, h*0.4, '#1a1a2e');
    ctx.fillStyle = '#000'; ctx.fillRect(-legW/2, h*0.4-5, legW+4, 10); // 신발
    ctx.restore();
    // 오른쪽 다리
    ctx.save();
    ctx.translate(12, -h*0.4);
    ctx.rotate(-walkCycle * 0.4);
    drawCapsule(0, 0, legW, h*0.4, '#1a1a2e');
    ctx.fillStyle = '#000'; ctx.fillRect(-legW/2, h*0.4-5, legW+4, 10); // 신발
    ctx.restore();

    // 3. 몸통 (Suit with depth)
    const bodyW = w - 10;
    const bodyH = h * 0.45;
    const bGrad = ctx.createLinearGradient(-bodyW/2, -h+30, bodyW/2, -h+30);
    bGrad.addColorStop(0, '#10204a');
    bGrad.addColorStop(0.5, '#1e3c72');
    bGrad.addColorStop(1, '#10204a');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.roundRect(-bodyW/2, -h+30, bodyW, bodyH, 10);
    ctx.fill();
    
    // 와이셔츠 & 넥타이
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.moveTo(-10, -h+30); ctx.lineTo(10, -h+30); ctx.lineTo(0, -h+45); ctx.fill();
    ctx.fillStyle = '#d32f2f';
    ctx.beginPath(); ctx.moveTo(0, -h+32); ctx.lineTo(-4, -h+50); ctx.lineTo(0, -h+55); ctx.lineTo(4, -h+50); ctx.fill();

    // 4. 팔
    ctx.fillStyle = '#1e3c72';
    const armW = 14;
    // 뒷팔
    ctx.save();
    ctx.translate(-bodyW/2, -h+40);
    ctx.rotate(-walkCycle * 0.3 + (pose.armL || 0));
    drawCapsule(0, 0, armW, 40, '#10204a');
    ctx.restore();
    // 앞팔
    ctx.save();
    ctx.translate(bodyW/2, -h+40);
    ctx.rotate(walkCycle * 0.3 + (pose.armR || 0));
    drawCapsule(0, 0, armW, 40, '#1e3c72');
    ctx.fillStyle = '#f5c5a0'; ctx.beginPath(); ctx.arc(0, 42, 7, 0, Math.PI*2); ctx.fill(); // 손
    ctx.restore();

    // 5. 머리 (Detailed Face)
    ctx.save();
    ctx.translate(0, -h + 15);
    ctx.rotate(pose.headRot || 0);
    // 피부
    const hGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 25);
    hGrad.addColorStop(0, '#f9d5b8'); hGrad.addColorStop(1, '#e8b895');
    ctx.fillStyle = hGrad;
    ctx.beginPath(); ctx.ellipse(0, 0, 20, 24, 0, 0, Math.PI*2); ctx.fill();
    
    // 머리카락 (입체적)
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(0, -5, 22, Math.PI, 0); ctx.fill(); // 윗머리
    ctx.fillRect(-22, -5, 6, 15); ctx.fillRect(16, -5, 6, 15); // 옆머리
    ctx.beginPath(); ctx.moveTo(-20, -5); ctx.lineTo(0, 10); ctx.lineTo(20, -5); ctx.fill(); // 앞머리

    // 눈 (상태별)
    const eyeY = 2;
    ctx.fillStyle = (state === 'hurt') ? '#666' : '#fff';
    ctx.beginPath(); ctx.ellipse(-8, eyeY, 5, (state==='hurt'?1:5), 0, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(8, eyeY, 5, (state==='hurt'?1:5), 0, 0, Math.PI*2); ctx.fill();
    if(state !== 'hurt') {
        ctx.fillStyle = '#1e88e5';
        ctx.beginPath(); ctx.arc(-8, eyeY, 2.5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(8, eyeY, 2.5, 0, Math.PI*2); ctx.fill();
    }
    
    // 입
    ctx.strokeStyle = '#a67c52'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(0, 12, 4, 0.2, Math.PI-0.2); ctx.stroke();
    
    ctx.restore();
    ctx.restore();
}

// [교수 - 교수 고유 비주얼]
function drawProfBase(w, h, state, pose) {
    const t = Date.now() * 0.005;
    const breathe = (state === 'idle') ? Math.sin(t) * 2.5 : 0;
    
    ctx.save();
    ctx.translate(0, breathe);

    // 1. 그림자
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath(); ctx.ellipse(0, 5 - breathe, 35, 10, 0, 0, Math.PI*2); ctx.fill();

    // 2. 다리
    const walkCycle = (state === 'walk') ? Math.sin(t * 1.8) : 0;
    ctx.fillStyle = '#050510';
    // 왼다리
    ctx.save(); ctx.translate(-14, -h*0.35); ctx.rotate(walkCycle * 0.3);
    drawCapsule(0, 0, 20, h*0.35, '#050510'); ctx.fillStyle = '#4a3a2a'; ctx.fillRect(-10, h*0.35-5, 24, 10); ctx.restore();
    // 오른다리
    ctx.save(); ctx.translate(14, -h*0.35); ctx.rotate(-walkCycle * 0.3);
    drawCapsule(0, 0, 20, h*0.35, '#050510'); ctx.fillStyle = '#4a3a2a'; ctx.fillRect(-10, h*0.35-5, 24, 10); ctx.restore();

    // 3. 몸통 (Suit with vest)
    const bodyW = w - 4;
    const bodyH = h * 0.5;
    const sGrad = ctx.createLinearGradient(-bodyW/2, -h+30, bodyW/2, -h+30);
    sGrad.addColorStop(0, '#1a1a1a'); sGrad.addColorStop(0.5, '#333'); sGrad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = sGrad;
    ctx.beginPath(); ctx.roundRect(-bodyW/2, -h+30, bodyW, bodyH, 8); ctx.fill();
    
    // 셔츠 & 넥타이
    ctx.fillStyle = '#eee'; ctx.fillRect(-10, -h+30, 20, 25);
    ctx.fillStyle = '#0d47a1'; ctx.beginPath(); ctx.moveTo(0, -h+32); ctx.lineTo(-4, -h+55); ctx.lineTo(0, -h+62); ctx.lineTo(4, -h+55); ctx.fill();

    // 4. 팔
    ctx.fillStyle = '#222';
    // 뒷팔
    ctx.save(); ctx.translate(-bodyW/2, -h+40); ctx.rotate(-walkCycle * 0.2 + (pose.armL || 0));
    drawCapsule(0, 0, 16, 45, '#111'); ctx.restore();
    // 앞팔
    ctx.save(); ctx.translate(bodyW/2, -h+40); ctx.rotate(walkCycle * 0.2 + (pose.armR || 0));
    drawCapsule(0, 0, 16, 45, '#222'); ctx.fillStyle = '#d4a574'; ctx.beginPath(); ctx.arc(0, 47, 9, 0, Math.PI*2); ctx.fill(); ctx.restore();

    // 5. 머리 (Bald with glasses)
    ctx.save();
    ctx.translate(0, -h + 12);
    ctx.rotate(pose.headRot || 0);
    const hGrad = ctx.createRadialGradient(0, 0, 5, 0, 0, 28);
    hGrad.addColorStop(0, '#d4a574'); hGrad.addColorStop(1, '#b68a5d');
    ctx.fillStyle = hGrad;
    ctx.beginPath(); ctx.ellipse(0, 0, 22, 26, 0, 0, Math.PI*2); ctx.fill();
    
    // 대머리 광택
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath(); ctx.ellipse(-5, -10, 10, 6, -0.4, 0, Math.PI*2); ctx.fill();
    
    // 안경
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
    ctx.strokeRect(-12, 0, 10, 8); ctx.strokeRect(2, 0, 10, 8);
    ctx.beginPath(); ctx.moveTo(-2, 4); ctx.lineTo(2, 4); ctx.stroke();

    // 눈 (Glasses glint)
    ctx.fillStyle = (state === 'hurt') ? '#ff4444' : '#fff';
    ctx.fillRect(-10, 2, 6, 4); ctx.fillRect(4, 2, 6, 4);

    // 수염
    ctx.strokeStyle = '#888'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-15, 12); ctx.quadraticCurveTo(0, 18, 15, 12); ctx.stroke();

    ctx.restore();
    ctx.restore();
}

// ════════════════════════════════════════════════════════
//  상태별 애니메이션 래퍼 (학생)
// ════════════════════════════════════════════════════════

function drawStudentIdle_Premium(w, h) {
    drawStudentBase(w, h, 'idle', {});
}

function drawStudentWalk_Premium(w, h) {
    drawStudentBase(w, h, 'walk', {});
}

function drawStudentJump_Premium(w, h) {
    drawStudentBase(w, h, 'jump', { headRot: -0.2, armL: 0.5, armR: -0.5 });
}

function drawStudentAttack_Premium(w, h, type) {
    let pose = {};
    if (type === 'normal' || type === 'heavy') {
        pose = { armR: -1.8, headRot: 0.1 };
    } else if (type === 'kick') {
        pose = { armL: 0.5, armR: 0.5, headRot: -0.1 };
    } else if (type === 'special') {
        pose = { armR: -2.2, headRot: 0.2 };
        // 필살기 오라
        ctx.shadowColor = '#ffeb3b'; ctx.shadowBlur = 30;
    }
    drawStudentBase(w, h, 'attack', pose);
    ctx.shadowBlur = 0;
}

function drawStudentHurt_Premium(w, h) {
    ctx.save();
    ctx.translate((Math.random()-0.5)*10, 0);
    drawStudentBase(w, h, 'hurt', { headRot: 0.4, armL: 1, armR: 1 });
    ctx.restore();
}

function drawStudentGuard_Premium(w, h) {
    drawStudentBase(w, h, 'guard', { armL: -1.2, armR: -1.2, headRot: 0.1 });
    // 방어막 효과
    ctx.strokeStyle = 'rgba(100,200,255,0.6)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, -h/2, w+10, -1, 1); ctx.stroke();
}

function drawStudentDown_Premium(w, h) {
    ctx.save();
    ctx.rotate(Math.PI/2);
    ctx.translate(h/2, 0);
    drawStudentBase(w, h, 'hurt', {});
    ctx.restore();
}

// ════════════════════════════════════════════════════════
//  상태별 애니메이션 래퍼 (교수)
// ════════════════════════════════════════════════════════

function drawProfIdle_Premium(w, h) {
    drawProfBase(w, h, 'idle', {});
}

function drawProfWalk_Premium(w, h) {
    drawProfBase(w, h, 'walk', {});
}

function drawProfJump_Premium(w, h) {
    drawProfBase(w, h, 'jump', { headRot: -0.1, armL: 0.3, armR: -0.3 });
}

function drawProfAttack_Premium(w, h, type) {
    let pose = {};
    if (type === 'normal') pose = { armL: 1.5, headRot: -0.1 };
    else if (type === 'heavy') pose = { armL: 1.8, headRot: -0.2 };
    else if (type === 'kick') pose = { armL: 0.5, armR: 0.5 };
    else if (type === 'rush') {
        pose = { armL: 1.2, armR: 1.2 };
        ctx.shadowColor = '#f44336'; ctx.shadowBlur = 20;
    }
    drawProfBase(w, h, 'attack', pose);
    ctx.shadowBlur = 0;
}

function drawProfHurt_Premium(w, h) {
    ctx.save();
    ctx.translate((Math.random()-0.5)*8, 0);
    drawProfBase(w, h, 'hurt', { headRot: -0.3, armL: -1, armR: -1 });
    ctx.restore();
}

function drawProfGuard_Premium(w, h) {
    drawProfBase(w, h, 'guard', { armL: 0.8, armR: 0.8 });
    ctx.strokeStyle = 'rgba(255,100,100,0.6)'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(0, -h/2, w+15, Math.PI-1, Math.PI+1); ctx.stroke();
}

function drawProfDown_Premium(w, h) {
    ctx.save();
    ctx.rotate(-Math.PI/2);
    ctx.translate(-h/2, 0);
    drawProfBase(w, h, 'hurt', {});
    ctx.restore();
}

// ════════════════════════════════════════════════════════
//  이펙트 시스템 (Particle & Screen FX)
// ════════════════════════════════════════════════════════

function spawnHitEffect_Premium(x, y, type = 'normal') {
    const count = type === 'special' ? 30 : (type === 'strong' ? 15 : 8);
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        particles.push({
            x: x, y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            alpha: 1,
            life: 30 + Math.random() * 20,
            r: 2 + Math.random() * 4,
            color: type === 'special' ? '#ffeb3b' : (type === 'strong' ? '#ff5722' : '#fff')
        });
    }
}

function drawHitEffects_Premium() {
    // 입자 그리기
    particles.forEach((p, idx) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        ctx.restore();
        
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;
        p.life--;
        if (p.life <= 0) particles.splice(idx, 1);
    });
}

console.log('💎 Ultra Premium Graphics System Loaded');
