// ================================================
//  ranking.js  ·  학교별 랭킹 시스템 (Firebase)
// ================================================

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    limit,
    where
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const db = window.db;

// ================================================
//  기록 저장
// ================================================
async function saveRecord(data) {
    console.log('💾 기록 저장 시작...');
    if (!db) {
        console.error('❌ Firebase DB 초기화 실패');
        return;
    }
    try {
        await addDoc(collection(db, 'records'), {
            playerName : data.playerName,
            school     : data.school,
            totalDmg   : data.totalDmg,
            clearRound : data.clearRound,
            results    : data.results,
            clearedAt  : new Date()
        });
        console.log('✅ 기록 저장 완료');
    } catch (e) {
        console.error('❌ 기록 저장 실패:', e.code, e.message);
    }
}

// ================================================
//  전체 랭킹 불러오기 (데미지 기준 TOP 20)
// ================================================
async function getGlobalRanking() {
    console.log('📊 전체 랭킹 조회 시작...');
    try {
        const q = query(
            collection(db, 'records'),
            orderBy('totalDmg', 'desc'),
            limit(20)
        );
        const snapshot = await getDocs(q);
        console.log(`✅ 랭킹 조회 성공: ${snapshot.size}개 문서`);
        return snapshot.docs.map((doc, idx) => ({
            rank  : idx + 1,
            id    : doc.id,
            ...doc.data()
        }));
    } catch (e) {
        console.error('❌ 랭킹 조회 실패:', e.code, e.message);
        throw e;
    }
}

// ================================================
//  학교별 랭킹 불러오기
// ================================================
async function getSchoolRanking(schoolName) {
    console.log(`🏫 ${schoolName} 랭킹 조회 시작...`);
    try {
        const q = query(
            collection(db, 'records'),
            where('school', '==', schoolName)
        );
        const snapshot = await getDocs(q);
        
        // 클라이언트 사이드에서 정렬 및 상위 10개만 가져오기
        const records = snapshot.docs
            .map(doc => ({
                id: doc.id,
                ...doc.data()
            }))
            .sort((a, b) => (b.totalDmg || 0) - (a.totalDmg || 0))
            .slice(0, 10)
            .map((doc, idx) => ({
                rank: idx + 1,
                ...doc
            }));
        
        console.log(`✅ ${schoolName} 랭킹 조회 성공: ${records.length}개`);
        return records;
    } catch (e) {
        console.error(`❌ ${schoolName} 랭킹 조회 실패:`, e.code, e.message);
        throw e;
    }
}

// ================================================
//  학교 목록 불러오기
// ================================================
async function getSchoolList() {
    console.log('🏫 학교 목록 조회 시작...');
    try {
        const snapshot = await getDocs(collection(db, 'records'));
        const schools  = new Set();
        snapshot.docs.forEach(doc => {
            if (doc.data().school) schools.add(doc.data().school);
        });
        console.log(`✅ 학교 목록 조회 성공: ${schools.size}개`);
        return [...schools].sort();
    } catch (e) {
        console.error('❌ 학교 목록 조회 실패:', e.code, e.message);
        throw e;
    }
}

// ================================================
//  랭킹 UI 렌더링
// ================================================
function renderRankingTable(records, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (records.length === 0) {
        container.innerHTML = `
            <div class="rank-empty">
                아직 기록이 없습니다 👾<br>
                <small>게임을 클리어하고 랭킹에 도전하세요!</small>
            </div>
        `;
        return;
    }

    const rows = records.map(r => {
        const medal =
            r.rank === 1 ? '🥇' :
            r.rank === 2 ? '🥈' :
            r.rank === 3 ? '🥉' : `#${r.rank}`;

        const date = r.clearedAt?.toDate
            ? r.clearedAt.toDate().toLocaleDateString('ko-KR')
            : typeof r.clearedAt === 'string'
            ? new Date(r.clearedAt).toLocaleDateString('ko-KR')
            : '-';

        return `
            <tr class="rank-row ${r.rank <= 3 ? 'top-rank' : ''}">
                <td class="rank-medal">${medal}</td>
                <td class="rank-name">${r.playerName}</td>
                <td class="rank-school">${r.school}</td>
                <td class="rank-dmg">${r.totalDmg.toLocaleString()}</td>
                <td class="rank-round">${r.clearRound}R</td>
                <td class="rank-date">${date}</td>
            </tr>
        `;
    }).join('');

    container.innerHTML = `
        <table class="rank-table">
            <thead>
                <tr>
                    <th>순위</th>
                    <th>이름</th>
                    <th>학교</th>
                    <th>총 데미지</th>
                    <th>클리어</th>
                    <th>날짜</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;
}

// ================================================
//  랭킹 화면 열기 / 닫기
// ================================================
async function openRankingScreen(defaultSchool = '') {
    const screen = document.getElementById('rankingScreen');
    if (screen) {
        screen.classList.remove('hidden');
    } else {
        const inputScreen   = document.getElementById('inputScreen');
        const gameScreen    = document.getElementById('gameScreen');
        const clearScreen   = document.getElementById('clearScreen');
        const gameOverScreen= document.getElementById('gameOverScreen');
        if (inputScreen) inputScreen.classList.remove('hidden');
        if (gameScreen)  gameScreen.classList.add('hidden');
        if (clearScreen) clearScreen.classList.add('hidden');
        if (gameOverScreen) gameOverScreen.classList.add('hidden');
    }

    // 학교 목록 로드
    const schools = await getSchoolList();
    const select  = document.getElementById('schoolFilter');
    if (!select) return;

    select.innerHTML = `<option value="">🌍 전체 랭킹</option>`;
    schools.forEach(s => {
        const opt       = document.createElement('option');
        opt.value       = s;
        opt.textContent = s;
        if (s === defaultSchool) opt.selected = true;
        select.appendChild(opt);
    });

    await loadRanking(defaultSchool);
}

async function loadRanking(schoolName = '') {
    const container = document.getElementById('rankingTableWrap');
    if (!container) return;

    try {
        container.innerHTML = '<div class="rank-loading">불러오는 중... ⏳</div>';
        const records = schoolName
            ? await getSchoolRanking(schoolName)
            : await getGlobalRanking();
        renderRankingTable(records, 'rankingTableWrap');
    } catch (error) {
        console.error('랭킹 로드 실패:', error);
        container.innerHTML = `
            <div class="rank-empty">
                랭킹 로드 실패 😞<br>
                <small>${error.message}</small>
            </div>
        `;
    }
}

function closeRankingScreen() {
    document.getElementById('rankingScreen').classList.add('hidden');
}

// ================================================
//  페이지 로드시 자동 랭킹 표시
// ================================================
async function initRankingPreview() {
    console.log('🎮 랭킹 미리보기 시작...');
    console.log('📌 DB 상태:', db ? '✅ 초기화됨' : '❌ 미초기화');
    
    const container = document.getElementById('rankingTableWrap');
    if (!container) {
        console.warn('⚠️ rankingTableWrap 요소가 없습니다');
        return;
    }

    const screen = document.getElementById('rankingScreen');
    if (screen) {
        screen.classList.remove('hidden');
    }

    // 학교 목록 로드
    try {
        const schools = await getSchoolList();
        const select  = document.getElementById('schoolFilter');
        if (select) {
            select.innerHTML = `<option value="">🌍 전체 랭킹</option>`;
            schools.forEach(s => {
                const opt       = document.createElement('option');
                opt.value       = s;
                opt.textContent = s;
                select.appendChild(opt);
            });
        }
    } catch (error) {
        console.error('❌ 학교 목록 로드 실패:', error.code, error.message);
    }

    // 전체 랭킹 자동 로드
    try {
        container.innerHTML = '<div class="rank-loading">불러오는 중... ⏳</div>';
        const records = await getGlobalRanking();
        renderRankingTable(records, 'rankingTableWrap');
    } catch (error) {
        console.error('❌ 랭킹 데이터 로드 실패:', error.code, error.message);
        container.innerHTML = `
            <div class="rank-empty">
                랭킹 로드 실패 😞<br>
                <small>${error.code}: ${error.message}</small><br>
                <small style="font-size: 0.8em;">콘솔을 확인하세요</small>
            </div>
        `;
    }
}

// ================================================
//  페이지 로드시 자동 실행
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(async () => {
        try {
            await initRankingPreview();
        } catch (error) {
            console.error('랭킹 로드 실패:', error);
            const container = document.getElementById('rankingTableWrap');
            if (container) {
                container.innerHTML = '<div class="rank-empty">랭킹 로드 실패 😞</div>';
            }
        }
    }, 500);
});

// ================================================
//  외부 노출
// ================================================
window.saveRecord         = saveRecord;
window.openRankingScreen  = openRankingScreen;
window.loadRanking        = loadRanking;
window.closeRankingScreen = closeRankingScreen;

