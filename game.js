// ================================================
//  철권 스타일 격투 게임  ·  game.js
// ================================================

const canvas = document.getElementById('gameCanvas');
const ctx    = canvas.getContext('2d');
canvas.width  = 900;
canvas.height = 506;

// ── DOM ─────────────────────────────────────────
const inputScreen     = document.getElementById('inputScreen');
const gameScreen      = document.getElementById('gameScreen');
const clearScreen     = document.getElementById('clearScreen');
const gameOverScreen  = document.getElementById('gameOverScreen');
const roundBanner     = document.getElementById('roundBanner');
const roundBannerText = document.getElementById('roundBannerText');
const koBanner        = document.getElementById('koBanner');
const koBannerText    = document.getElementById('koBannerText');
const p1HpBar         = document.getElementById('p1HpBar');
const p1HpDamage      = document.getElementById('p1HpDamage');
const p1HpText        = document.getElementById('p1HpText');
const p2HpBar         = document.getElementById('p2HpBar');
const p2HpDamage      = document.getElementById('p2HpDamage');
const p2HpText        = document.getElementById('p2HpText');
const p1NameEl        = document.getElementById('p1Name');
const p2NameEl        = document.getElementById('p2Name');
const roundDisplay    = document.getElementById('roundDisplay');
const timerDisplay    = document.getElementById('timerDisplay');
const specialBar      = document.getElementById('specialBar');
const specialText     = document.getElementById('specialText');
const p1Dots          = document.getElementById('p1Dots');
const p2Dots          = document.getElementById('p2Dots');
const clearStats      = document.getElementById('clearStats');
const clearPlayerName = document.getElementById('clearPlayerName');
const finalScore      = document.getElementById('finalScore');
const gameOverMsg     = document.getElementById('gameOverMsg');

document.getElementById('gameStartBtn').onclick      = handleStart;
document.getElementById('clearRestartBtn').onclick   = () => location.reload();
document.getElementById('gameOverRestartBtn').onclick= () => location.reload();

// ================================================
//  상수
// ================================================
const GRAVITY        = 0.6;
const GROUND_Y       = canvas.height - 80;
const PLAYER_MAX_HP  = 200;
const ROUND_TIME     = 99;
const MAX_ROUNDS     = 4;

const BOSS_HP_LIST   = [500, 700, 1000, 1500];  // 그대로
const PLAYER_ATK     = [25, 40, 55, 70];          // ⬆️ 학생 공격력 상향
const BOSS_ATK       = 50;                         // ⬆️ 교수 공격력 상향

// 라운드별 AI 설정
const AI_CONFIG = [
    { attackInterval: 180, blockChance: 0.07, aggressiveness: 0.3 },
    { attackInterval: 130, blockChance: 0.14, aggressiveness: 0.5 },
    { attackInterval:  90, blockChance: 0.21, aggressiveness: 0.7 },
    { attackInterval:  60, blockChance: 0.28, aggressiveness: 0.9 }
];

// 배경 색상 (4라운드)
const BG_THEMES = [
    { sky: '#87CEEB', ground: '#4a7c3f', accent: '#b8d4e8', name: '강의실' },
    { sky: '#d4e8c2', ground: '#3d6b35', accent: '#a8c890', name: '도서관' },
    { sky: '#7ec8e3', ground: '#5a8a4a', accent: '#c8e6f0', name: '캠퍼스 광장' },
    { sky: '#ffd6e0', ground: '#4a6b3a', accent: '#ffb3c6', name: '졸업식장' }
];

// ================================================
//  게임 상태
// ================================================
let gameRunning   = false;
let roundPause    = false;
let currentRound  = 0;
let p1Wins        = 0;
let p2Wins        = 0;
let timer         = ROUND_TIME;
let timerInterval = null;
let animId        = null;
let specialGauge  = 0;
let comboCount    = 0;
let comboTimer    = 0;
let playerName    = '학생';
let bossName      = '교수님';
let totalDmgDealt = 0;
let roundResults  = [];

// ── 파티클 & 이펙트 ─────────────────────────────
let particles  = [];
let dmgNumbers = [];
let hitEffects = [];

// ================================================
//  캐릭터 객체
// ================================================
let player = {};
let boss   = {};

// ── 키 입력 ─────────────────────────────────────
const keys = {};
document.addEventListener('keydown', e => {
    keys[e.code] = true;
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
        e.preventDefault();
    }
});
document.addEventListener('keyup', e => { keys[e.code] = false; });

// ================================================
//  시작 처리
// ================================================
function handleStart() {
    const pName = document.getElementById('playerName').value.trim();
    const bName = document.getElementById('bossName').value.trim();
    playerName = pName || '학생';
    bossName   = bName || '교수님';

    p1NameEl.textContent = playerName;
    p2NameEl.textContent = bossName;

    inputScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    initRound(0);
}

// ================================================
//  라운드 초기화
// ================================================
function initRound(roundIdx) {
    currentRound = roundIdx;
    roundPause   = true;
    specialGauge = 0;
    comboCount   = 0;
    comboTimer   = 0;
    particles    = [];
    dmgNumbers   = [];
    hitEffects   = [];

    // 플레이어 초기화
    player = {
        x         : 150,
        y         : GROUND_Y,
        w         : 60,
        h         : 100,
        vx        : 0,
        vy        : 0,
        hp        : PLAYER_MAX_HP,
        maxHp     : PLAYER_MAX_HP,
        atk       : PLAYER_ATK[roundIdx],
        facing    : 1,
        onGround  : true,
        state     : 'idle',   // idle, walk, jump, attack, hurt, guard, down, special
        stateTimer: 0,
        guardTimer: 0,
        hurtTimer : 0,
        downTimer : 0,
        attackBox : null,
        attackType: '',
        invincible: 0,
        jumpCount : 0
    };

    // 보스 초기화
    boss = {
        x         : 680,
        y         : GROUND_Y,
        w         : 65,
        h         : 110,
        vx        : 0,
        vy        : 0,
        hp        : BOSS_HP_LIST[roundIdx],
        maxHp     : BOSS_HP_LIST[roundIdx],
        atk       : BOSS_ATK,
        facing    : -1,
        onGround  : true,
        state     : 'idle',
        stateTimer: 0,
        guardTimer: 0,
        hurtTimer : 0,
        downTimer : 0,
        attackBox : null,
        attackType: '',
        invincible: 0,
        aiTimer   : 0,
        aiConfig  : AI_CONFIG[roundIdx]
    };

    updateHUD();
    updateDots();
    roundDisplay.textContent = 'ROUND ' + (roundIdx + 1);

    showRoundBanner('ROUND ' + (roundIdx + 1), () => {
        showRoundBanner('FIGHT!', () => {
            roundPause = false;
            startTimer();
            if (!gameRunning) {
                gameRunning = true;
                gameLoop();
            }
        }, 800);
    }, 1200);
}

// ================================================
//  타이머
// ================================================
function startTimer() {
    clearInterval(timerInterval);
    timer = ROUND_TIME;
    timerDisplay.textContent = timer;
    timerInterval = setInterval(() => {
        if (roundPause) return;
        timer--;
        timerDisplay.textContent = timer;

        if (timer <= 10) {
            timerDisplay.classList.add('danger');
        } else {
            timerDisplay.classList.remove('danger');
        }

        if (timer <= 0) {
            clearInterval(timerInterval);
            handleTimeUp();
        }
    }, 1000);
}

function handleTimeUp() {
    // HP 비교로 승자 결정
    const pPct = player.hp / player.maxHp;
    const bPct = boss.hp   / boss.maxHp;
    if (pPct > bPct) {
        endRound('player');
    } else if (bPct > pPct) {
        endRound('boss');
    } else {
        endRound('draw');
    }
}

// ================================================
//  HUD 업데이트
// ================================================
function updateHUD() {
    // 플레이어 HP
    const p1Pct = Math.max(player.hp, 0) / player.maxHp * 100;
    p1HpBar.style.width    = p1Pct + '%';
    p1HpText.textContent   = Math.max(player.hp, 0);

    if (p1Pct <= 25) {
        p1HpBar.style.background = 'linear-gradient(90deg,#ff2200,#ff0000)';
        p1HpBar.classList.add('danger');
    } else if (p1Pct <= 50) {
        p1HpBar.style.background = 'linear-gradient(90deg,#ffdd00,#ff8800)';
        p1HpBar.classList.remove('danger');
    } else {
        p1HpBar.style.background = 'linear-gradient(90deg,#00ff88,#00cc55)';
        p1HpBar.classList.remove('danger');
    }

    // 보스 HP
    const p2Pct = Math.max(boss.hp, 0) / boss.maxHp * 100;
    p2HpBar.style.width  = p2Pct + '%';
    p2HpText.textContent = Math.max(boss.hp, 0);

    if (p2Pct <= 25) {
        p2HpBar.style.background = 'linear-gradient(90deg,#ff2200,#ff0000)';
    } else if (p2Pct <= 50) {
        p2HpBar.style.background = 'linear-gradient(90deg,#ffdd00,#ff8800)';
    } else {
        p2HpBar.style.background = 'linear-gradient(90deg,#ff2222,#ff6600)';
    }

    // 필살기 게이지
    const spPct = Math.min(specialGauge, 100);
    specialBar.style.width  = spPct + '%';
    specialText.textContent = Math.floor(spPct) + '%';
    if (spPct >= 100) {
        specialBar.classList.add('full');
    } else {
        specialBar.classList.remove('full');
    }
}

function updateDots() {
    p1Dots.innerHTML = '';
    p2Dots.innerHTML = '';
    for (let i = 0; i < MAX_ROUNDS; i++) {
        const d1 = document.createElement('div');
        d1.className = 'round-dot' + (i < p1Wins ? ' win-p1' : '');
        p1Dots.appendChild(d1);

        const d2 = document.createElement('div');
        d2.className = 'round-dot' + (i < p2Wins ? ' win-p2' : '');
        p2Dots.appendChild(d2);
    }
}

// ================================================
//  데미지 처리
// ================================================
function dealDamage(target, amount, isPlayer) {
    if (target.invincible > 0) return;
    if (target.state === 'guard') {
        amount = Math.floor(amount * 0.2);
        spawnDmgNum(target.x, target.y - target.h, amount, '#00ccff', 'GUARD');
        return;
    }

    target.hp -= amount;
    target.hp  = Math.max(target.hp, 0);

    if (isPlayer) {
        totalDmgDealt += amount;
        specialGauge  += amount * 0.5;
        specialGauge   = Math.min(specialGauge, 100);
        comboCount++;
        comboTimer = 90;
    }

    // 데미지 숫자 표시
    const color = isPlayer ? '#ffff00' : '#ff4444';
    spawnDmgNum(target.x, target.y - target.h, amount, color, '');

    // 히트 이펙트
    spawnHitEffect(target.x, target.y - target.h / 2);

    // 파티클
    spawnParticles(target.x, target.y - target.h / 2,
        isPlayer ? '#ff8800' : '#ff2200', 8);

    // 상태 변경
    target.state     = 'hurt';
    target.hurtTimer = 20;
    target.invincible= 15;

    // HP 데미지 바 업데이트
    updateHpDamageBar(isPlayer, target);
    updateHUD();

    // 사망 체크
    if (target.hp <= 0) {
        target.state    = 'down';
        target.downTimer= 60;
        setTimeout(() => endRound(isPlayer ? 'player' : 'boss'), 500);
    }
}

function updateHpDamageBar(isPlayerHit, target) {
    const pct = Math.max(target.hp, 0) / target.maxHp * 100;
    if (isPlayerHit) {
        // 보스가 플레이어를 때림 → p1 데미지 바
        p1HpDamage.style.width = (100 - pct) + '%';
        setTimeout(() => { p1HpDamage.style.width = '0%'; }, 600);
    } else {
        p2HpDamage.style.width = (100 - pct) + '%';
        setTimeout(() => { p2HpDamage.style.width = '0%'; }, 600);
    }
}

// ================================================
//  공격 처리
// ================================================
function playerAttack(type) {
    if (player.state === 'attack' || player.state === 'hurt' ||
        player.state === 'down'   || player.state === 'special') return;

    player.state      = 'attack';
    player.attackType = type;

    let dmg = 0, range = 0, duration = 0;

    switch (type) {
        case 'normal':
            dmg = player.atk;
            range = 90;
            duration = 25;
            break;
                case 'heavy':
            dmg = Math.floor(player.atk * 2);
            range = 100;
            duration = 40;
            break;
        case 'kick':
            dmg = Math.floor(player.atk * 1.5);
            range = 110;
            duration = 30;
            break;
        case 'jump':
            dmg = Math.floor(player.atk * 1.2);
            range = 85;
            duration = 20;
            break;
        case 'special':
            dmg = player.atk * 4;
            range = 130;
            duration = 50;
            player.state = 'special';
            specialGauge = 0;
            triggerSpecialEffect();
            break;
    }

    player.stateTimer = duration;
    player.attackBox  = {
        x : player.facing === 1
            ? player.x + player.w / 2
            : player.x - player.w / 2 - range,
        y : player.y - player.h * 0.7,
        w : range,
        h : player.h * 0.6
    };

    // 히트 체크
    setTimeout(() => {
        if (!player.attackBox) return;
        if (rectsOverlap(player.attackBox, getBossHitbox())) {
            dealDamage(boss, dmg, true);
            if (type === 'special') {
                boss.vx = player.facing * 8;
            }
        }
        player.attackBox = null;
    }, duration * 0.4 * (1000 / 60));
}

function bossAttack(type) {
    if (boss.state === 'attack' || boss.state === 'hurt' ||
        boss.state === 'down'   || boss.state === 'special') return;

    boss.state      = 'attack';
    boss.attackType = type;

    let dmg = 0, range = 0, duration = 0;

    switch (type) {
        case 'normal':
            dmg = boss.atk;
            range = 95;
            duration = 30;
            break;
        case 'heavy':
            dmg = boss.atk * 2;
            range = 105;
            duration = 45;
            break;
        case 'kick':
            dmg = Math.floor(boss.atk * 1.5);
            range = 115;
            duration = 35;
            break;
        case 'rush':
            dmg = boss.atk * 3;
            range = 120;
            duration = 55;
            break;
    }

    boss.stateTimer = duration;
    boss.attackBox  = {
        x : boss.facing === 1
            ? boss.x + boss.w / 2
            : boss.x - boss.w / 2 - range,
        y : boss.y - boss.h * 0.7,
        w : range,
        h : boss.h * 0.6
    };

    setTimeout(() => {
        if (!boss.attackBox) return;
        if (rectsOverlap(boss.attackBox, getPlayerHitbox())) {
            dealDamage(player, dmg, false);
        }
        boss.attackBox = null;
    }, duration * 0.4 * (1000 / 60));
}

// ================================================
//  히트박스
// ================================================
function getPlayerHitbox() {
    return {
        x: player.x - player.w / 2,
        y: player.y - player.h,
        w: player.w,
        h: player.h
    };
}

function getBossHitbox() {
    return {
        x: boss.x - boss.w / 2,
        y: boss.y - boss.h,
        w: boss.w,
        h: boss.h
    };
}

function rectsOverlap(a, b) {
    return a.x < b.x + b.w &&
           a.x + a.w > b.x &&
           a.y < b.y + b.h &&
           a.y + a.h > b.y;
}

// ================================================
//  플레이어 입력 처리
// ================================================
function handlePlayerInput() {
    if (roundPause) return;
    if (player.state === 'down') return;
    if (player.state === 'hurt' && player.hurtTimer > 0) return;

    // 방어
    if (keys['ArrowDown'] && player.onGround) {
        player.state     = 'guard';
        player.guardTimer= 10;
        return;
    }

    // 이동
    if (player.state !== 'attack' && player.state !== 'special') {
        if (keys['ArrowLeft']) {
            player.vx     = -5;
            player.facing = -1;
            if (player.onGround) player.state = 'walk';
        } else if (keys['ArrowRight']) {
            player.vx     = 5;
            player.facing = 1;
            if (player.onGround) player.state = 'walk';
        } else {
            player.vx = 0;
            if (player.onGround && player.state === 'walk') {
                player.state = 'idle';
            }
        }
    }

    // 점프
    if ((keys['ArrowUp']) && player.onGround) {
        player.vy       = -14;
        player.onGround = false;
        player.state    = 'jump';
        player.jumpCount= 1;
    }

    // 공격
    if (keys['Space'] && !keys['_spaceUsed']) {
        keys['_spaceUsed'] = true;
        if (!player.onGround) {
            playerAttack('jump');
        } else {
            playerAttack('normal');
        }
    }
    if (!keys['Space']) keys['_spaceUsed'] = false;

    if (keys['KeyZ'] && !keys['_zUsed']) {
        keys['_zUsed'] = true;
        playerAttack('heavy');
    }
    if (!keys['KeyZ']) keys['_zUsed'] = false;

    if (keys['KeyX'] && !keys['_xUsed']) {
        keys['_xUsed'] = true;
        playerAttack('kick');
    }
    if (!keys['KeyX']) keys['_xUsed'] = false;

    if (keys['KeyC'] && !keys['_cUsed']) {
        keys['_cUsed'] = true;
        if (specialGauge >= 100) {
            playerAttack('special');
        }
    }
    if (!keys['KeyC']) keys['_cUsed'] = false;
}

// ================================================
//  AI 처리
// ================================================
function updateAI() {
    if (roundPause) return;
    if (boss.state === 'down' || boss.state === 'hurt') return;

    const cfg  = boss.aiConfig;
    const dist = Math.abs(boss.x - player.x);

    // 플레이어 방향으로 얼굴
    boss.facing = player.x < boss.x ? -1 : 1;

    boss.aiTimer++;

    // 방어 판단
    if (player.state === 'attack' && dist < 150 &&
        Math.random() < cfg.blockChance) {
        boss.state     = 'guard';
        boss.guardTimer= 20;
        return;
    }

    // 이동 판단
    if (boss.state !== 'attack' && boss.state !== 'special' &&
        boss.state !== 'guard') {

        if (dist > 160) {
            // 접근
            boss.vx    = boss.facing * (2 + currentRound * 0.5);
            boss.state = 'walk';
        } else if (dist < 80) {
            // 후퇴
            boss.vx    = -boss.facing * 2;
            boss.state = 'walk';
        } else {
            boss.vx    = 0;
            boss.state = 'idle';
        }
    }

    // 공격 판단
    if (boss.aiTimer >= cfg.attackInterval) {
        boss.aiTimer = 0;

        if (dist < 160) {
            const rand = Math.random();
            const aggr = cfg.aggressiveness;

            if (rand < aggr * 0.5) {
                bossAttack('normal');
            } else if (rand < aggr * 0.7) {
                bossAttack('heavy');
            } else if (rand < aggr * 0.85) {
                bossAttack('kick');
            } else if (rand < aggr && currentRound >= 2) {
                bossAttack('rush');
            }
        }
    }

    // 점프 (랜덤)
    if (boss.onGround && Math.random() < 0.003 * (currentRound + 1)) {
        boss.vy       = -12;
        boss.onGround = false;
        boss.state    = 'jump';
    }
}

// ================================================
//  물리 업데이트
// ================================================
function updatePhysics(char) {
    // 중력
    if (!char.onGround) {
        char.vy += GRAVITY;
    }

    char.x += char.vx;
    char.y += char.vy;

    // 바닥 충돌
    if (char.y >= GROUND_Y) {
        char.y       = GROUND_Y;
        char.vy      = 0;
        char.onGround= true;
        if (char.state === 'jump') char.state = 'idle';
    }

    // 벽 충돌
    const half = char.w / 2;
    if (char.x - half < 0)              char.x = half;
    if (char.x + half > canvas.width)   char.x = canvas.width - half;

    // 상태 타이머
    if (char.stateTimer > 0) {
        char.stateTimer--;
        if (char.stateTimer <= 0) {
            if (char.state === 'attack' || char.state === 'special') {
                char.state = 'idle';
            }
        }
    }

    if (char.hurtTimer > 0) {
        char.hurtTimer--;
        if (char.hurtTimer <= 0 && char.state === 'hurt') {
            char.state = 'idle';
        }
    }

    if (char.guardTimer > 0) {
        char.guardTimer--;
        if (char.guardTimer <= 0 && char.state === 'guard') {
            char.state = 'idle';
        }
    }

    if (char.downTimer > 0) {
        char.downTimer--;
    }

    if (char.invincible > 0) char.invincible--;
}

// ================================================
//  파티클 & 이펙트
// ================================================
function spawnParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1;
        particles.push({
            x, y,
            vx   : Math.cos(angle) * speed,
            vy   : Math.sin(angle) * speed - 2,
            r    : Math.random() * 5 + 2,
            color,
            alpha: 1,
            life : Math.random() * 25 + 15
        });
    }
}

function spawnDmgNum(x, y, amount, color, prefix) {
    dmgNumbers.push({
        x,
        y,
        text : (prefix ? prefix + ' ' : '') + amount,
        color,
        alpha: 1,
        vy   : -2.5,
        life : 55,
        size : prefix === 'GUARD' ? 14 : 20
    });
}

function spawnHitEffect(x, y) {
    hitEffects.push({
        x, y,
        r    : 5,
        alpha: 1,
        life : 15
    });
}

function updateParticles() {
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
        p.x    += p.vx;
        p.y    += p.vy;
        p.vy   += 0.15;
        p.life--;
        p.alpha = p.life / 30;
        p.r    *= 0.96;
    });
}

function updateDmgNumbers() {
    dmgNumbers = dmgNumbers.filter(d => d.life > 0);
    dmgNumbers.forEach(d => {
        d.y    += d.vy;
        d.life--;
        d.alpha = d.life / 55;
    });
}

function updateHitEffects() {
    hitEffects = hitEffects.filter(h => h.life > 0);
    hitEffects.forEach(h => {
        h.r    += 3;
        h.life--;
        h.alpha = h.life / 15;
    });
}

function updateCombo() {
    if (comboTimer > 0) {
        comboTimer--;
        if (comboTimer <= 0) comboCount = 0;
    }
}

// ================================================
//  필살기 이펙트
// ================================================
function triggerSpecialEffect() {
    const el = document.createElement('div');
    el.className = 'special-flash';
    document.getElementById('specialEffect') &&
        document.getElementById('specialEffect').appendChild(el);

    const txt = document.createElement('div');
    txt.className   = 'special-text';
    txt.textContent = '💥 SPECIAL!!';
    gameScreen.appendChild(txt);
    txt.style.position = 'absolute';
    txt.style.top      = '45%';
    txt.style.left     = '50%';
    txt.style.transform= 'translate(-50%,-50%)';
    txt.style.zIndex   = '56';

    setTimeout(() => {
        txt.remove();
        el.remove();
    }, 900);
}

// ================================================
//  라운드 종료
// ================================================
function endRound(winner) {
    if (roundPause) return;
    roundPause = true;
    clearInterval(timerInterval);

    const isPlayerWin = winner === 'player';
    const isDraw      = winner === 'draw';

    if (isPlayerWin) {
        p1Wins++;
        roundResults.push('WIN');
        showKOBanner('K.O.!', '#00ff88');
    } else if (isDraw) {
        roundResults.push('DRAW');
        showKOBanner('DRAW', '#ffdd00');
    } else {
        p2Wins++;
        roundResults.push('LOSE');
        showKOBanner('K.O.!', '#ff2200');
    }

    updateDots();

    setTimeout(() => {
        koBanner.classList.add('hidden');

                // 승리 조건 체크
        if (p1Wins >= 2) {
            if (currentRound + 1 >= MAX_ROUNDS) {
                showClear();
            } else {
                p1Wins = 0;
                p2Wins = 0;
                initRound(currentRound + 1);
            }
        } else if (p2Wins >= 2) {
            showGameOver();
        } else {
            // 같은 라운드 재시작
            initRound(currentRound);
        }
    }, 2500);
}

// ================================================
//  배너 표시
// ================================================
function showRoundBanner(text, callback, duration = 1200) {
    roundBanner.classList.remove('hidden');
    roundBannerText.textContent = text;

    roundBannerText.style.animation = 'none';
    void roundBannerText.offsetWidth;
    roundBannerText.style.animation = '';

    setTimeout(() => {
        roundBanner.classList.add('hidden');
        if (callback) callback();
    }, duration);
}

function showKOBanner(text, color) {
    koBanner.classList.remove('hidden');
    koBannerText.textContent  = text;
    koBannerText.style.color  = color;
    koBannerText.style.textShadow = `0 0 50px ${color}, 0 0 100px ${color}88`;

    koBannerText.style.animation = 'none';
    void koBannerText.offsetWidth;
    koBannerText.style.animation = '';
}

// ================================================
//  클리어 & 게임오버
// ================================================
async function showClear() {
    gameRunning = false;
    cancelAnimationFrame(animId);
    clearInterval(timerInterval);

    clearScreen.classList.remove('hidden');
    clearPlayerName.textContent = `🎓 ${playerName} 의 승리!`;

    clearStats.innerHTML = `
        <div class="stat-row">
            <span>총 가한 데미지</span>
            <span>${totalDmgDealt}</span>
        </div>
        <div class="stat-row">
            <span>클리어 라운드</span>
            <span>${MAX_ROUNDS} 라운드</span>
        </div>
        <div class="stat-row">
            <span>상대 교수님</span>
            <span>${bossName}</span>
        </div>
        <div class="stat-row">
            <span>라운드 결과</span>
            <span>${roundResults.join(' / ')}</span>
        </div>
    `;

    // ✅ 기록 저장
    const schoolName = document.getElementById('schoolName')?.value || '미입력';
    await saveRecord({
        playerName : playerName,
        school     : schoolName,
        totalDmg   : totalDmgDealt,
        clearRound : MAX_ROUNDS,
        results    : roundResults.join(' / ')
    });

    // ✅ 클리어 화면에 랭킹 버튼 추가
    document.getElementById('clearRestartBtn').insertAdjacentHTML(
        'afterend',
        `<button
            onclick="openRankingScreen('${schoolName}')"
            style="
                margin-top:10px;
                padding:12px 40px;
                font-size:16px;
                font-family:'Courier New',monospace;
                font-weight:bold;
                background:transparent;
                color:#ffdd00;
                border:2px solid #ffdd00;
                border-radius:8px;
                cursor:pointer;
                letter-spacing:3px;
            ">
            🏆 랭킹 확인
        </button>`
    );
}

function showGameOver() {
    gameRunning = false;
    cancelAnimationFrame(animId);
    clearInterval(timerInterval);

    gameOverScreen.classList.remove('hidden');
    gameOverMsg.textContent =
        `${bossName} 에게 패배했습니다... 다시 도전하세요!`;
}

// ================================================
//  배경 그리기
// ================================================
function drawBackground() {
    const theme = BG_THEMES[currentRound];

    // 하늘
    const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    skyGrad.addColorStop(0, theme.sky);
    skyGrad.addColorStop(1, theme.accent);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 배경 장식 (라운드별)
    drawBgDecoration(theme);

    // 바닥
    const groundGrad = ctx.createLinearGradient(
        0, GROUND_Y, 0, canvas.height
    );
    groundGrad.addColorStop(0, theme.accent);
    groundGrad.addColorStop(1, theme.ground);
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

    // 바닥 라인
    ctx.strokeStyle = '#ffffff22';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();
}

function drawBgDecoration(theme) {
    ctx.save();

    if (currentRound === 0) {
        // ── 강의실 ──────────────────────────────
        // 천장/벽
        ctx.fillStyle = '#f5f0e8';
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);

        // 형광등
        ctx.fillStyle = '#fffde0';
        ctx.shadowColor = '#ffff99';
        ctx.shadowBlur = 20;
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(150 + i * 230, 10, 120, 18);
        }
        ctx.shadowBlur = 0;

        // 칠판
        ctx.fillStyle = '#2d5a27';
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 6;
        ctx.fillRect(180, 55, 540, 155);
        ctx.strokeRect(180, 55, 540, 155);

        // 칠판 테두리 나무
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(180, 55, 540, 10);
        ctx.fillRect(180, 200, 540, 10);

        // 칠판 글씨
        ctx.fillStyle = '#ffffffcc';
        ctx.font = 'bold 16px Courier New';
        ctx.fillText('📋 오늘의 시험 범위: 1장 ~ 전체', 210, 100);
        ctx.fillStyle = '#ff9999cc';
        ctx.fillText('⚠️  F학점 기준: 60점 미만', 210, 135);
        ctx.fillStyle = '#ffffffaa';
        ctx.fillText('출석 점수: 없음  /  과제: 미제출', 210, 168);

        // 분필 선반
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(180, 208, 540, 8);

        // 창문 (왼쪽)
        ctx.fillStyle = '#aee4f7';
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 3;
        ctx.fillRect(30, 70, 110, 140);
        ctx.strokeRect(30, 70, 110, 140);
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(85, 70); ctx.lineTo(85, 210);
        ctx.moveTo(30, 140); ctx.lineTo(140, 140);
        ctx.stroke();

        // 창문 햇빛
        ctx.fillStyle = '#ffffff33';
        ctx.fillRect(30, 70, 50, 140);

        // 책상들 (원근감)
        for (let i = 0; i < 4; i++) {
            const dx = 160 + i * 155;
            const dy = GROUND_Y - 30;
            ctx.fillStyle = '#c8a96e';
            ctx.strokeStyle = '#8B6914';
            ctx.lineWidth = 2;
            ctx.fillRect(dx, dy, 120, 18);
            ctx.strokeRect(dx, dy, 120, 18);
            // 다리
            ctx.strokeStyle = '#8B6914';
            ctx.beginPath();
            ctx.moveTo(dx + 10, dy + 18);
            ctx.lineTo(dx + 10, dy + 35);
            ctx.moveTo(dx + 110, dy + 18);
            ctx.lineTo(dx + 110, dy + 35);
            ctx.stroke();
        }

    } else if (currentRound === 1) {
        // ── 도서관 ──────────────────────────────
        // 벽
        ctx.fillStyle = '#f0ebe0';
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);

        // 천장 몰딩
        ctx.fillStyle = '#d4c9a8';
        ctx.fillRect(0, 0, canvas.width, 15);

        // 형광등
        ctx.fillStyle = '#fffde0';
        ctx.shadowColor = '#ffff99';
        ctx.shadowBlur = 15;
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(80 + i * 200, 8, 100, 12);
        }
        ctx.shadowBlur = 0;

        // 책장들
        const shelfColors = ['#6b3a2a', '#5a3020', '#7a4030'];
        for (let i = 0; i < 5; i++) {
            const bx = 40 + i * 170;
            ctx.fillStyle = shelfColors[i % 3];
            ctx.strokeStyle = '#3a1a0a';
            ctx.lineWidth = 2;
            ctx.fillRect(bx, 30, 130, 210);
            ctx.strokeRect(bx, 30, 130, 210);

            // 선반
            for (let s = 0; s < 3; s++) {
                ctx.fillStyle = '#3a1a0a';
                ctx.fillRect(bx, 30 + s * 65, 130, 5);
            }

            // 책들
            const bookColors = [
                '#cc2200','#0044cc','#00aa44','#cc8800',
                '#8800cc','#cc0088','#006688','#884400'
            ];
            for (let s = 0; s < 3; s++) {
                let bxOffset = bx + 5;
                for (let b = 0; b < 6; b++) {
                    const bw = 14 + Math.floor(Math.random() * 6);
                    ctx.fillStyle = bookColors[(i * 3 + s + b) % bookColors.length];
                    ctx.fillRect(bxOffset, 35 + s * 65, bw, 55);
                    ctx.strokeStyle = '#00000033';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(bxOffset, 35 + s * 65, bw, 55);
                    bxOffset += bw + 2;
                    if (bxOffset > bx + 120) break;
                }
            }
        }

        // 열람 테이블
        ctx.fillStyle = '#c8a96e';
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 3;
        ctx.fillRect(200, GROUND_Y - 35, 500, 20);
        ctx.strokeRect(200, GROUND_Y - 35, 500, 20);

        // 스탠드 조명
        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(350, GROUND_Y - 35);
        ctx.lineTo(350, GROUND_Y - 80);
        ctx.lineTo(390, GROUND_Y - 80);
        ctx.stroke();
        ctx.fillStyle = '#ffdd0088';
        ctx.shadowColor = '#ffdd00';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(390, GROUND_Y - 80, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

    } else if (currentRound === 2) {
        // ── 캠퍼스 광장 (야외) ──────────────────
        // 하늘 그라데이션
        const skyG = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
        skyG.addColorStop(0, '#5ba3d9');
        skyG.addColorStop(1, '#c8e6f5');
        ctx.fillStyle = skyG;
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);

        // 구름
        ctx.fillStyle = '#ffffffcc';
        const clouds = [
            {x:80,  y:60,  r:30},
            {x:130, y:50,  r:40},
            {x:180, y:65,  r:28},
            {x:400, y:45,  r:35},
            {x:450, y:38,  r:45},
            {x:500, y:50,  r:30},
            {x:700, y:70,  r:32},
            {x:750, y:58,  r:42},
            {x:800, y:72,  r:25},
        ];
        clouds.forEach(c => {
            ctx.beginPath();
            ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
            ctx.fill();
        });

        // 본관 건물
        ctx.fillStyle = '#e8dcc8';
        ctx.strokeStyle = '#c4a882';
        ctx.lineWidth = 2;
        ctx.fillRect(250, 40, 400, 180);
        ctx.strokeRect(250, 40, 400, 180);

        // 건물 지붕
        ctx.fillStyle = '#8B6914';
        ctx.beginPath();
        ctx.moveTo(230, 40);
        ctx.lineTo(450, 5);
        ctx.lineTo(670, 40);
        ctx.closePath();
        ctx.fill();

        // 건물 창문들
        ctx.fillStyle = '#aee4f7';
        ctx.strokeStyle = '#888888';
        ctx.lineWidth = 1;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 6; col++) {
                const wx = 270 + col * 62;
                const wy = 60 + row * 50;
                ctx.fillRect(wx, wy, 35, 30);
                ctx.strokeRect(wx, wy, 35, 30);
                ctx.beginPath();
                ctx.moveTo(wx + 17, wy);
                ctx.lineTo(wx + 17, wy + 30);
                ctx.stroke();
            }
        }

        // 건물 입구
        ctx.fillStyle = '#5a3a1a';
        ctx.fillRect(400, 155, 60, 65);
        ctx.fillStyle = '#8B6914';
        ctx.strokeStyle = '#5a3a1a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(430, 155, 30, Math.PI, 0);
        ctx.fill();
        ctx.stroke();

        // 벚꽃 나무 (왼쪽)
        ctx.fillStyle = '#5a3a1a';
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#5a3a1a';
        ctx.beginPath();
        ctx.moveTo(80, GROUND_Y);
        ctx.lineTo(80, GROUND_Y - 130);
        ctx.stroke();
        // 가지
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(80, GROUND_Y - 100);
        ctx.lineTo(40, GROUND_Y - 150);
        ctx.moveTo(80, GROUND_Y - 110);
        ctx.lineTo(120, GROUND_Y - 155);
        ctx.stroke();

        // 벚꽃
        const blossomPos = [
            {x:80, y:GROUND_Y-150, r:45},
            {x:40, y:GROUND_Y-165, r:30},
            {x:120,y:GROUND_Y-168, r:32},
        ];
        blossomPos.forEach(b => {
            ctx.fillStyle = '#ffb7c5cc';
            ctx.shadowColor = '#ff88aa';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;

        // 벚꽃 나무 (오른쪽)
        ctx.fillStyle = '#5a3a1a';
        ctx.lineWidth = 8;
        ctx.strokeStyle = '#5a3a1a';
        ctx.beginPath();
        ctx.moveTo(820, GROUND_Y);
        ctx.lineTo(820, GROUND_Y - 130);
        ctx.stroke();
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(820, GROUND_Y - 100);
        ctx.lineTo(780, GROUND_Y - 150);
        ctx.moveTo(820, GROUND_Y - 110);
        ctx.lineTo(860, GROUND_Y - 155);
        ctx.stroke();
        blossomPos.forEach(b => {
            ctx.fillStyle = '#ffb7c5cc';
            ctx.shadowColor = '#ff88aa';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(b.x + 740, b.y, b.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.shadowBlur = 0;

        // 잔디
        const grassG = ctx.createLinearGradient(0, GROUND_Y, 0, canvas.height);
        grassG.addColorStop(0, '#5a9e3a');
        grassG.addColorStop(1, '#3a7a20');
        ctx.fillStyle = grassG;
        ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

        // 보도블록
        ctx.fillStyle = '#d4c8b0';
        ctx.fillRect(300, GROUND_Y, 300, canvas.height - GROUND_Y);
        ctx.strokeStyle = '#b8aa90';
        ctx.lineWidth = 1;
        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            ctx.moveTo(300 + i * 50, GROUND_Y);
            ctx.lineTo(300 + i * 50, canvas.height);
            ctx.stroke();
        }

        } else if (currentRound === 3) {
        // ── 졸업식장 ────────────────────────────
        // 실내 벽
        ctx.fillStyle = '#f5f0ff';
        ctx.fillRect(0, 0, canvas.width, GROUND_Y);

        // 천장 장식
        ctx.fillStyle = '#e8d8f8';
        ctx.fillRect(0, 0, canvas.width, 20);

        // 샹들리에
        ctx.strokeStyle = '#c0a000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, 50);
        ctx.stroke();

        ctx.fillStyle = '#ffd700';
        ctx.shadowColor = '#ffdd00';
        ctx.shadowBlur = 25;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, 55, 18, 0, Math.PI * 2);
        ctx.fill();

        // 샹들리에 빛줄기
        const lightAngles = [0, 45, 90, 135, 180, 225, 270, 315];
        lightAngles.forEach(angle => {
            const rad = angle * Math.PI / 180;
            const lx = canvas.width / 2 + Math.cos(rad) * 18;
            const ly = 55 + Math.sin(rad) * 18;
            const grad = ctx.createLinearGradient(
                lx, ly,
                lx + Math.cos(rad) * 60,
                ly + Math.sin(rad) * 60
            );
            grad.addColorStop(0, '#ffd70088');
            grad.addColorStop(1, 'transparent');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx + Math.cos(rad) * 60, ly + Math.sin(rad) * 60);
            ctx.stroke();
        });
        ctx.shadowBlur = 0;

        // 무대 배경 커튼
        ctx.fillStyle = '#6600aa';
        ctx.fillRect(0, 0, 80, GROUND_Y);
        ctx.fillRect(canvas.width - 80, 0, 80, GROUND_Y);

        // 커튼 주름
        ctx.strokeStyle = '#4400aa';
        ctx.lineWidth = 3;
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(15 + i * 15, 0);
            ctx.bezierCurveTo(
                5  + i * 15, GROUND_Y / 2,
                25 + i * 15, GROUND_Y / 2,
                15 + i * 15, GROUND_Y
            );
            ctx.stroke();
        }
        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(canvas.width - 15 - i * 15, 0);
            ctx.bezierCurveTo(
                canvas.width - 5  - i * 15, GROUND_Y / 2,
                canvas.width - 25 - i * 15, GROUND_Y / 2,
                canvas.width - 15 - i * 15, GROUND_Y
            );
            ctx.stroke();
        }

        // 무대 배경 벽
        ctx.fillStyle = '#2a0050';
        ctx.fillRect(80, 0, canvas.width - 160, GROUND_Y);

        // 현수막
        ctx.fillStyle = '#1a0040';
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 3;
        ctx.fillRect(180, 30, 540, 80);
        ctx.strokeRect(180, 30, 540, 80);

        // 현수막 글씨
        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 22px "Malgun Gothic", sans-serif';
        ctx.textAlign = 'center';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.fillText('🎓 제 00회 졸업식 🎓', canvas.width / 2, 65);
        ctx.shadowBlur = 0;
        ctx.font = '14px "Malgun Gothic", sans-serif';
        ctx.fillStyle = '#ffddaacc';
        ctx.fillText('축하합니다! 이제 사회로 나가세요', canvas.width / 2, 95);
        ctx.textAlign = 'left';

        // 스포트라이트
        const spotLights = [
            { x: 250, color: '#ffdd0033' },
            { x: 450, color: '#ffffff22' },
            { x: 650, color: '#ffdd0033' },
        ];
        spotLights.forEach(s => {
            const grad = ctx.createRadialGradient(
                s.x, GROUND_Y, 10,
                s.x, GROUND_Y, 180
            );
            grad.addColorStop(0, s.color);
            grad.addColorStop(1, 'transparent');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.moveTo(s.x - 20, 30);
            ctx.lineTo(s.x - 120, GROUND_Y);
            ctx.lineTo(s.x + 120, GROUND_Y);
            ctx.lineTo(s.x + 20, 30);
            ctx.closePath();
            ctx.fill();
        });

        // 무대 단상
        ctx.fillStyle = '#c8a96e';
        ctx.strokeStyle = '#8B6914';
        ctx.lineWidth = 3;
        ctx.fillRect(300, GROUND_Y - 25, 300, 25);
        ctx.strokeRect(300, GROUND_Y - 25, 300, 25);

        // 연단
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(420, GROUND_Y - 55, 60, 30);
        ctx.strokeRect(420, GROUND_Y - 55, 60, 30);

        // 마이크
        ctx.strokeStyle = '#555555';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(450, GROUND_Y - 55);
        ctx.lineTo(450, GROUND_Y - 85);
        ctx.stroke();
        ctx.fillStyle = '#333333';
        ctx.beginPath();
        ctx.arc(450, GROUND_Y - 90, 7, 0, Math.PI * 2);
        ctx.fill();

        // 풍선 장식
        const balloonColors = ['#ff4444', '#ffdd00', '#44aaff', '#ff44aa', '#44ff88'];
        const balloons = [
            {x: 100, y: 80},  {x: 140, y: 60},
            {x: 760, y: 80},  {x: 800, y: 55},
        ];
        balloons.forEach((b, i) => {
            ctx.fillStyle = balloonColors[i % balloonColors.length];
            ctx.shadowColor = balloonColors[i % balloonColors.length];
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(b.x, b.y, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
            // 풍선 실
            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(b.x, b.y + 18);
            ctx.lineTo(b.x + 5, b.y + 45);
            ctx.stroke();
        });
    }

    ctx.restore();
}


// ================================================
//  캐릭터 그리기
// ================================================
function drawPlayer() {
    const { x, y, w, h, state, facing, invincible, attackType } = player;

    if (invincible > 0 && Math.floor(invincible / 4) % 2 === 0) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);

    switch (state) {
        case 'idle':    drawStudentIdle(w, h);          break;
        case 'walk':    drawStudentWalk(w, h);          break;
        case 'jump':    drawStudentJump(w, h);          break;
        case 'attack':
        case 'special': drawStudentAttack(w, h, attackType); break;
        case 'hurt':    drawStudentHurt(w, h);          break;
        case 'guard':   drawStudentGuard(w, h);         break;
        case 'down':    drawStudentDown(w, h);          break;
        default:        drawStudentIdle(w, h);          break;
    }

    ctx.restore();

    // 이름 태그
    ctx.save();
    ctx.fillStyle   = '#ffdd00';
    ctx.font        = 'bold 12px Courier New';
    ctx.textAlign   = 'center';
    ctx.shadowColor = '#ffdd00';
    ctx.shadowBlur  = 6;
    ctx.fillText(playerName, x, y - h - 10);
    ctx.restore();
}

function drawBoss() {
    const { x, y, w, h, state, facing, invincible, attackType } = boss;

    if (invincible > 0 && Math.floor(invincible / 4) % 2 === 0) return;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);

    switch (state) {
        case 'idle':    drawProfIdle(w, h);             break;
        case 'walk':    drawProfWalk(w, h);             break;
        case 'jump':    drawProfJump(w, h);             break;
        case 'attack':  drawProfAttack(w, h, attackType); break;
        case 'hurt':    drawProfHurt(w, h);             break;
        case 'guard':   drawProfGuard(w, h);            break;
        case 'down':    drawProfDown(w, h);             break;
        default:        drawProfIdle(w, h);             break;
    }

    ctx.restore();

    // 이름 태그
    ctx.save();
    ctx.fillStyle   = '#ff4444';
    ctx.font        = 'bold 12px Courier New';
    ctx.textAlign   = 'center';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur  = 6;
    ctx.fillText(bossName, x, y - h - 10);
    ctx.restore();
}

// ================================================
//  학생 캐릭터 드로잉
// ================================================
function drawStudentIdle(w, h) {
    // 몸통 (교복)
    ctx.fillStyle = '#1a3a6a';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

    // 머리
    ctx.fillStyle   = '#f5c5a0';
    ctx.shadowColor = '#00000044';
    ctx.shadowBlur  = 4;
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 머리카락
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -h + 5, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 눈
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-6, -h + 14, 4, 4, 0, 0, Math.PI * 2);
    ctx.ellipse( 6, -h + 14, 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-6, -h + 14, 2, 0, Math.PI * 2);
    ctx.arc( 6, -h + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    // 교복 넥타이
    ctx.fillStyle = '#cc2200';
    ctx.beginPath();
    ctx.moveTo(0, -h + 30);
    ctx.lineTo(-5, -h + 50);
    ctx.lineTo(0, -h + 55);
    ctx.lineTo(5, -h + 50);
    ctx.closePath();
    ctx.fill();

        // 다리
    ctx.fillStyle = '#222244';
    ctx.fillRect(-w / 2 + 8,  -h * 0.35, 18, h * 0.35);
    ctx.fillRect( w / 2 - 26, -h * 0.35, 18, h * 0.35);

    // 신발
    ctx.fillStyle = '#111';
    ctx.fillRect(-w / 2 + 6,  -8, 22, 10);
    ctx.fillRect( w / 2 - 28, -8, 22, 10);

    // 팔
    ctx.fillStyle = '#1a3a6a';
    ctx.fillRect(-w / 2,      -h + 32, 12, 35);
    ctx.fillRect( w / 2 - 12, -h + 32, 12, 35);

    // 손
    ctx.fillStyle = '#f5c5a0';
    ctx.beginPath();
    ctx.arc(-w / 2 + 6,  -h + 68, 7, 0, Math.PI * 2);
    ctx.arc( w / 2 - 6,  -h + 68, 7, 0, Math.PI * 2);
    ctx.fill();
}

function drawStudentWalk(w, h) {
    const t = Date.now() * 0.01;

    // 몸통
    ctx.fillStyle = '#1a3a6a';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

    // 머리
    ctx.fillStyle = '#f5c5a0';
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 머리카락
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -h + 5, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 눈
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-6, -h + 14, 4, 4, 0, 0, Math.PI * 2);
    ctx.ellipse( 6, -h + 14, 4, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-6, -h + 14, 2, 0, Math.PI * 2);
    ctx.arc( 6, -h + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    // 넥타이
    ctx.fillStyle = '#cc2200';
    ctx.beginPath();
    ctx.moveTo(0, -h + 30);
    ctx.lineTo(-5, -h + 50);
    ctx.lineTo(0, -h + 55);
    ctx.lineTo(5, -h + 50);
    ctx.closePath();
    ctx.fill();

    // 다리 (걷기 애니메이션)
    ctx.fillStyle = '#222244';
    ctx.save();
    ctx.translate(-w / 2 + 17, -h * 0.35);
    ctx.rotate(Math.sin(t) * 0.4);
    ctx.fillRect(-9, 0, 18, h * 0.35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 17, -h * 0.35);
    ctx.rotate(-Math.sin(t) * 0.4);
    ctx.fillRect(-9, 0, 18, h * 0.35);
    ctx.restore();

    // 신발
    ctx.fillStyle = '#111';
    ctx.fillRect(-w / 2 + 6,  -8, 22, 10);
    ctx.fillRect( w / 2 - 28, -8, 22, 10);

    // 팔 (걷기 애니메이션)
    ctx.fillStyle = '#1a3a6a';
    ctx.save();
    ctx.translate(-w / 2 + 6, -h + 32);
    ctx.rotate(-Math.sin(t) * 0.4);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 6, -h + 32);
    ctx.rotate(Math.sin(t) * 0.4);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();
}

function drawStudentJump(w, h) {
    // 몸통
    ctx.fillStyle = '#1a3a6a';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

    // 머리
    ctx.fillStyle = '#f5c5a0';
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // 머리카락
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -h + 5, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 눈 (점프 - 크게)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-6, -h + 14, 5, 5, 0, 0, Math.PI * 2);
    ctx.ellipse( 6, -h + 14, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-6, -h + 14, 2.5, 0, Math.PI * 2);
    ctx.arc( 6, -h + 14, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 다리 (점프 - 구부림)
    ctx.fillStyle = '#222244';
    ctx.save();
    ctx.translate(-w / 2 + 17, -h * 0.35);
    ctx.rotate(-0.5);
    ctx.fillRect(-9, 0, 18, h * 0.3);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 17, -h * 0.35);
    ctx.rotate(0.5);
    ctx.fillRect(-9, 0, 18, h * 0.3);
    ctx.restore();

    // 팔 (점프 - 위로)
    ctx.fillStyle = '#1a3a6a';
    ctx.save();
    ctx.translate(-w / 2 + 6, -h + 32);
    ctx.rotate(-0.8);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 6, -h + 32);
    ctx.rotate(0.8);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();
}

function drawStudentAttack(w, h, type) {
    // 몸통
    ctx.fillStyle = '#1a3a6a';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

    // 머리 (공격 - 앞으로 기울임)
    ctx.save();
    ctx.translate(0, -h + 15);
    ctx.rotate(0.2);
    ctx.fillStyle = '#f5c5a0';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -10, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    // 눈 (공격 - 찡그림)
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(-6, 0, 4, 3, 0, 0, Math.PI * 2);
    ctx.ellipse( 6, 0, 4, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-6, 0, 2, 0, Math.PI * 2);
    ctx.arc( 6, 0, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 다리
    ctx.fillStyle = '#222244';
    ctx.fillRect(-w / 2 + 8,  -h * 0.35, 18, h * 0.35);
    ctx.fillRect( w / 2 - 26, -h * 0.35, 18, h * 0.35);

    // 신발
    ctx.fillStyle = '#111';
    ctx.fillRect(-w / 2 + 6,  -8, 22, 10);
    ctx.fillRect( w / 2 - 28, -8, 22, 10);

    // 공격 팔 (앞으로 뻗음)
    ctx.fillStyle = '#1a3a6a';
    ctx.save();
    ctx.translate(w / 2 - 6, -h + 40);
    ctx.rotate(-0.3);
    ctx.fillRect(-6, 0, 12, 55);
    ctx.restore();

    // 주먹 / 발 이펙트
    if (type === 'kick') {
        ctx.fillStyle = '#222244';
        ctx.save();
        ctx.translate(w / 2 + 20, -h * 0.4);
        ctx.rotate(-0.5);
        ctx.fillRect(-9, 0, 18, 30);
        ctx.restore();
        // 킥 이펙트
        ctx.fillStyle   = '#ffdd0088';
        ctx.shadowColor = '#ffdd00';
        ctx.shadowBlur  = 15;
        ctx.beginPath();
        ctx.arc(w / 2 + 30, -h * 0.35, 18, 0, Math.PI * 2);
        ctx.fill();
    } else {
        // 주먹
        ctx.fillStyle   = '#f5c5a0';
        ctx.shadowColor = '#ff8800';
        ctx.shadowBlur  = 15;
        ctx.beginPath();
        ctx.arc(w / 2 + 20, -h + 50, 10, 0, Math.PI * 2);
        ctx.fill();

        if (type === 'heavy' || type === 'special') {
            // 강공격 이펙트
            ctx.fillStyle   = type === 'special' ? '#ffdd0099' : '#ff880066';
            ctx.shadowColor = type === 'special' ? '#ffdd00'   : '#ff8800';
            ctx.shadowBlur  = 25;
            ctx.beginPath();
            ctx.arc(w / 2 + 30, -h + 50, 22, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawStudentHurt(w, h) {
    ctx.save();
    ctx.rotate(-0.2);

    // 몸통
    ctx.fillStyle = '#1a3a6a';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

    // 머리 (뒤로 젖힘)
    ctx.fillStyle = '#f5c5a0';
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -h + 5, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // 눈 (X 표시)
    ctx.strokeStyle = '#222';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(-9, -h + 11); ctx.lineTo(-3, -h + 17);
    ctx.moveTo(-3, -h + 11); ctx.lineTo(-9, -h + 17);
    ctx.moveTo( 3, -h + 11); ctx.lineTo( 9, -h + 17);
    ctx.moveTo( 9, -h + 11); ctx.lineTo( 3, -h + 17);
    ctx.stroke();

    // 다리
    ctx.fillStyle = '#222244';
    ctx.fillRect(-w / 2 + 8,  -h * 0.35, 18, h * 0.35);
    ctx.fillRect( w / 2 - 26, -h * 0.35, 18, h * 0.35);

    // 신발
    ctx.fillStyle = '#111';
    ctx.fillRect(-w / 2 + 6,  -8, 22, 10);
    ctx.fillRect( w / 2 - 28, -8, 22, 10);

    // 팔 (뒤로)
    ctx.fillStyle = '#1a3a6a';
    ctx.save();
    ctx.translate(-w / 2 + 6, -h + 32);
    ctx.rotate(-1.0);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 6, -h + 32);
    ctx.rotate(1.0);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    // 피격 이펙트
    ctx.fillStyle   = '#ff000044';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur  = 20;
    ctx.beginPath();
    ctx.arc(0, -h / 2, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

function drawStudentGuard(w, h) {
    // 몸통
    ctx.fillStyle = '#1a3a6a';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

        // 머리 (숙임)
    ctx.save();
    ctx.translate(0, -h + 20);
    ctx.rotate(0.3);
    ctx.fillStyle = '#f5c5a0';
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(0, -10, 18, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 팔 (방어 자세 - 앞으로 교차)
    ctx.fillStyle = '#1a3a6a';
    ctx.save();
    ctx.translate(-w / 2 + 6, -h + 32);
    ctx.rotate(0.6);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 6, -h + 32);
    ctx.rotate(-0.6);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    // 다리 (방어 - 낮춤)
    ctx.fillStyle = '#222244';
    ctx.save();
    ctx.translate(-w / 2 + 17, -h * 0.3);
    ctx.rotate(0.3);
    ctx.fillRect(-9, 0, 18, h * 0.3);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 17, -h * 0.3);
    ctx.rotate(-0.3);
    ctx.fillRect(-9, 0, 18, h * 0.3);
    ctx.restore();

    // 방어 쉴드 이펙트
    ctx.strokeStyle = '#00ccff';
    ctx.lineWidth   = 3;
    ctx.shadowColor = '#00ccff';
    ctx.shadowBlur  = 20;
    ctx.beginPath();
    ctx.arc(w / 2, -h * 0.5, 40, -Math.PI * 0.7, Math.PI * 0.7);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function drawStudentDown(w, h) {
    ctx.save();
    ctx.rotate(Math.PI / 2);

    // 몸통 (쓰러짐)
    ctx.fillStyle = '#1a3a6a';
    ctx.fillRect(-h * 0.45, -w / 2 + 5, h * 0.45, w - 10);

    // 머리
    ctx.fillStyle = '#f5c5a0';
    ctx.beginPath();
    ctx.ellipse(-h + 15, 0, 20, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.ellipse(-h + 5, 0, 12, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // 눈 (X)
    ctx.strokeStyle = '#222';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(-h + 9, -6);  ctx.lineTo(-h + 15, 0);
    ctx.moveTo(-h + 15, -6); ctx.lineTo(-h + 9,  0);
    ctx.moveTo(-h + 17, -6); ctx.lineTo(-h + 23, 0);
    ctx.moveTo(-h + 23, -6); ctx.lineTo(-h + 17, 0);
    ctx.stroke();

    // 별 이펙트 (기절)
    ctx.fillStyle   = '#ffdd00';
    ctx.shadowColor = '#ffdd00';
    ctx.shadowBlur  = 10;
    for (let i = 0; i < 3; i++) {
        const angle = (Date.now() * 0.003) + i * (Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.arc(
            -h + 15 + Math.cos(angle) * 25,
            Math.sin(angle) * 15,
            5, 0, Math.PI * 2
        );
        ctx.fill();
    }

    ctx.restore();
}

// ================================================
//  교수 캐릭터 드로잉
// ================================================
function drawProfIdle(w, h) {
    // 정장 몸통
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

    // 와이셔츠
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-w / 2 + 14, -h + 30, w - 28, h * 0.3);

    // 넥타이
    ctx.fillStyle = '#8800cc';
    ctx.beginPath();
    ctx.moveTo(0, -h + 30);
    ctx.lineTo(-5, -h + 52);
    ctx.lineTo(0, -h + 58);
    ctx.lineTo(5, -h + 52);
    ctx.closePath();
    ctx.fill();

    // 머리
    ctx.fillStyle = '#f0c090';
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 19, 21, 0, 0, Math.PI * 2);
    ctx.fill();

    // 흰머리
    ctx.fillStyle = '#dddddd';
    ctx.beginPath();
    ctx.ellipse(0, -h + 5, 19, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // 안경
    ctx.strokeStyle = '#444';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(-7, -h + 14, 5, 0, Math.PI * 2);
    ctx.arc( 7, -h + 14, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-2, -h + 14);
    ctx.lineTo( 2, -h + 14);
    ctx.stroke();

    // 눈
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-7, -h + 14, 2, 0, Math.PI * 2);
    ctx.arc( 7, -h + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    // 콧수염
    ctx.fillStyle   = '#888';
    ctx.strokeStyle = '#888';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(-8, -h + 22);
    ctx.quadraticCurveTo(-4, -h + 20, 0, -h + 22);
    ctx.quadraticCurveTo( 4, -h + 20, 8, -h + 22);
    ctx.stroke();

    // 다리
    ctx.fillStyle = '#111122';
    ctx.fillRect(-w / 2 + 8,  -h * 0.35, 18, h * 0.35);
    ctx.fillRect( w / 2 - 26, -h * 0.35, 18, h * 0.35);

    // 구두
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(-w / 2 + 5,  -8, 24, 10);
    ctx.fillRect( w / 2 - 29, -8, 24, 10);

    // 팔
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-w / 2,      -h + 32, 12, 35);
    ctx.fillRect( w / 2 - 12, -h + 32, 12, 35);

    // 손
    ctx.fillStyle = '#f0c090';
    ctx.beginPath();
    ctx.arc(-w / 2 + 6,  -h + 68, 7, 0, Math.PI * 2);
    ctx.arc( w / 2 - 6,  -h + 68, 7, 0, Math.PI * 2);
    ctx.fill();
}

function drawProfWalk(w, h) {
    const t = Date.now() * 0.01;

    // 정장 몸통
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

    // 와이셔츠
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-w / 2 + 14, -h + 30, w - 28, h * 0.3);

    // 넥타이
    ctx.fillStyle = '#8800cc';
    ctx.beginPath();
    ctx.moveTo(0, -h + 30);
    ctx.lineTo(-5, -h + 52);
    ctx.lineTo(0, -h + 58);
    ctx.lineTo(5, -h + 52);
    ctx.closePath();
    ctx.fill();

    // 머리
    ctx.fillStyle = '#f0c090';
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 19, 21, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dddddd';
    ctx.beginPath();
    ctx.ellipse(0, -h + 5, 19, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // 안경
    ctx.strokeStyle = '#444';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(-7, -h + 14, 5, 0, Math.PI * 2);
    ctx.arc( 7, -h + 14, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-2, -h + 14);
    ctx.lineTo( 2, -h + 14);
    ctx.stroke();

    // 눈
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(-7, -h + 14, 2, 0, Math.PI * 2);
    ctx.arc( 7, -h + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    // 다리 (걷기)
    ctx.fillStyle = '#111122';
    ctx.save();
    ctx.translate(-w / 2 + 17, -h * 0.35);
    ctx.rotate(Math.sin(t) * 0.4);
    ctx.fillRect(-9, 0, 18, h * 0.35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 17, -h * 0.35);
    ctx.rotate(-Math.sin(t) * 0.4);
    ctx.fillRect(-9, 0, 18, h * 0.35);
    ctx.restore();

    // 구두
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(-w / 2 + 5,  -8, 24, 10);
    ctx.fillRect( w / 2 - 29, -8, 24, 10);

    // 팔 (걷기)
    ctx.fillStyle = '#1a1a2e';
    ctx.save();
    ctx.translate(-w / 2 + 6, -h + 32);
    ctx.rotate(-Math.sin(t) * 0.4);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 6, -h + 32);
    ctx.rotate(Math.sin(t) * 0.4);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();
}

function drawProfJump(w, h) {
    // 정장 몸통
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-w / 2 + 14, -h + 30, w - 28, h * 0.3);

    // 머리
    ctx.fillStyle = '#f0c090';
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 19, 21, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dddddd';
    ctx.beginPath();
    ctx.ellipse(0, -h + 5, 19, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // 안경
    ctx.strokeStyle = '#444';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(-7, -h + 14, 5, 0, Math.PI * 2);
    ctx.arc( 7, -h + 14, 5, 0, Math.PI * 2);
    ctx.stroke();

    // 다리 (점프 - 구부림)
    ctx.fillStyle = '#111122';
    ctx.save();
    ctx.translate(-w / 2 + 17, -h * 0.35);
    ctx.rotate(-0.6);
    ctx.fillRect(-9, 0, 18, h * 0.3);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 17, -h * 0.35);
    ctx.rotate(0.6);
    ctx.fillRect(-9, 0, 18, h * 0.3);
    ctx.restore();

    // 팔 (점프 - 위로)
    ctx.fillStyle = '#1a1a2e';
    ctx.save();
    ctx.translate(-w / 2 + 6, -h + 32);
    ctx.rotate(-1.0);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 6, -h + 32);
    ctx.rotate(1.0);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();
}

function drawProfAttack(w, h, type) {
    // 정장 몸통
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-w / 2 + 14, -h + 30, w - 28, h * 0.3);

        // 머리 (공격 - 앞으로)
    ctx.save();
    ctx.translate(0, -h + 15);
    ctx.rotate(0.25);
    ctx.fillStyle = '#f0c090';
    ctx.beginPath();
    ctx.ellipse(0, 0, 19, 21, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dddddd';
    ctx.beginPath();
    ctx.ellipse(0, -10, 19, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // 안경 (공격 중)
    ctx.strokeStyle = '#444';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(-7, 0, 5, 0, Math.PI * 2);
    ctx.arc( 7, 0, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.lineTo( 2, 0);
    ctx.stroke();

    // 눈 (공격 - 부릅뜸)
    ctx.fillStyle = '#ff2200';
    ctx.beginPath();
    ctx.arc(-7, 0, 2.5, 0, Math.PI * 2);
    ctx.arc( 7, 0, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 콧수염
    ctx.strokeStyle = '#888';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(-8, 8);
    ctx.quadraticCurveTo(-4, 6, 0, 8);
    ctx.quadraticCurveTo( 4, 6, 8, 8);
    ctx.stroke();
    ctx.restore();

    // 다리
    ctx.fillStyle = '#111122';
    ctx.fillRect(-w / 2 + 8,  -h * 0.35, 18, h * 0.35);
    ctx.fillRect( w / 2 - 26, -h * 0.35, 18, h * 0.35);

    // 구두
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(-w / 2 + 5,  -8, 24, 10);
    ctx.fillRect( w / 2 - 29, -8, 24, 10);

    // 공격 팔 (앞으로 뻗음)
    ctx.fillStyle = '#1a1a2e';
    ctx.save();
    ctx.translate(w / 2 - 6, -h + 38);
    ctx.rotate(-0.4);
    ctx.fillRect(-6, 0, 12, 55);
    ctx.restore();

    // 반대 팔
    ctx.fillStyle = '#1a1a2e';
    ctx.save();
    ctx.translate(-w / 2 + 6, -h + 32);
    ctx.rotate(0.3);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    // 공격 타입별 이펙트
    if (type === 'kick') {
        // 발차기
        ctx.fillStyle = '#111122';
        ctx.save();
        ctx.translate(w / 2 + 15, -h * 0.45);
        ctx.rotate(-0.6);
        ctx.fillRect(-9, 0, 18, 32);
        ctx.restore();

        ctx.fillStyle   = '#cc00ff88';
        ctx.shadowColor = '#cc00ff';
        ctx.shadowBlur  = 20;
        ctx.beginPath();
        ctx.arc(w / 2 + 28, -h * 0.38, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

    } else if (type === 'rush') {
        // 돌진 공격
        ctx.fillStyle   = '#ff000066';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur  = 30;
        ctx.beginPath();
        ctx.arc(w / 2 + 25, -h * 0.5, 28, 0, Math.PI * 2);
        ctx.fill();

        // 돌진 잔상
        for (let i = 1; i <= 3; i++) {
            ctx.fillStyle = `rgba(26,26,46,${0.3 - i * 0.08})`;
            ctx.fillRect(
                -w / 2 + 5 - i * 15,
                -h + 30,
                w - 10,
                h * 0.45
            );
        }
        ctx.shadowBlur = 0;

    } else if (type === 'heavy') {
        // 강공격
        ctx.fillStyle   = '#ff880066';
        ctx.shadowColor = '#ff8800';
        ctx.shadowBlur  = 25;
        ctx.beginPath();
        ctx.arc(w / 2 + 22, -h + 48, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

    } else {
        // 기본 주먹
        ctx.fillStyle   = '#f0c090';
        ctx.shadowColor = '#ff8800';
        ctx.shadowBlur  = 12;
        ctx.beginPath();
        ctx.arc(w / 2 + 18, -h + 50, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function drawProfHurt(w, h) {
    ctx.save();
    ctx.rotate(-0.25);

    // 정장 몸통
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-w / 2 + 14, -h + 30, w - 28, h * 0.3);

    // 머리 (뒤로 젖힘)
    ctx.fillStyle = '#f0c090';
    ctx.beginPath();
    ctx.ellipse(0, -h + 15, 19, 21, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dddddd';
    ctx.beginPath();
    ctx.ellipse(0, -h + 5, 19, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // 안경 (삐뚤어짐)
    ctx.save();
    ctx.translate(0, -h + 14);
    ctx.rotate(0.2);
    ctx.strokeStyle = '#444';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(-7, 0, 5, 0, Math.PI * 2);
    ctx.arc( 7, 0, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 눈 (X 표시)
    ctx.strokeStyle = '#222';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -h + 11); ctx.lineTo(-4, -h + 17);
    ctx.moveTo(-4,  -h + 11); ctx.lineTo(-10,-h + 17);
    ctx.moveTo( 4,  -h + 11); ctx.lineTo(10, -h + 17);
    ctx.moveTo( 10, -h + 11); ctx.lineTo( 4, -h + 17);
    ctx.stroke();

    // 다리
    ctx.fillStyle = '#111122';
    ctx.fillRect(-w / 2 + 8,  -h * 0.35, 18, h * 0.35);
    ctx.fillRect( w / 2 - 26, -h * 0.35, 18, h * 0.35);

    // 구두
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(-w / 2 + 5,  -8, 24, 10);
    ctx.fillRect( w / 2 - 29, -8, 24, 10);

    // 팔 (뒤로 날아감)
    ctx.fillStyle = '#1a1a2e';
    ctx.save();
    ctx.translate(-w / 2 + 6, -h + 32);
    ctx.rotate(-1.2);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 6, -h + 32);
    ctx.rotate(1.2);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    // 피격 이펙트
    ctx.fillStyle   = '#ff000055';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur  = 25;
    ctx.beginPath();
    ctx.arc(0, -h / 2, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.restore();
}

function drawProfGuard(w, h) {
    // 정장 몸통
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-w / 2 + 5, -h + 30, w - 10, h * 0.45);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-w / 2 + 14, -h + 30, w - 28, h * 0.3);

    // 머리 (숙임)
    ctx.save();
    ctx.translate(0, -h + 20);
    ctx.rotate(0.35);
    ctx.fillStyle = '#f0c090';
    ctx.beginPath();
    ctx.ellipse(0, 0, 19, 21, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dddddd';
    ctx.beginPath();
    ctx.ellipse(0, -10, 19, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 팔 (방어 - 교차)
    ctx.fillStyle = '#1a1a2e';
    ctx.save();
    ctx.translate(-w / 2 + 6, -h + 32);
    ctx.rotate(0.7);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 6, -h + 32);
    ctx.rotate(-0.7);
    ctx.fillRect(-6, 0, 12, 35);
    ctx.restore();

    // 다리 (방어 - 낮춤)
    ctx.fillStyle = '#111122';
    ctx.save();
    ctx.translate(-w / 2 + 17, -h * 0.3);
    ctx.rotate(0.3);
    ctx.fillRect(-9, 0, 18, h * 0.3);
    ctx.restore();

    ctx.save();
    ctx.translate(w / 2 - 17, -h * 0.3);
    ctx.rotate(-0.3);
    ctx.fillRect(-9, 0, 18, h * 0.3);
    ctx.restore();

    // 방어 쉴드 이펙트
    ctx.strokeStyle = '#cc00ff';
    ctx.lineWidth   = 3;
    ctx.shadowColor = '#cc00ff';
    ctx.shadowBlur  = 20;
    ctx.beginPath();
    ctx.arc(w / 2, -h * 0.5, 42, -Math.PI * 0.7, Math.PI * 0.7);
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function drawProfDown(w, h) {
    ctx.save();
    ctx.rotate(Math.PI / 2);

    // 몸통 (쓰러짐)
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(-h * 0.45, -w / 2 + 5, h * 0.45, w - 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-h * 0.3, -w / 2 + 14, h * 0.3, w - 28);

    // 머리
    ctx.fillStyle = '#f0c090';
    ctx.beginPath();
    ctx.ellipse(-h + 15, 0, 21, 19, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#dddddd';
    ctx.beginPath();
    ctx.ellipse(-h + 5, 0, 13, 19, 0, 0, Math.PI * 2);
    ctx.fill();

    // 안경 (바닥에 떨어짐)
    ctx.strokeStyle = '#444';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.arc(-h + 15, 25, 5, 0, Math.PI * 2);
    ctx.arc(-h + 25, 25, 5, 0, Math.PI * 2);
    ctx.stroke();

    // 눈 (X)
    ctx.strokeStyle = '#222';
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(-h + 9,  -6); ctx.lineTo(-h + 15, 0);
    ctx.moveTo(-h + 15, -6); ctx.lineTo(-h + 9,  0);
    ctx.moveTo(-h + 17, -6); ctx.lineTo(-h + 23, 0);
    ctx.moveTo(-h + 23, -6); ctx.lineTo(-h + 17, 0);
    ctx.stroke();

    // 별 이펙트 (기절)
    ctx.fillStyle   = '#ffdd00';
    ctx.shadowColor = '#ffdd00';
    ctx.shadowBlur  = 10;
    for (let i = 0; i < 3; i++) {
        const angle = (Date.now() * 0.003) + i * (Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.arc(
            -h + 15 + Math.cos(angle) * 28,
            Math.sin(angle) * 18,
            5, 0, Math.PI * 2
        );
        ctx.fill();
    }
    ctx.shadowBlur = 0;

    ctx.restore();
}

// ================================================
//  이펙트 드로잉
// ================================================
function drawParticles() {
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = Math.max(p.alpha, 0);
        ctx.fillStyle   = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur  = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.r, 0), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });
}

function drawDmgNumbers() {
    dmgNumbers.forEach(d => {
        ctx.save();
        ctx.globalAlpha  = Math.max(d.alpha, 0);
        ctx.fillStyle    = d.color;
        ctx.font         = `bold ${d.size}px Courier New`;
        ctx.textAlign    = 'center';
        ctx.shadowColor  = d.color;
        ctx.shadowBlur   = 10;
        ctx.fillText(d.text, d.x, d.y);
        ctx.restore();
    });
}

function drawHitEffects() {
    hitEffects.forEach(h => {
        ctx.save();
        ctx.globalAlpha  = Math.max(h.alpha, 0);
        ctx.strokeStyle  = '#ffdd00';
        ctx.lineWidth    = 3;
        ctx.shadowColor  = '#ffdd00';
        ctx.shadowBlur   = 15;
        ctx.beginPath();
        ctx.arc(h.x, h.y, h.r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
    });
}

function drawCombo() {
    if (comboCount >= 2 && comboTimer > 0) {
        ctx.save();
        ctx.fillStyle   = '#ffdd00';
        ctx.font        = `bold ${24 + comboCount}px Courier New`;
        ctx.textAlign   = 'center';
        ctx.shadowColor = '#ff8800';
        ctx.shadowBlur  = 20;
        ctx.fillText(
            comboCount + ' HIT COMBO!!',
            canvas.width / 2,
            canvas.height - 60
        );
        ctx.restore();
    }
}

function drawAttackBoxes() {
    // 디버그용 (필요시 주석 해제)
    /*
    if (player.attackBox) {
        ctx.strokeStyle = 'rgba(0,255,0,0.5)';
        ctx.lineWidth   = 2;
        ctx.strokeRect(
            player.attackBox.x, player.attackBox.y,
            player.attackBox.w, player.attackBox.h
        );
    }
    if (boss.attackBox) {
        ctx.strokeStyle = 'rgba(255,0,0,0.5)';
        ctx.lineWidth   = 2;
        ctx.strokeRect(
            boss.attackBox.x, boss.attackBox.y,
            boss.attackBox.w, boss.attackBox.h
        );
    }
    */
}

function drawShadows() {
    // 플레이어 그림자
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle   = '#000';
    ctx.beginPath();
    ctx.ellipse(player.x, GROUND_Y + 5, 30, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 보스 그림자
    ctx.save();
    ctx.globalAlpha = 0.3;
    ctx.fillStyle   = '#000';
    ctx.beginPath();
    ctx.ellipse(boss.x, GROUND_Y + 5, 33, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function drawDistanceWarning() {
    const dist = Math.abs(player.x - boss.x);
    if (dist > 600) {
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle   = '#ff2200';
        ctx.font        = 'bold 14px Courier New';
        ctx.textAlign   = 'center';
        ctx.fillText('⚠ 너무 멀어지고 있습니다!', canvas.width / 2, 30);
        ctx.restore();
    }
}

// ================================================
//  메인 게임 루프
// ================================================
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 배경
    drawBackground();

    // 그림자
    drawShadows();

    if (!roundPause) {
        // 입력 처리
        handlePlayerInput();

        // AI 처리
        updateAI();

        // 물리 업데이트
        updatePhysics(player);
        updatePhysics(boss);

        // 캐릭터 방향 자동 조정
        if (player.state !== 'attack' && player.state !== 'special') {
            if (boss.x > player.x) player.facing =  1;
            else                   player.facing = -1;
        }
        if (boss.state !== 'attack') {
            if (player.x > boss.x) boss.facing =  1;
            else                   boss.facing = -1;
        }

        // 이펙트 업데이트
        updateParticles();
        updateDmgNumbers();
        updateHitEffects();
        updateCombo();

        // HUD 업데이트
        updateHUD();
    }

    // 캐릭터 드로잉
    drawBoss();
    drawPlayer();

    // 이펙트 드로잉
    drawParticles();
    drawHitEffects();
    drawDmgNumbers();
    drawCombo();
    drawAttackBoxes();
    drawDistanceWarning();

    animId = requestAnimationFrame(gameLoop);
}

// ================================================
//  라운드 배너 표시
// ================================================
function showRoundBanner(text, callback, duration) {
    roundBanner.classList.remove('hidden');
    roundBannerText.textContent = text;

    // 애니메이션 재시작
    roundBannerText.style.animation = 'none';
    void roundBannerText.offsetWidth;
    roundBannerText.style.animation = '';

    setTimeout(() => {
        roundBanner.classList.add('hidden');
        if (callback) callback();
    }, duration);
}

function showKOBanner(text, color) {
    koBanner.classList.remove('hidden');
    koBannerText.textContent      = text;
    koBannerText.style.color      = color;
    koBannerText.style.textShadow =
        `0 0 50px ${color}, 0 0 100px ${color}88`;

    koBannerText.style.animation = 'none';
    void koBannerText.offsetWidth;
    koBannerText.style.animation = '';
}

// ================================================
//  라운드 종료
// ================================================
function endRound(winner) {
    if (roundPause) return;
    roundPause = true;
    clearInterval(timerInterval);

    const isPlayerWin = winner === 'player';
    const isDraw      = winner === 'draw';

    if (isPlayerWin) {
        p1Wins++;
        roundResults.push('WIN');
        showKOBanner('K.O.!', '#00ff88');
    } else if (isDraw) {
        roundResults.push('DRAW');
        showKOBanner('DRAW', '#ffdd00');
    } else {
        p2Wins++;
        roundResults.push('LOSE');
        showKOBanner('K.O.!', '#ff2200');
    }

    updateDots();

    setTimeout(() => {
        koBanner.classList.add('hidden');

        // 승리 조건 체크 (2선승)
        if (p1Wins >= 2) {
            if (currentRound + 1 >= MAX_ROUNDS) {
                // 모든 라운드 클리어
                showClear();
            } else {
                // 다음 라운드
                p1Wins = 0;
                p2Wins = 0;
                initRound(currentRound + 1);
            }
        } else if (p2Wins >= 2) {
            // 게임 오버
            showGameOver();
        } else {
            // 같은 라운드 재도전
            initRound(currentRound);
        }
    }, 2500);
}

// ================================================
//  클리어 화면
// ================================================
function showClear() {
    gameRunning = false;
    cancelAnimationFrame(animId);
    clearInterval(timerInterval);

    clearScreen.classList.remove('hidden');
    clearPlayerName.textContent = `🎓 ${playerName} 의 승리!`;

    clearStats.innerHTML = `
        <div class="stat-row">
            <span>총 가한 데미지</span>
            <span>${totalDmgDealt}</span>
        </div>
        <div class="stat-row">
            <span>클리어 라운드</span>
            <span>${MAX_ROUNDS} 라운드</span>
        </div>
        <div class="stat-row">
            <span>상대 교수님</span>
            <span>${bossName}</span>
        </div>
        <div class="stat-row">
            <span>라운드 결과</span>
            <span>${roundResults.join(' / ')}</span>
        </div>
    `;
}

// ================================================
//  게임 오버 화면
// ================================================
function showGameOver() {
    gameRunning = false;
    cancelAnimationFrame(animId);
    clearInterval(timerInterval);

    gameOverScreen.classList.remove('hidden');
    gameOverMsg.textContent =
        `${bossName} 에게 패배했습니다... 다시 도전하세요!`;
}

// ================================================
//  초기 실행
// ================================================
(function init() {
    // 캔버스 사이즈 재확인
    canvas.width  = 900;
    canvas.height = 506;

    // 입력 화면 엔터키 지원
    document.addEventListener('keydown', e => {
        if (e.code === 'Enter') {
            const btn = document.getElementById('gameStartBtn');
            if (btn && !inputScreen.classList.contains('hidden')) {
                btn.click();
            }
        }
    });

    // 마우스 클릭 공격 지원
    canvas.addEventListener('click', () => {
        if (!roundPause && gameRunning) {
            playerAttack('normal');
        }
    });

    // 우클릭 강공격
    canvas.addEventListener('contextmenu', e => {
        e.preventDefault();
        if (!roundPause && gameRunning) {
            playerAttack('heavy');
        }
    });

    console.log('🎮 철권 - 학생 vs 교수 게임 로드 완료!');
    console.log('조작법: ←→ 이동 | ↑ 점프 | ↓ 방어');
    console.log('Space: 기본공격 | Z: 강공격 | X: 킥 | C: 필살기');
})();






            
