// ================================================
//  고퀄리티 그래픽 업그레이드 패치
//  원본 game.js의 다음 함수들을 교체합니다:
//  1. drawBackground & drawBgDecoration
//  2. 캐릭터 그리기 함수들
//  3. 공격 이펙트
// ================================================

// ════════════════════════════════════════════════════════
//  고급 배경 그리기 (초고퀄리티)
// ════════════════════════════════════════════════════════
function drawBackground_Premium() {
    drawBgDecoration_Premium(BG_THEMES[currentRound]);
}

function drawBgDecoration_Premium(theme) {
    ctx.save();

    if (currentRound === 0) {
        // ────────── 라운드 1: 강의실 ──────────
        // 천장 (밝고 깨끗함)
        const ceilingGrad = ctx.createLinearGradient(0, 0, 0, 80);
        ceilingGrad.addColorStop(0, '#ffffff');
        ceilingGrad.addColorStop(1, '#f5f5f5');
        ctx.fillStyle = ceilingGrad;
        ctx.fillRect(0, 0, canvas.width, 80);

        // 형광등 (더 밝은 빛)
        for (let i = 0; i < 4; i++) {
            const x = 50 + i * 220;
            // 빛 후광
            ctx.fillStyle = 'rgba(255, 255, 200, 0.6)';
            ctx.fillRect(x, 20, 140, 25);
            // 형광등 본체
            const lampGrad = ctx.createLinearGradient(x, 20, x, 45);
            lampGrad.addColorStop(0, '#fffef0');
            lampGrad.addColorStop(0.5, '#fffde0');
            lampGrad.addColorStop(1, '#fffef0');
            ctx.fillStyle = lampGrad;
            ctx.shadowColor = '#ffff99';
            ctx.shadowBlur = 30;
            ctx.fillRect(x, 20, 140, 25);
            ctx.shadowBlur = 0;
        }

        // 칠판 (선명한 초록색)
        const boardGrad = ctx.createLinearGradient(150, 70, 150, 200);
        boardGrad.addColorStop(0, '#2d5a2d');
        boardGrad.addColorStop(1, '#1a3a1a');
        ctx.fillStyle = boardGrad;
        ctx.shadowColor = '#00000077';
        ctx.shadowBlur = 10;
        ctx.fillRect(140, 70, 620, 160);
        ctx.shadowBlur = 0;

        // 칠판 테두리 (목재)
        ctx.fillStyle = '#a8825a';
        ctx.fillRect(140, 70, 620, 8);
        ctx.fillRect(140, 222, 620, 8);
        ctx.fillRect(140, 70, 8, 160);
        ctx.fillRect(752, 70, 8, 160);
        
        // 칠판 글씨 (노란색)
        ctx.fillStyle = '#ffff99';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('교수님 도장깨기', 450, 130);
        ctx.font = '14px Arial';
        ctx.fillText('Round ' + (currentRound + 1), 450, 160);

        // 벽면 (흰색 오른쪽 상단)
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, 80, canvas.width, GROUND_Y - 80);

        // 문
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(canvas.width - 90, 200, 70, 150);
        ctx.fillStyle = '#c4b5a0';
        ctx.fillRect(canvas.width - 85, 205, 60, 140);
        ctx.fillStyle = '#8b7355';
        ctx.beginPath();
        ctx.arc(canvas.width - 25, 275, 5, 0, Math.PI * 2);
        ctx.fill();
    } else if (currentRound === 1) {
        // ────────── 라운드 2: 도서관 (밝고 따뜻함) ──────────
        // 배경
        ctx.fillStyle = '#f5f1e6';
        ctx.fillRect(0, 50, canvas.width, GROUND_Y - 50);

        // 책장 (진갈색)
        ctx.fillStyle = '#8b6f47';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(i * 180, 50, 160, GROUND_Y - 100);
            // 책등 (다양한 색상)
            const colors = ['#c54a3a', '#3d5f8a', '#8b5a2b', '#556b2f', '#8b0000'];
            for (let j = 0; j < 4; j++) {
                ctx.fillStyle = colors[j];
                ctx.fillRect(i * 180 + 15, 65 + j * 40, 130, 35);
            }
        }
        
        // 책장 테두리
        ctx.strokeStyle = '#6b5a3f';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.strokeRect(i * 180, 50, 160, GROUND_Y - 100);
            for (let j = 0; j < 4; j++) {
                ctx.strokeRect(i * 180 + 15, 65 + j * 40, 130, 35);
            }
        }

        // 독서 조명 (따뜻한 황색)
        ctx.fillStyle = 'rgba(255, 220, 100, 0.35)';
        ctx.beginPath();
        ctx.ellipse(450, 200, 250, 120, 0, 0, Math.PI * 2);
        ctx.fill();
    } else if (currentRound === 2) {
        // ────────── 라운드 3: 캠퍼스 광장 (맑은 하늘) ──────────
        // 잔디 (진한 초록)
        ctx.fillStyle = '#4a8a3f';
        ctx.fillRect(0, GROUND_Y - 50, canvas.width, 50);
        
        // 잔디 무늬 (명확함)
        ctx.strokeStyle = 'rgba(100, 200, 80, 0.6)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
            for (let y = GROUND_Y - 50; y < GROUND_Y; y += 15) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.quadraticCurveTo(x + 12, y - 6, x + 24, y);
                ctx.stroke();
            }
        }

        // 왼쪽 건물 (벽돌색)
        ctx.fillStyle = '#d97555';
        ctx.fillRect(0, 100, 200, GROUND_Y - 100);
        ctx.fillStyle = '#c85a45';
        ctx.fillRect(0, 100, 200, GROUND_Y - 100);

        // 건물 창문 (밝은 파란색)
        ctx.fillStyle = '#87ceeb';
        for (let floor = 0; floor < 5; floor++) {
            for (let col = 0; col < 3; col++) {
                ctx.strokeStyle = '#444';
                ctx.lineWidth = 1;
                ctx.fillRect(20 + col * 55, 115 + floor * 50, 40, 35);
                ctx.strokeRect(20 + col * 55, 115 + floor * 50, 40, 35);
                // 창 십자가
                ctx.beginPath();
                ctx.moveTo(40 + col * 55, 115 + floor * 50);
                ctx.lineTo(40 + col * 55, 150 + floor * 50);
                ctx.moveTo(20 + col * 55, 132 + floor * 50);
                ctx.lineTo(60 + col * 55, 132 + floor * 50);
                ctx.stroke();
            }
        }

        // 오른쪽 건물
        ctx.fillStyle = '#b8956a';
        ctx.fillRect(canvas.width - 200, 130, 200, GROUND_Y - 130);

        // 중앙 광장 포장도로
        ctx.fillStyle = '#d4c5a9';
        ctx.fillRect(220, GROUND_Y - 65, 460, 65);
        
        // 광장 점선
        ctx.strokeStyle = '#999';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(220, GROUND_Y - 33);
        ctx.lineTo(680, GROUND_Y - 33);
        ctx.stroke();
        ctx.setLineDash([]);
    } else if (currentRound === 3) {
        // ────────── 라운드 4: 졸업식장 (화려함) ──────────
        // 무대 (진한 빨강)
        ctx.fillStyle = '#a00000';
        ctx.fillRect(0, GROUND_Y - 80, canvas.width, 80);
        
        // 무대 카펫
        ctx.fillStyle = '#cc0000';
        ctx.fillRect(100, GROUND_Y - 75, canvas.width - 200, 75);

        // 무대 강조선 (황금색)
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y - 40);
        ctx.lineTo(canvas.width, GROUND_Y - 40);
        ctx.stroke();

        // 스포트라이트 (밝은 노란색)
        for (let i = 0; i < 3; i++) {
            const xs = canvas.width / 2 + (i - 1) * 220;
            
            // 큰 후광
            ctx.fillStyle = `rgba(255, 255, 150, ${0.25 - i * 0.05})`;
            ctx.beginPath();
            ctx.moveTo(xs, -20);
            ctx.lineTo(xs - 120, GROUND_Y);
            ctx.lineTo(xs + 120, GROUND_Y);
            ctx.closePath();
            ctx.fill();

            // 작은 핵심 빛
            ctx.fillStyle = `rgba(255, 255, 100, ${0.4 - i * 0.08})`;
            ctx.beginPath();
            ctx.moveTo(xs, 0);
            ctx.lineTo(xs - 60, GROUND_Y - 80);
            ctx.lineTo(xs + 60, GROUND_Y - 80);
            ctx.closePath();
            ctx.fill();
        }

        // 졸업식 텍스트 배경
        ctx.fillStyle = 'rgba(200, 50, 200, 0.2)';
        ctx.fillRect(250, 60, 400, 60);

        // 축하 텍스트
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 10;
        ctx.fillText('🎓 최강의 학생 🎓', canvas.width / 2, 90);
        ctx.shadowBlur = 0;
    }

    ctx.restore();
}

// ════════════════════════════════════════════════════════
//  고급 캐릭터 그리기 - 학생
// ════════════════════════════════════════════════════════
function drawStudentIdle_Premium(w, h) {
    // 그림자 (발 아래)
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, 5, 25, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 다리 (정장st)
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-w / 2 + 10, -h * 0.4, 16, h * 0.4);
    ctx.fillRect(w / 2 - 26, -h * 0.4, 16, h * 0.4);

    // 신발 (반짝임)
    ctx.fillStyle = '#000';
    ctx.fillRect(-w / 2 + 8, -8, 20, 10);
    ctx.fillRect(w / 2 - 28, -8, 20, 10);
    ctx.fillStyle = '#333';
    ctx.fillRect(-w / 2 + 10, -6, 4, 4);
    ctx.fillRect(w / 2 - 24, -6, 4, 4);

    // 몸통 (교복 - 그라데이션)
    const bodyGrad = ctx.createLinearGradient(-w / 2, -h + 35, w / 2, -h + 35);
    bodyGrad.addColorStop(0, '#0d1f7a');
    bodyGrad.addColorStop(0.5, '#1a3a6a');
    bodyGrad.addColorStop(1, '#0d1f7a');
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(-w / 2 + 5, -h + 35, w - 10, h * 0.4);

    // 교복 주름 (사실적)
    ctx.strokeStyle = '#0a1a4a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 10, -h + 35);
    ctx.quadraticCurveTo(-w / 2 + 20, -h + 20, -w / 2 + 22, 0);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2 - 10, -h + 35);
    ctx.quadraticCurveTo(w / 2 - 20, -h + 20, w / 2 - 22, 0);
    ctx.stroke();

    // 넥타이
    ctx.fillStyle = '#cc2200';
    ctx.beginPath();
    ctx.moveTo(0, -h + 30);
    ctx.lineTo(-6, -h + 48);
    ctx.lineTo(0, -h + 53);
    ctx.lineTo(6, -h + 48);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#990000';
    ctx.beginPath();
    ctx.moveTo(0, -h + 35);
    ctx.lineTo(-3, -h + 43);
    ctx.lineTo(0, -h + 45);
    ctx.lineTo(3, -h + 43);
    ctx.closePath();
    ctx.fill();

    // 팔
    ctx.fillStyle = '#1a3a6a';
    ctx.fillRect(-w / 2 - 2, -h + 35, 14, 40);
    ctx.fillRect(w / 2 - 12, -h + 35, 14, 40);

    // 손
    ctx.fillStyle = '#f5c5a0';
    ctx.beginPath();
    ctx.ellipse(-w / 2 + 5, -h + 76, 8, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(w / 2 - 7, -h + 76, 8, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // 머리 (사실적)
    const headGrad = ctx.createRadialGradient(0, -h + 10, 5, 0, -h + 10, 22);
    headGrad.addColorStop(0, '#f9d5b8');
    headGrad.addColorStop(1, '#e8b895');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 20, 23, 0, 0, Math.PI * 2);
    ctx.fill();

    // 머리카락 (앞)
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -h + 3, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 머리카락 (옆)
    ctx.fillRect(-22, -h + 8, 6, 15);
    ctx.fillRect(16, -h + 8, 6, 15);

    // 눈과 코
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-7, -h + 12, 5, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(7, -h + 12, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 눈동자
    ctx.fillStyle = '#1a5a9a';
    ctx.beginPath();
    ctx.arc(-7, -h + 12, 2.5, 0, Math.PI * 2);
    ctx.arc(7, -h + 12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 눈 하이라이트
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-6, -h + 11, 1, 0, Math.PI * 2);
    ctx.arc(8, -h + 11, 1, 0, Math.PI * 2);
    ctx.fill();

    // 코
    ctx.fillStyle = '#e8b895';
    ctx.beginPath();
    ctx.moveTo(0, -h + 14);
    ctx.lineTo(-1, -h + 18);
    ctx.lineTo(1, -h + 18);
    ctx.closePath();
    ctx.fill();

    // 입
    ctx.strokeStyle = '#d99a7c';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -h + 21, 4, 0, Math.PI);
    ctx.stroke();
}

function drawStudentAttack_Premium(w, h, type) {
    // 그림자
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, 5, 25, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 다리 (고정)
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-w / 2 + 10, -h * 0.4, 16, h * 0.4);
    ctx.fillRect(w / 2 - 26, -h * 0.4, 16, h * 0.4);

    // 신발
    ctx.fillStyle = '#000';
    ctx.fillRect(-w / 2 + 8, -8, 20, 10);
    ctx.fillRect(w / 2 - 28, -8, 20, 10);

    // 몸통 (회전 없이 정면)
    const bodyGrad = ctx.createLinearGradient(-w / 2, -h + 35, w / 2, -h + 35);
    bodyGrad.addColorStop(0, '#0d1f7a');
    bodyGrad.addColorStop(0.5, '#1a3a6a');
    bodyGrad.addColorStop(1, '#0d1f7a');
    ctx.fillStyle = bodyGrad;
    ctx.fillRect(-w / 2 + 5, -h + 35, w - 10, h * 0.4);

    // 넥타이
    ctx.fillStyle = '#cc2200';
    ctx.beginPath();
    ctx.moveTo(0, -h + 30);
    ctx.lineTo(-6, -h + 48);
    ctx.lineTo(0, -h + 53);
    ctx.lineTo(6, -h + 48);
    ctx.closePath();
    ctx.fill();

    // 왼쪽 팔 (방어 자세)
    ctx.fillStyle = '#1a3a6a';
    ctx.save();
    ctx.translate(-w / 2, -h + 35);
    ctx.rotate(0.5);
    ctx.fillRect(0, 0, 14, 42);
    ctx.restore();

    // 머리 (공격 표정)
    const headGrad = ctx.createRadialGradient(0, -h + 10, 5, 0, -h + 10, 22);
    headGrad.addColorStop(0, '#f9d5b8');
    headGrad.addColorStop(1, '#e8b895');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 20, 23, 0, 0, Math.PI * 2);
    ctx.fill();

    // 머리카락
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -h + 3, 20, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-22, -h + 8, 6, 15);
    ctx.fillRect(16, -h + 8, 6, 15);

    // 눈 (결정적)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-7, -h + 12, 5, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(7, -h + 12, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a5a9a';
    ctx.beginPath();
    ctx.arc(-7, -h + 12, 2.5, 0, Math.PI * 2);
    ctx.arc(7, -h + 12, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(-6, -h + 11, 1, 0, Math.PI * 2);
    ctx.arc(8, -h + 11, 1, 0, Math.PI * 2);
    ctx.fill();

    // 공격 팔 (한쪽만!)
    ctx.fillStyle = '#1a3a6a';
    ctx.save();
    ctx.translate(w / 2 - 8, -h + 38);
    ctx.rotate(-0.5);
    ctx.fillRect(-8, 0, 16, 55);
    ctx.restore();

    // 주먹
    const fistGrad = ctx.createRadialGradient(w / 2 + 35, -h - 8, 3, w / 2 + 35, -h - 8, 14);
    fistGrad.addColorStop(0, '#f5c5a0');
    fistGrad.addColorStop(1, '#d4956f');
    ctx.fillStyle = fistGrad;
    ctx.beginPath();
    ctx.ellipse(w / 2 + 35, -h - 8, 13, 13, -0.5, 0, Math.PI * 2);
    ctx.fill();

    // 공격 광선 이펙트
    if (type === 'punch') {
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(255, 221, 0, ${0.5 - i * 0.1})`;
            ctx.lineWidth = 3 - i * 0.4;
            ctx.beginPath();
            ctx.moveTo(w / 2 + 10, -h + 35);
            ctx.lineTo(w / 2 + 45 + i * 10, -h - 8 - i * 4);
            ctx.stroke();
        }
    } else if (type === 'kick') {
        // 킥: 다리를 든다
        ctx.fillStyle = '#1a1a2e';
        ctx.save();
        ctx.translate(w / 2 - 10, -h + 15);
        ctx.rotate(-0.6);
        ctx.fillRect(-8, 0, 16, 50);
        ctx.restore();

        // 발
        ctx.fillStyle = '#000';
        ctx.save();
        ctx.translate(w / 2 + 25, -h - 15);
        ctx.rotate(-0.6);
        ctx.fillRect(-10, 0, 20, 12);
        ctx.restore();

        // 킥 이펙트
        for (let i = 0; i < 5; i++) {
            ctx.strokeStyle = `rgba(100, 200, 255, ${0.5 - i * 0.1})`;
            ctx.lineWidth = 3 - i * 0.4;
            ctx.beginPath();
            ctx.moveTo(w / 2, -h + 20);
            ctx.lineTo(w / 2 + 50 + i * 12, -h - 20 - i * 5);
            ctx.stroke();
        }
    }
}

// ════════════════════════════════════════════════════════
//  고급 캐릭터 그리기 - 교수
// ════════════════════════════════════════════════════════
function drawProfIdle_Premium(w, h) {
    // 그림자
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, 5, 28, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 다리 (검은 팬츠)
    ctx.fillStyle = '#000';
    ctx.fillRect(-w / 2 + 10, -h * 0.4, 18, h * 0.4);
    ctx.fillRect(w / 2 - 28, -h * 0.4, 18, h * 0.4);

    // 신발 (밝은 갈색)
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(-w / 2 + 8, -8, 22, 10);
    ctx.fillRect(w / 2 - 30, -8, 22, 10);

    // 몸통 (수트)
    const suitGrad = ctx.createLinearGradient(-w / 2, -h + 35, w / 2, -h + 35);
    suitGrad.addColorStop(0, '#1a1a1a');
    suitGrad.addColorStop(0.5, '#2a2a2a');
    suitGrad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = suitGrad;
    ctx.fillRect(-w / 2 + 3, -h + 35, w - 6, h * 0.45);

    // 셔츠
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(-w / 2 + 8, -h + 35, w - 16, 25);

    // 넥타이
    ctx.fillStyle = '#003366';
    ctx.beginPath();
    ctx.moveTo(0, -h + 30);
    ctx.lineTo(-5, -h + 50);
    ctx.lineTo(0, -h + 58);
    ctx.lineTo(5, -h + 50);
    ctx.closePath();
    ctx.fill();

    // 팔
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(-w / 2 - 3, -h + 35, 16, 42);
    ctx.fillRect(w / 2 - 13, -h + 35, 16, 42);

    // 손 (오동통한)
    ctx.fillStyle = '#d4a574';
    ctx.beginPath();
    ctx.ellipse(-w / 2 + 5, -h + 78, 10, 10, 0, 0, Math.PI * 2);
    ctx.ellipse(w / 2 - 5, -h + 78, 10, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // 머리 (둥근 대머리 & 옆머리)
    const headGrad = ctx.createRadialGradient(0, -h + 8, 4, 0, -h + 8, 26);
    headGrad.addColorStop(0, '#c4a474');
    headGrad.addColorStop(1, '#9a7a54');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 22, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // 대머리 반짝임
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(-5, -h + 5, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // 옆머리
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(-24, -h + 8, 8, 15);
    ctx.fillRect(16, -h + 8, 8, 15);

    // 눈과 눈썹
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(-7, -h + 12, 5, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(7, -h + 12, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 눈동자
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-7, -h + 12, 2.5, 0, Math.PI * 2);
    ctx.arc(7, -h + 12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 눈썹
    ctx.strokeStyle = '#4a3a2a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-11, -h + 9);
    ctx.quadraticCurveTo(-7, -h + 7, -3, -h + 9);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3, -h + 9);
    ctx.quadraticCurveTo(7, -h + 7, 11, -h + 9);
    ctx.stroke();

    // 코
    ctx.fillStyle = '#9a7a54';
    ctx.beginPath();
    ctx.moveTo(0, -h + 14);
    ctx.lineTo(-1.5, -h + 18);
    ctx.lineTo(1.5, -h + 18);
    ctx.closePath();
    ctx.fill();

    // 입 (엄한 표정)
    ctx.strokeStyle = '#8a6a44';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-4, -h + 21);
    ctx.lineTo(4, -h + 21);
    ctx.stroke();
}

function drawProfAttack_Premium(w, h, type) {
    // 그림자
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(0, 5, 28, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 다리 (고정)
    ctx.fillStyle = '#000';
    ctx.fillRect(-w / 2 + 10, -h * 0.4, 18, h * 0.4);
    ctx.fillRect(w / 2 - 28, -h * 0.4, 18, h * 0.4);

    // 신발
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(-w / 2 + 8, -8, 22, 10);
    ctx.fillRect(w / 2 - 30, -8, 22, 10);

    // 몸통 (수트)
    const suitGrad = ctx.createLinearGradient(-w / 2, -h + 35, w / 2, -h + 35);
    suitGrad.addColorStop(0, '#1a1a1a');
    suitGrad.addColorStop(0.5, '#2a2a2a');
    suitGrad.addColorStop(1, '#1a1a1a');
    ctx.fillStyle = suitGrad;
    ctx.fillRect(-w / 2 + 3, -h + 35, w - 6, h * 0.45);

    // 셔츠
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(-w / 2 + 8, -h + 35, w - 16, 25);

    // 넥타이
    ctx.fillStyle = '#003366';
    ctx.beginPath();
    ctx.moveTo(0, -h + 30);
    ctx.lineTo(-5, -h + 50);
    ctx.lineTo(0, -h + 58);
    ctx.lineTo(5, -h + 50);
    ctx.closePath();
    ctx.fill();

    // 왼쪽 팔 (방어)
    ctx.fillStyle = '#2a2a2a';
    ctx.save();
    ctx.translate(-w / 2, -h + 35);
    ctx.rotate(0.6);
    ctx.fillRect(0, 0, 16, 45);
    ctx.restore();

    // 머리 (화난 표정)
    const headGrad = ctx.createRadialGradient(0, -h + 8, 4, 0, -h + 8, 26);
    headGrad.addColorStop(0, '#c4a474');
    headGrad.addColorStop(1, '#9a7a54');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 22, 25, 0, 0, Math.PI * 2);
    ctx.fill();

    // 대머리 반짝임
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.beginPath();
    ctx.ellipse(-5, -h + 5, 8, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // 옆머리
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(-24, -h + 8, 8, 15);
    ctx.fillRect(16, -h + 8, 8, 15);

    // 눈과 눈썹 (화난)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.ellipse(-7, -h + 12, 5, 4, 0, 0, Math.PI * 2);
    ctx.ellipse(7, -h + 12, 5, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(-7, -h + 12, 2.5, 0, Math.PI * 2);
    ctx.arc(7, -h + 12, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 눈썹 (화난 표정)
    ctx.strokeStyle = '#4a3a2a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-11, -h + 8);
    ctx.quadraticCurveTo(-7, -h + 6, -3, -h + 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(3, -h + 8);
    ctx.quadraticCurveTo(7, -h + 6, 11, -h + 8);
    ctx.stroke();

    // 정강한 공격 팔 (한쪽만!)
    ctx.fillStyle = '#d4a574';
    ctx.save();
    ctx.translate(-w / 2 - 12, -h + 38);
    ctx.rotate(-0.5);
    ctx.fillRect(-10, 0, 20, 60);
    ctx.restore();

    // 강력한 주먹
    const fistGrad = ctx.createRadialGradient(-w / 2 - 35, -h - 10, 4, -w / 2 - 35, -h - 10, 16);
    fistGrad.addColorStop(0, '#d4a574');
    fistGrad.addColorStop(1, '#9a7a54');
    ctx.fillStyle = fistGrad;
    ctx.beginPath();
    ctx.ellipse(-w / 2 - 35, -h - 10, 15, 15, -0.5, 0, Math.PI * 2);
    ctx.fill();

    // 강력한 공격 이펙트 (빨간색)
    for (let i = 0; i < 6; i++) {
        ctx.strokeStyle = `rgba(255, 80, 80, ${0.6 - i * 0.1})`;
        ctx.lineWidth = 4 - i * 0.6;
        ctx.beginPath();
        ctx.moveTo(-w / 2, -h + 35);
        ctx.lineTo(-w / 2 - 50 - i * 12, -h + 5 - i * 5);
        ctx.stroke();
    }
}

// ════════════════════════════════════════════════════════
//  고급 공격 이펙트
// ════════════════════════════════════════════════════════
function spawnHitEffect_Premium(x, y, type = 'normal') {
    if (type === 'normal') {
        // 일반 공격 이펙트
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 * i) / 8;
            particles.push({
                x: x + Math.cos(angle) * 5,
                y: y + Math.sin(angle) * 5,
                vx: Math.cos(angle) * 3,
                vy: Math.sin(angle) * 3,
                alpha: 1,
                color: i % 2 === 0 ? '#ffdd00' : '#ffff99',
                r: 6,
                life: 40
            });
        }
    } else if (type === 'strong') {
        // 강공격 이펙트 (더 큰 범위)
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            particles.push({
                x: x + Math.cos(angle) * 8,
                y: y + Math.sin(angle) * 8,
                vx: Math.cos(angle) * 4.5,
                vy: Math.sin(angle) * 4.5,
                alpha: 1,
                color: i % 3 === 0 ? '#ff6600' : '#ffaa00',
                r: 8,
                life: 50
            });
        }
    } else if (type === 'special') {
        // 필살기 이펙트 (폭발)
        for (let i = 0; i < 16; i++) {
            const angle = (Math.PI * 2 * i) / 16;
            particles.push({
                x: x + Math.cos(angle) * 10,
                y: y + Math.sin(angle) * 10,
                vx: Math.cos(angle) * 6,
                vy: Math.sin(angle) * 6,
                alpha: 1,
                color: ['#ff00ff', '#ff66ff', '#ffff00'][Math.floor(Math.random() * 3)],
                r: 10,
                life: 60
            });
        }
    }

    // 충격 이펙트 원
    hitEffects.push({
        x: x,
        y: y,
        r: 5,
        alpha: 1,
        life: 20,
        color: type === 'strong' ? '#ff6600' : type === 'special' ? '#ff00ff' : '#ffdd00'
    });
}

function drawHitEffects_Premium() {
    hitEffects.forEach(h => {
        ctx.save();
        ctx.globalAlpha = Math.max(h.alpha, 0);
        ctx.strokeStyle = h.color || '#ffdd00';
        ctx.lineWidth = 4;
        ctx.shadowColor = h.color || '#ffdd00';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
        ctx.stroke();
        
        // 외부 링
        ctx.lineWidth = 2;
        ctx.globalAlpha = Math.max(h.alpha * 0.5, 0);
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.r + 8, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.restore();
    });
}

// ════════════════════════════════════════════════════════
//  다른 상태의 캐릭터 (간편 버전)
// ════════════════════════════════════════════════════════

// 학생 - 걷기
function drawStudentWalk_Premium(w, h) {
    const t = Date.now() * 0.01;
    ctx.save();
    ctx.translate(0, Math.sin(t) * 3);
    drawStudentIdle_Premium(w, h);
    ctx.restore();
}

// 학생 - 점프
function drawStudentJump_Premium(w, h) {
    ctx.save();
    ctx.translate(0, -15);
    drawStudentIdle_Premium(w, h);
    ctx.restore();
}

// 학생 - 피격
function drawStudentHurt_Premium(w, h) {
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = 'rgba(255, 100, 100, 0.3)';
    ctx.fillRect(-w / 2 - 30, -h - 10, w + 60, h + 20);
    ctx.globalAlpha = 1;
    drawStudentIdle_Premium(w, h);
}

// 학생 - 방어
function drawStudentGuard_Premium(w, h) {
    drawStudentIdle_Premium(w, h);
    ctx.save();
    ctx.fillStyle = 'rgba(100, 150, 255, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, -h / 2, w / 2 + 20, h / 2 + 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6699ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

// 학생 - 다운
function drawStudentDown_Premium(w, h) {
    ctx.save();
    ctx.rotate(0.3);
    ctx.translate(0, 30);
    ctx.globalAlpha = 0.7;
    drawStudentIdle_Premium(w, h);
    ctx.restore();
}

// 교수 - 걷기
function drawProfWalk_Premium(w, h) {
    const t = Date.now() * 0.01;
    ctx.save();
    ctx.translate(0, Math.sin(t) * 2);
    drawProfIdle_Premium(w, h);
    ctx.restore();
}

// 교수 - 점프
function drawProfJump_Premium(w, h) {
    ctx.save();
    ctx.translate(0, -18);
    drawProfIdle_Premium(w, h);
    ctx.restore();
}

// 교수 - 피격
function drawProfHurt_Premium(w, h) {
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = 'rgba(255, 150, 100, 0.3)';
    ctx.fillRect(-w / 2 - 35, -h - 10, w + 70, h + 20);
    ctx.globalAlpha = 1;
    drawProfIdle_Premium(w, h);
}

// 교수 - 방어
function drawProfGuard_Premium(w, h) {
    drawProfIdle_Premium(w, h);
    ctx.save();
    ctx.fillStyle = 'rgba(200, 100, 100, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, -h / 2, w / 2 + 25, h / 2 + 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff6666';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

// 교수 - 다운
function drawProfDown_Premium(w, h) {
    ctx.save();
    ctx.rotate(-0.3);
    ctx.translate(0, 35);
    ctx.globalAlpha = 0.7;
    drawProfIdle_Premium(w, h);
    ctx.restore();
}

console.log('✅ 고급 그래픽 패치 로드됨');
