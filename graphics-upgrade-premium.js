// ================================================
//  초고퀄리티 배경 그리기 (라운드별 프리미엄 배경)
// ================================================

function drawBackground_Premium() {
    drawBgDecoration_Premium(BG_THEMES[currentRound]);
}

function drawBgDecoration_Premium(theme) {
    ctx.save();

    if (currentRound === 0) {
        // ════════════════════════════════════════════════════════
        // 라운드 1: 고급 강의실 (현대식, 깨끗함)
        // ════════════════════════════════════════════════════════
        
        // 천장 (흰색 + 그림자)
        const ceilingGrad = ctx.createLinearGradient(0, 0, 0, 60);
        ceilingGrad.addColorStop(0, '#fafafa');
        ceilingGrad.addColorStop(1, '#e8e8e8');
        ctx.fillStyle = ceilingGrad;
        ctx.fillRect(0, 0, canvas.width, 60);
        
        // 천장 모서리 음영
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.fillRect(0, 55, canvas.width, 10);

        // === 형광등 (매우 밝고 생생함) ===
        for (let i = 0; i < 4; i++) {
            const x = 50 + i * 232;
            
            // 형광등 빛 효과 (큰 후광)
            const lightGlow = ctx.createRadialGradient(x + 70, 30, 10, x + 70, 30, 120);
            lightGlow.addColorStop(0, 'rgba(255,255,200,0.4)');
            lightGlow.addColorStop(1, 'rgba(255,255,100,0)');
            ctx.fillStyle = lightGlow;
            ctx.fillRect(x - 80, 0, 300, 80);
            
            // 형광등 기구 (금속색)
            ctx.fillStyle = '#d0d0d0';
            ctx.fillRect(x, 25, 140, 20);
            ctx.fillStyle = '#c0c0c0';
            ctx.fillRect(x, 27, 140, 4);
            
            // 형광등 몸체 (밝은 흰색)
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(x + 5, 32, 130, 8);
            ctx.shadowColor = '#ffff99';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 2;
            ctx.fillRect(x + 5, 32, 130, 8);
            ctx.shadowBlur = 0;
        }

        // 벽면 (따뜻한 흰색)
        const wallGrad = ctx.createLinearGradient(0, 60, 0, GROUND_Y);
        wallGrad.addColorStop(0, '#f5f5f5');
        wallGrad.addColorStop(1, '#ececec');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 60, canvas.width, GROUND_Y - 60);

        // === 칠판 (고급스러움) ===
        // 칠판 그림자
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        const boardGrad = ctx.createLinearGradient(120, 70, 120, 240);
        boardGrad.addColorStop(0, '#1a4d1a');
        boardGrad.addColorStop(0.5, '#0d3d0d');
        boardGrad.addColorStop(1, '#052e05');
        ctx.fillStyle = boardGrad;
        ctx.fillRect(120, 70, 660, 180);
        
        ctx.shadowBlur = 0;

        // 칠판 테두리 (진한 갈색 나무)
        ctx.fillStyle = '#8b6f47';
        ctx.fillRect(120, 70, 660, 12);
        ctx.fillRect(120, 238, 660, 12);
        ctx.fillRect(120, 70, 12, 180);
        ctx.fillRect(768, 70, 12, 180);
        
        // 칠판 내 그리드 패턴 (흐릿함)
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;
        for (let x = 130; x < 780; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 70);
            ctx.lineTo(x, 250);
            ctx.stroke();
        }

        // 칠판 글씨 (분필 느낌)
        ctx.fillStyle = '#ffff99';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeStyle = 'rgba(255,255,150,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeText('교수님 도장깨기', 450, 130);
        ctx.fillText('교수님 도장깨기', 450, 130);
        
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#ffff99';
        ctx.fillText('ROUND ' + (currentRound + 1), 450, 165);

        // === 책장 (오른쪽) ===
        ctx.fillStyle = '#8b7355';
        ctx.fillRect(780, 100, 120, GROUND_Y - 100);
        
        // 책장 선반
        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = '#6b5345';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(780, 100 + i * 45);
            ctx.lineTo(900, 100 + i * 45);
            ctx.stroke();
        }
        
        // 책 (여러 색상의 책)
        const bookColors = ['#c41e3a', '#003d7a', '#8b6914', '#2d5016', '#8b0000'];
        for (let shelf = 0; shelf < 4; shelf++) {
            for (let book = 0; book < 3; book++) {
                ctx.fillStyle = bookColors[(shelf * 3 + book) % bookColors.length];
                ctx.fillRect(790 + book * 32, 105 + shelf * 45, 28, 38);
                ctx.strokeStyle = '#000';
                ctx.lineWidth = 1;
                ctx.strokeRect(790 + book * 32, 105 + shelf * 45, 28, 38);
            }
        }

        // === 문 (왼쪽) ===
        ctx.fillStyle = '#a0826d';
        ctx.fillRect(0, 200, 70, 150);
        
        // 문 손잡이
        ctx.fillStyle = '#d4a574';
        ctx.beginPath();
        ctx.arc(60, 275, 4, 0, Math.PI * 2);
        ctx.fill();

        // === 바닥 (타일) ===
        const floorGrad = ctx.createLinearGradient(0, GROUND_Y, 0, canvas.height);
        floorGrad.addColorStop(0, '#d4c5a9');
        floorGrad.addColorStop(1, '#c4b59a');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

        // 바닥 타일 무늬 (연한 그리드)
        ctx.strokeStyle = 'rgba(100,80,60,0.15)';
        ctx.lineWidth = 1.5;
        for (let x = 0; x <= canvas.width; x += 60) {
            ctx.beginPath();
            ctx.moveTo(x, GROUND_Y);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        for (let y = GROUND_Y; y <= canvas.height; y += 60) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // 우측 상단 시계
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.arc(850, 100, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(850, 100, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // 시침 & 분침
        const time = Date.now() / 1000;
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(850, 100);
        ctx.lineTo(850 + Math.sin(time * 0.05) * 15, 100 - Math.cos(time * 0.05) * 15);
        ctx.stroke();
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(850, 100);
        ctx.lineTo(850 + Math.sin(time * 0.3) * 20, 100 - Math.cos(time * 0.3) * 20);
        ctx.stroke();

    } else if (currentRound === 1) {
        // ════════════════════════════════════════════════════════
        // 라운드 2: 고급 도서관 (따뜻하고 차분함)
        // ════════════════════════════════════════════════════════
        
        // 천장 (나무색)
        const ceilingGrad = ctx.createLinearGradient(0, 0, 0, 50);
        ceilingGrad.addColorStop(0, '#8b6914');
        ceilingGrad.addColorStop(1, '#6b5314');
        ctx.fillStyle = ceilingGrad;
        ctx.fillRect(0, 0, canvas.width, 50);

        // 벽 (따뜻한 베이지색)
        const wallGrad = ctx.createLinearGradient(0, 50, 0, GROUND_Y);
        wallGrad.addColorStop(0, '#e8d7c3');
        wallGrad.addColorStop(1, '#dcc7b3');
        ctx.fillStyle = wallGrad;
        ctx.fillRect(0, 50, canvas.width, GROUND_Y - 50);

        // === 책장들 (3개 높이 구조) ===
        const shelfWidth = 160;
        for (let col = 0; col < 6; col++) {
            const x = col * 150;
            
            // 책장 프레임 (진한 갈색)
            ctx.fillStyle = '#6b5414';
            
            // 좌측 프레임
            ctx.fillRect(x, 60, 10, GROUND_Y - 120);
            // 우측 프레임
            ctx.fillRect(x + 140, 60, 10, GROUND_Y - 120);

            // === 3층 선반 ===
            for (let shelf = 0; shelf < 3; shelf++) {
                const shelfY = 80 + shelf * 90;
                
                // 선반 목재
                const shelfGrad = ctx.createLinearGradient(x, shelfY, x + 150, shelfY);
                shelfGrad.addColorStop(0, '#8b7355');
                shelfGrad.addColorStop(0.5, '#a0825c');
                shelfGrad.addColorStop(1, '#8b7355');
                ctx.fillStyle = shelfGrad;
                ctx.fillRect(x, shelfY, 150, 8);

                // === 책들 (각 색상 다양함) ===
                const bookColors = [
                    '#8b0000',  // 진빨강
                    '#c41e3a',  // 빨강
                    '#003d7a',  // 진파랑
                    '#1e90ff',  // 파랑
                    '#228b22',  // 초록
                    '#8b4513',  // 갈색
                    '#606060',  // 회색
                    '#4b0082',  // 자주색
                ];

                for (let book = 0; book < 5; book++) {
                    const bookX = x + 12 + book * 25;
                    const bookH = 35 + Math.random() * 10;
                    const bookColor = bookColors[(col * 3 + shelf * 5 + book) % bookColors.length];
                    
                    // 책 그림자
                    ctx.fillStyle = 'rgba(0,0,0,0.1)';
                    ctx.fillRect(bookX, shelfY + 8, 22, bookH + 2);
                    
                    // 책 본체
                    const bookGrad = ctx.createLinearGradient(bookX, shelfY + 8, bookX + 20, shelfY + 8 + bookH);
                    bookGrad.addColorStop(0, bookColor);
                    bookGrad.addColorStop(1, adjustColor(bookColor, -30));
                    ctx.fillStyle = bookGrad;
                    ctx.fillRect(bookX, shelfY + 8, 20, bookH);
                    
                    // 책 테두리
                    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(bookX, shelfY + 8, 20, bookH);
                    
                    // 책 무늬 (금 테두리)
                    ctx.strokeStyle = '#d4a76a';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(bookX + 2, shelfY + 10);
                    ctx.lineTo(bookX + 18, shelfY + 10);
                    ctx.stroke();
                }
            }
        }

        // === 스탠드 라이트 (오른쪽) ===
        // 라이트 스탠드
        ctx.fillStyle = '#c0c0c0';
        ctx.fillRect(800, 150, 8, 200);
        
        // 라이트 헤드
        ctx.fillStyle = '#808080';
        ctx.beginPath();
        ctx.arc(804, 140, 20, 0, Math.PI * 2);
        ctx.fill();
        
        // 빛 효과
        const lightGlow = ctx.createRadialGradient(804, 140, 5, 804, 140, 80);
        lightGlow.addColorStop(0, 'rgba(255,220,100,0.4)');
        lightGlow.addColorStop(1, 'rgba(255,200,50,0)');
        ctx.fillStyle = lightGlow;
        ctx.fillRect(750, 80, 120, 120);

        // === 바닥 (나무 마루) ===
        const floorGrad = ctx.createLinearGradient(0, GROUND_Y, 0, canvas.height);
        floorGrad.addColorStop(0, '#a0826d');
        floorGrad.addColorStop(1, '#8b6f47');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

        // 나무 결 무늬
        ctx.strokeStyle = 'rgba(139,111,71,0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 50; i++) {
            const y = GROUND_Y + (i * 10);
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.quadraticCurveTo(225, y + 2, 450, y);
            ctx.quadraticCurveTo(675, y - 2, 900, y);
            ctx.stroke();
        }

        // === 창문 (오른쪽 벽) ===
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(820, 90, 80, 80);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(820, 90, 80, 80);
        // 창문 십자가
        ctx.beginPath();
        ctx.moveTo(860, 90);
        ctx.lineTo(860, 170);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(820, 130);
        ctx.lineTo(900, 130);
        ctx.stroke();

    } else if (currentRound === 2) {
        // ════════════════════════════════════════════════════════
        // 라운드 3: 고급 캠퍼스 (푸르고 밝음)
        // ════════════════════════════════════════════════════════
        
        // 하늘 (깊고 푸른 하늘, 현실감 있음)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
        skyGrad.addColorStop(0, '#87ceeb');
        skyGrad.addColorStop(0.5, '#87ceeb');
        skyGrad.addColorStop(1, '#b0d4e3');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);

        // === 구름들 (실시간 이동) ===
        for (let i = 0; i < 4; i++) {
            const cloudX = (Date.now() * 0.015 + i * 350) % (canvas.width + 200) - 100;
            const cloudY = 40 + i * 50;
            
            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            // 구름 모양
            ctx.beginPath();
            ctx.ellipse(cloudX, cloudY, 60, 30, 0, 0, Math.PI * 2);
            ctx.ellipse(cloudX + 45, cloudY - 10, 75, 40, 0, 0, Math.PI * 2);
            ctx.ellipse(cloudX + 90, cloudY, 55, 28, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        // === 왼쪽 건물 (벽돌 색) ===
        const buildingGrad1 = ctx.createLinearGradient(0, 120, 180, 120);
        buildingGrad1.addColorStop(0, '#d86856');
        buildingGrad1.addColorStop(1, '#c94a37');
        ctx.fillStyle = buildingGrad1;
        ctx.fillRect(0, 120, 180, GROUND_Y - 120);

        // 왼쪽 건물 창문들
        for (let floor = 0; floor < 5; floor++) {
            for (let col = 0; col < 3; col++) {
                const wx = 15 + col * 50;
                const wy = 135 + floor * 50;
                
                // 창문 색상 (일부는 불이 켜져있음)
                const isLight = (floor + col) % 2 === 0;
                ctx.fillStyle = isLight ? '#ffff99' : '#4a5f8f';
                
                // 창문 그림자
                ctx.shadowColor = 'rgba(0,0,0,0.2)';
                ctx.shadowBlur = 3;
                ctx.fillRect(wx, wy, 35, 35);
                ctx.shadowBlur = 0;
                
                // 창문 테두리
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 2;
                ctx.strokeRect(wx, wy, 35, 35);
                
                // 창문 십자가
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(wx + 17.5, wy);
                ctx.lineTo(wx + 17.5, wy + 35);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(wx, wy + 17.5);
                ctx.lineTo(wx + 35, wy + 17.5);
                ctx.stroke();
            }
        }

        // === 중앙 광장 포장도로 ===
        const roadGrad = ctx.createLinearGradient(0, GROUND_Y - 80, 0, GROUND_Y);
        roadGrad.addColorStop(0, '#d4c5a9');
        roadGrad.addColorStop(0.5, '#c4b59a');
        roadGrad.addColorStop(1, '#b4a58b');
        ctx.fillStyle = roadGrad;
        ctx.fillRect(200, GROUND_Y - 80, 500, 80);

        // 포장도로 돌 무늬
        ctx.strokeStyle = 'rgba(100,80,60,0.2)';
        ctx.lineWidth = 1;
        for (let x = 200; x <= 700; x += 50) {
            for (let y = GROUND_Y - 80; y <= GROUND_Y; y += 50) {
                ctx.strokeRect(x, y, 50, 50);
            }
        }

        // === 오른쪽 건물 (회색 콘크리트) ===
        const buildingGrad2 = ctx.createLinearGradient(720, 150, 900, 150);
        buildingGrad2.addColorStop(0, '#a0a0a0');
        buildingGrad2.addColorStop(1, '#8b8b8b');
        ctx.fillStyle = buildingGrad2;
        ctx.fillRect(720, 150, 180, GROUND_Y - 150);

        // 오른쪽 건물 창문들
        for (let floor = 0; floor < 4; floor++) {
            for (let col = 0; col < 3; col++) {
                const wx = 740 + col * 50;
                const wy = 165 + floor * 55;
                
                const isLight = (floor * 3 + col) % 3 === 0;
                ctx.fillStyle = isLight ? '#ffff99' : '#3a4f7f';
                
                ctx.fillRect(wx, wy, 38, 38);
                ctx.strokeStyle = '#333';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(wx, wy, 38, 38);
                
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(wx + 19, wy);
                ctx.lineTo(wx + 19, wy + 38);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(wx, wy + 19);
                ctx.lineTo(wx + 38, wy + 19);
                ctx.stroke();
            }
        }

        // === 잔디 광장 ===
        const grassGrad = ctx.createLinearGradient(0, GROUND_Y - 80, 0, GROUND_Y);
        grassGrad.addColorStop(0, '#3fa559');
        grassGrad.addColorStop(1, '#2d8a45');
        ctx.fillStyle = grassGrad;
        ctx.fillRect(0, GROUND_Y - 80, 200, 80);
        ctx.fillRect(700, GROUND_Y - 80, 200, 80);

        // 잔디 무늬 (생생함)
        ctx.strokeStyle = 'rgba(60,200,100,0.4)';
        ctx.lineWidth = 0.8;
        for (let x = 0; x < 200; x += 12) {
            for (let y = GROUND_Y - 80; y < GROUND_Y; y += 10) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.quadraticCurveTo(x + 3, y - 5, x + 6, y);
                ctx.stroke();
            }
        }
        for (let x = 700; x < 900; x += 12) {
            for (let y = GROUND_Y - 80; y < GROUND_Y; y += 10) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.quadraticCurveTo(x + 3, y - 5, x + 6, y);
                ctx.stroke();
            }
        }

        // === 나무 (왼쪽) ===
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(50, 200, 15, 180);
        
        // 나무 해관
        ctx.fillStyle = '#2d7a2d';
        ctx.beginPath();
        ctx.arc(57, 180, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(35, 200, 35, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(80, 200, 35, 0, Math.PI * 2);
        ctx.fill();

        // === 나무 (오른쪽) ===
        ctx.fillStyle = '#5a4a3a';
        ctx.fillRect(830, 210, 15, 170);
        
        ctx.fillStyle = '#3d8a3d';
        ctx.beginPath();
        ctx.arc(837, 190, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(815, 210, 33, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(860, 210, 33, 0, Math.PI * 2);
        ctx.fill();

    } else if (currentRound === 3) {
        // ════════════════════════════════════════════════════════
        // 라운드 4: 졸업식장 (화려하고 축제 분위기)
        // ════════════════════════════════════════════════════════
        
        // 배경 (어두운 자주색)
        const bgGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
        bgGrad.addColorStop(0, '#4a2060');
        bgGrad.addColorStop(1, '#6a3080');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);

        // === 대형 스포트라이트들 (매우 밝고 뚜렷함) ===
        const spotlights = [
            { x: 200, color: '#ffff00', size: 1.2 },
            { x: 450, color: '#ff00ff', size: 1.0 },
            { x: 700, color: '#00ffff', size: 1.2 }
        ];

        for (let spot of spotlights) {
            // 큰 빛 원뿔
            const gradient1 = ctx.createLinearGradient(spot.x, -50, spot.x, GROUND_Y);
            gradient1.addColorStop(0, `rgba(255,255,0,0.3)`);
            gradient1.addColorStop(0.3, `rgba(255,200,0,0.15)`);
            gradient1.addColorStop(1, `rgba(200,100,0,0)`);
            
            ctx.fillStyle = gradient1;
            ctx.beginPath();
            ctx.moveTo(spot.x, -50);
            ctx.lineTo(spot.x - 150, GROUND_Y);
            ctx.lineTo(spot.x + 150, GROUND_Y);
            ctx.closePath();
            ctx.fill();

            // 중앙 핵심 빛
            const gradient2 = ctx.createLinearGradient(spot.x, 0, spot.x, GROUND_Y);
            gradient2.addColorStop(0, `rgba(255,255,100,0.5)`);
            gradient2.addColorStop(0.4, `rgba(255,150,0,0.2)`);
            gradient2.addColorStop(1, `rgba(100,50,0,0)`);
            
            ctx.fillStyle = gradient2;
            ctx.beginPath();
            ctx.moveTo(spot.x, 0);
            ctx.lineTo(spot.x - 75, GROUND_Y);
            ctx.lineTo(spot.x + 75, GROUND_Y);
            ctx.closePath();
            ctx.fill();
        }

        // === 무대 구조 ===
        // 무대 배경막 (진한 빨강)
        const curtainGrad = ctx.createLinearGradient(0, 80, 0, GROUND_Y - 100);
        curtainGrad.addColorStop(0, '#cc0000');
        curtainGrad.addColorStop(1, '#990000');
        ctx.fillStyle = curtainGrad;
        ctx.fillRect(0, 80, canvas.width, GROUND_Y - 180);

        // 무대 배경막 주름 (입체감)
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 2;
        for (let x = 0; x < canvas.width; x += 40) {
            ctx.beginPath();
            ctx.moveTo(x, 80);
            ctx.quadraticCurveTo(x + 15, 150, x, GROUND_Y - 100);
            ctx.stroke();
        }

        // === 무대 바닥 (화려한 목재) ===
        const stageFloorGrad = ctx.createLinearGradient(0, GROUND_Y - 100, 0, GROUND_Y);
        stageFloorGrad.addColorStop(0, '#8b4513');
        stageFloorGrad.addColorStop(0.5, '#a0522d');
        stageFloorGrad.addColorStop(1, '#6b3410');
        ctx.fillStyle = stageFloorGrad;
        ctx.fillRect(0, GROUND_Y - 100, canvas.width, 100);

        // 무대 테두리 (황금색)
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 8;
        ctx.strokeRect(0, GROUND_Y - 100, canvas.width, 100);

        // 무대 우측 추가 황금 라인
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y - 40);
        ctx.lineTo(canvas.width, GROUND_Y - 40);
        ctx.stroke();

        // === 왕관 (중앙 상단) ===
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.moveTo(450, 50);
        ctx.lineTo(420, 80);
        ctx.lineTo(435, 90);
        ctx.lineTo(410, 110);
        ctx.lineTo(430, 105);
        ctx.lineTo(450, 130);
        ctx.lineTo(470, 105);
        ctx.lineTo(490, 110);
        ctx.lineTo(465, 90);
        ctx.lineTo(480, 80);
        ctx.closePath();
        ctx.fill();

        // 왕관 보석 (반짝임)
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(450, 50, 5, 0, Math.PI * 2);
        ctx.arc(430, 90, 3, 0, Math.PI * 2);
        ctx.arc(470, 90, 3, 0, Math.PI * 2);
        ctx.fill();

        // === 축하 텍스트 ===
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 36px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 2;
        ctx.fillText('🎓 CONGRATULATION 🎓', 450, 30);
        ctx.shadowBlur = 0;

        // === 바닥 (광택 있는 대리석) ===
        const floorGrad = ctx.createLinearGradient(0, GROUND_Y, 0, canvas.height);
        floorGrad.addColorStop(0, '#404040');
        floorGrad.addColorStop(0.5, '#303030');
        floorGrad.addColorStop(1, '#202020');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

        // 바닥 광택 효과 (하얀색 반사)
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.ellipse(450, GROUND_Y + 20, 400 - i * 60, 15 - i * 2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.restore();
}

// 색상 조정 헬퍼 함수
function adjustColor(color, amount) {
    const rgb = parseInt(color.slice(1), 16);
    const r = Math.max(0, Math.min(255, (rgb >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((rgb >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (rgb & 0x0000FF) + amount));
    return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}
