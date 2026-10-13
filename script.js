// ===================================================
// NAVEGACIÓN Y PANTALLAS
// ===================================================
const coverScreen = document.getElementById('cover-screen');
const menuScreen = document.getElementById('menu-screen');
const game1Screen = document.getElementById('game-1-screen');
const game2Screen = document.getElementById('game-2-screen');
const game3Screen = document.getElementById('game-3-screen');
const btnBack = document.getElementById('btn-back');

let currentGame = 0;

// Pasar de la Portada al Menú Principal
function enterMainMenu() {
    coverScreen.classList.add('hidden');
    coverScreen.classList.remove('active');

    menuScreen.classList.remove('hidden');
    menuScreen.classList.add('active');
}

function startGame(gameNumber) {
    currentGame = gameNumber;
    menuScreen.classList.remove('active');
    menuScreen.classList.add('hidden');
    btnBack.classList.remove('hidden');

    game1Screen.classList.add('hidden');
    game2Screen.classList.add('hidden');
    game3Screen.classList.add('hidden');

    if (gameNumber === 1) {
        game1Screen.classList.remove('hidden');
        game1Screen.classList.add('active');
        initGame1();
    } else if (gameNumber === 2) {
        game2Screen.classList.remove('hidden');
        game2Screen.classList.add('active');
        initGame2();
    } else if (gameNumber === 3) {
        game3Screen.classList.remove('hidden');
        game3Screen.classList.add('active');
        initGame3();
    }
}

function showMenu() {
    currentGame = 0;
    window.speechSynthesis.cancel();
    game1Screen.classList.add('hidden');
    game2Screen.classList.add('hidden');
    game3Screen.classList.add('hidden');

    game1Screen.classList.remove('active');
    game2Screen.classList.remove('active');
    game3Screen.classList.remove('active');

    menuScreen.classList.remove('hidden');
    menuScreen.classList.add('active');
    btnBack.classList.add('hidden');

    if (g3TimerInterval) clearInterval(g3TimerInterval);
}


// ===================================================
// SISTEMA DE ALARMA Y VOZ (100% ESPAÑOL)
// ===================================================

// Sirena de Emergencia Realista
function playRealisticEmergencySiren(count) {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtx();
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const toneDuration = 1.8; 
        const interval = 0.35;

        for (let i = 0; i < count; i++) {
            const startTime = audioCtx.currentTime + i * (toneDuration + interval);

            const osc1 = audioCtx.createOscillator();
            const osc2 = audioCtx.createOscillator();
            const gain = audioCtx.createGain();

            osc1.type = 'triangle';
            osc2.type = 'sine';

            osc1.frequency.setValueAtTime(415, startTime);
            osc2.frequency.setValueAtTime(523, startTime);

            osc1.frequency.linearRampToValueAtTime(466, startTime + toneDuration * 0.5);
            osc2.frequency.linearRampToValueAtTime(587, startTime + toneDuration * 0.5);

            osc1.frequency.linearRampToValueAtTime(415, startTime + toneDuration);
            osc2.frequency.linearRampToValueAtTime(523, startTime + toneDuration);

            gain.gain.setValueAtTime(0.01, startTime);
            gain.gain.linearRampToValueAtTime(0.18, startTime + 0.1);
            gain.gain.setValueAtTime(0.18, startTime + toneDuration - 0.15);
            gain.gain.linearRampToValueAtTime(0.01, startTime + toneDuration);

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(audioCtx.destination);

            osc1.start(startTime);
            osc2.start(startTime);
            osc1.stop(startTime + toneDuration);
            osc2.stop(startTime + toneDuration);
        }
    } catch (e) {
        console.log("Audio no soportado");
    }
}

// Locución de Voz Potente e Inteligible en Español
function speakAlarmInstruction(type) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();

        let message = "";
        if (type === 1) {
            message = "Atención comunidad de Puracé. Un timbre: Alistamiento. Por favor prepare su maletín de emergencia y manténganse atentos a la información oficial.";
        } else if (type === 2) {
            message = "Atención comunidad de Puracé. Dos timbres: Caída de ceniza volcánica. Por favor ingrese inmediatamente a sus viviendas, cierre puertas y ventanas, y proteja los depósitos de agua.";
        } else if (type === 3) {
            message = "¡Atención alerta sísmica en Puracé! Tres timbres: Evacuación inmediata. Mantenga la calma y diríjase hacia la Cancha Municipal o la Plaza Principal.";
        }

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = 'es-CO';
        utterance.rate = 0.90;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const selectVoice = voices.find(v => v.lang.includes('es'));
        if (selectVoice) {
            utterance.voice = selectVoice;
        }

        setTimeout(() => {
            window.speechSynthesis.speak(utterance);
        }, 300);
    }
}


// ===================================================
// JUEGO 1: TRIVIAS Y ADIVINANZAS DE PURACÉ
// ===================================================
const g1Questions = [
    {
        q: "🌋 ADIVINANZA: 'Tengo un gran sombrero de vapor y ceniza, si me enojo tiembla la tierra de prisa. ¿Quién soy?'",
        opts: ["El Volcán Puracé", "El Río Cauca", "La Laguna del Buey", "El Parque Principal"],
        ans: 0
    },
    {
        q: "💧 ADIVINANZA: 'Mis aguas son de color turquesa y brotan calientes desde las entrañas de la tierra en el Páramo. ¿Qué lugar soy?'",
        opts: ["La Iglesia de Puracé", "Los Termales de San Juan", "El Volcán Galeras", "La Laguna de los Patos"],
        ans: 1
    },
    {
        q: "🎒 ¿Qué elementos deben ir en tu Mochila de Emergencia?",
        opts: ["Juegos de mesa y ropa de fiesta", "Agua embotellada, linterna y botiquín", "Libros pesados y cobijas de lana", "Solo comida de paquete"],
        ans: 1
    },
    {
        q: "🚨 Si la sirena comunitaria suena 1 SOLO TIMBRE, ¿qué debemos hacer?",
        opts: ["Salir corriendo a evacuar", "Estado de Alistamiento: Estar atentos y revisar la mochila", "Entrar a la iglesia", "Ir a jugar fútbol"],
        ans: 1
    },
    {
        q: "🫨 Si la sirena suena 3 TIMBRES continuos, ¿cuál es la instrucción oficial?",
        opts: ["EVACUACIÓN INMEDIATA hacia la Cancha o Parque Central", "Permanecer dentro de la casa", "Subir al volcán", "Ignorar la sirena"],
        ans: 0
    }
];

let g1QIdx = 0, g1Score = 0, g1Lives = 3;

function initGame1() {
    g1QIdx = 0; g1Score = 0; g1Lives = 3;
    document.getElementById('g1-score').innerText = g1Score;
    document.getElementById('g1-lives').innerText = g1Lives;
    document.getElementById('g1-quiz-box').classList.remove('hidden');
    document.getElementById('g1-end-box').classList.add('hidden');
    loadG1Question();
}

function loadG1Question() {
    const currentQ = g1Questions[g1QIdx];

    document.getElementById('g1-badge').innerText = `Adivinanza ${g1QIdx + 1} de ${g1Questions.length}`;
    document.getElementById('g1-question-text').innerText = currentQ.q;
    document.getElementById('g1-feedback').innerText = "";

    const optsContainer = document.getElementById('g1-options');
    optsContainer.innerHTML = "";

    currentQ.opts.forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = `${String.fromCharCode(65 + idx)}. ${opt}`;
        btn.onclick = () => selectG1Option(idx);
        optsContainer.appendChild(btn);
    });
}

function selectG1Option(idx) {
    const currentQ = g1Questions[g1QIdx];
    const btns = document.querySelectorAll('#g1-options .opt-btn');
    btns.forEach(b => b.style.pointerEvents = 'none');

    const feedback = document.getElementById('g1-feedback');

    if (idx === currentQ.ans) {
        btns[idx].classList.add('correct');
        g1Score += 20;
        document.getElementById('g1-score').innerText = g1Score;
        feedback.innerText = "¡RESPUESTA CORRECTA! 👏";
        feedback.style.color = "#4ade80";
    } else {
        btns[idx].classList.add('wrong');
        btns[currentQ.ans].classList.add('correct');
        g1Lives--;
        document.getElementById('g1-lives').innerText = g1Lives;
        feedback.innerText = "❌ Incorrecto. ¡Sigue aprendiendo!";
        feedback.style.color = "#f43f5e";
    }

    setTimeout(() => {
        if (g1Lives <= 0) {
            showG1End(false);
        } else {
            g1QIdx++;
            if (g1QIdx >= g1Questions.length) {
                showG1End(true);
            } else {
                loadG1Question();
            }
        }
    }, 1500);
}

function showG1End(won) {
    document.getElementById('g1-quiz-box').classList.add('hidden');
    const endBox = document.getElementById('g1-end-box');
    endBox.classList.remove('hidden');

    if (won) {
        document.getElementById('g1-end-title').innerText = "🏆 ¡EXCELENTE TRABAJO!";
        document.getElementById('g1-end-msg').innerText = `Puntaje Final: ${g1Score} pts. ¡Demostraste conocer muy bien los riesgos e historia de Puracé!`;
    } else {
        document.getElementById('g1-end-title').innerText = "💔 FIN DEL JUEGO";
        document.getElementById('g1-end-msg').innerText = `Te quedaste sin vidas. ¡Repasa las normas y vuelve a intentarlo!`;
    }
}


// ===================================================
// JUEGO 2: SIMULADOR POBLADO (70 PERSONAS + ANIMALES + 10 CASAS)
// ===================================================
let canvas2, ctx2;
let alarmState = 0;
const villagers = [];
const animals = [];

// Zonas Seguras
const zoneParque = { x: 530, y: 320, w: 220, h: 180, title: "🌳 Plaza Principal / ZONA SEGURA B" };
const zoneCancha = { x: 50, y: 380, w: 220, h: 140, title: "⚽ Cancha Municipal / ZONA SEGURA A" };

// 10 Casas del Pueblo
const puraceHouses = [
    { x: 30, y: 220, w: 80, h: 65 },
    { x: 120, y: 200, w: 75, h: 60 },
    { x: 205, y: 185, w: 75, h: 55 },
    { x: 290, y: 175, w: 70, h: 50 },
    { x: 750, y: 210, w: 85, h: 65 },
    { x: 845, y: 235, w: 80, h: 65 },
    { x: 30, y: 310, w: 75, h: 60 },
    { x: 115, y: 290, w: 75, h: 60 },
    { x: 760, y: 290, w: 80, h: 65 },
    { x: 850, y: 315, w: 80, h: 65 }
];

function initGame2() {
    canvas2 = document.getElementById('canvasGame2');
    ctx2 = canvas2.getContext('2d');

    villagers.length = 0;
    animals.length = 0;

    for (let i = 0; i < 70; i++) {
        const home = puraceHouses[i % puraceHouses.length];
        villagers.push({
            x: 60 + Math.random() * 830,
            y: 260 + Math.random() * 120,
            targetX: 60 + Math.random() * 830,
            targetY: 260 + Math.random() * 120,
            homeX: home.x + 15 + Math.random() * (home.w - 30),
            homeY: home.y + 20 + Math.random() * (home.h - 30),
            speed: 1.1 + Math.random() * 1.6,
            assignedZone: (i % 2 === 0) ? zoneParque : zoneCancha,
            animTimer: Math.random() * 10
        });
    }

    const animalTypes = ['dog', 'cow', 'sheep'];
    for (let j = 0; j < 12; j++) {
        const home = puraceHouses[j % puraceHouses.length];
        animals.push({
            x: 100 + Math.random() * 750,
            y: 280 + Math.random() * 90,
            targetX: 100 + Math.random() * 750,
            targetY: 280 + Math.random() * 90,
            homeX: home.x + 5,
            homeY: home.y + home.h + 10,
            speed: 0.8 + Math.random() * 1.2,
            type: animalTypes[j % animalTypes.length],
            assignedZone: (j % 2 === 0) ? zoneParque : zoneCancha,
            animTimer: Math.random() * 10
        });
    }

    alarmState = 0;
    document.getElementById('g2-status').innerText = "Normalidad";
    requestAnimationFrame(loopGame2);
}

function triggerAlarm(type) {
    alarmState = type;
    
    playRealisticEmergencySiren(type);
    speakAlarmInstruction(type);

    const wrapper = document.getElementById('canvas-wrapper-2');
    const statusText = document.getElementById('g2-status');

    if (type === 1) {
        wrapper.classList.remove('shake-canvas');
        statusText.innerText = "1 Timbre: Alistamiento de la Población";
        statusText.style.color = "#f97316";
    } else if (type === 2) {
        wrapper.classList.remove('shake-canvas');
        statusText.innerText = "2 Timbres: Caída de Ceniza (Abrigarse en Casas)";
        statusText.style.color = "#94a3b8";
    } else if (type === 3) {
        wrapper.classList.add('shake-canvas');
        statusText.innerText = "3 Timbres: Sismo / Evacuación a Zonas Seguras";
        statusText.style.color = "#ef4444";
    }
}

function drawPuraceChurch(wallColor, roofColor) {
    const x = 500, y = 50;

    ctx2.fillStyle = wallColor; ctx2.fillRect(x, y + 50, 240, 150);
    ctx2.strokeStyle = '#cbd5e1'; ctx2.lineWidth = 2; ctx2.strokeRect(x, y + 50, 240, 150);

    ctx2.beginPath(); ctx2.arc(x + 60, y + 45, 30, Math.PI, 0); ctx2.fill(); ctx2.stroke();
    ctx2.fillRect(x + 55, y + 5, 10, 12);

    ctx2.fillRect(x + 180, y, 50, 120);
    ctx2.strokeRect(x + 180, y, 50, 120);
    ctx2.beginPath(); ctx2.moveTo(x + 175, y); ctx2.lineTo(x + 205, y - 45); ctx2.lineTo(x + 235, y); ctx2.fill();

    ctx2.fillStyle = roofColor;
    ctx2.fillRect(x, y + 45, 180, 12);

    ctx2.fillStyle = '#451a03';
    ctx2.beginPath(); ctx2.arc(x + 120, y + 160, 22, Math.PI, 0); ctx2.fillRect(x + 98, y + 160, 44, 40); ctx2.fill();
}

function drawAnimal(a) {
    a.animTimer += 0.1;
    const bounce = Math.sin(a.animTimer) * 2;

    if (a.type === 'dog') {
        ctx2.fillStyle = '#b45309';
        ctx2.fillRect(a.x - 6, a.y - 4 + bounce, 12, 7);
        ctx2.beginPath(); ctx2.arc(a.x + 6, a.y - 6 + bounce, 4, 0, Math.PI * 2); ctx2.fill();
        ctx2.fillStyle = '#78350f';
        ctx2.fillRect(a.x - 5, a.y + 3, 2, 4); ctx2.fillRect(a.x + 3, a.y + 3, 2, 4);
    } else if (a.type === 'cow') {
        ctx2.fillStyle = '#f8fafc';
        ctx2.fillRect(a.x - 10, a.y - 8 + bounce, 20, 12);
        ctx2.fillStyle = '#0f172a';
        ctx2.fillRect(a.x - 6, a.y - 6 + bounce, 5, 5); ctx2.fillRect(a.x + 2, a.y - 4 + bounce, 4, 4);
        ctx2.fillStyle = '#f8fafc';
        ctx2.fillRect(a.x + 8, a.y - 12 + bounce, 7, 7);
        ctx2.fillStyle = '#0f172a';
        ctx2.fillRect(a.x - 8, a.y + 4, 3, 6); ctx2.fillRect(a.x + 5, a.y + 4, 3, 6);
    } else if (a.type === 'sheep') {
        ctx2.fillStyle = '#f1f5f9';
        ctx2.beginPath(); ctx2.arc(a.x, a.y - 3 + bounce, 8, 0, Math.PI * 2); ctx2.fill();
        ctx2.fillStyle = '#334155';
        ctx2.beginPath(); ctx2.arc(a.x + 7, a.y - 5 + bounce, 4, 0, Math.PI * 2); ctx2.fill();
        ctx2.fillRect(a.x - 4, a.y + 4, 2, 5); ctx2.fillRect(a.x + 3, a.y + 4, 2, 5);
    }
}

function loopGame2() {
    if (currentGame !== 2) return;

    const colorChurchWall = document.getElementById('colorChurchWall').value;
    const colorChurchRoof = document.getElementById('colorChurchRoof').value;
    const colorHouseWall = document.getElementById('colorHouseWall').value;
    const colorHouseRoof = document.getElementById('colorHouseRoof').value;
    const colorPeopleShirt = document.getElementById('colorPeopleShirt').value;
    const colorPeopleSkin = document.getElementById('colorPeopleSkin').value;
    const colorPeopleBag = document.getElementById('colorPeopleBag').value;

    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

    ctx2.fillStyle = '#1e3a8a'; ctx2.fillRect(0, 0, canvas2.width, 180);
    ctx2.fillStyle = '#475569';
    ctx2.beginPath(); ctx2.moveTo(200, 180); ctx2.lineTo(450, 40); ctx2.lineTo(700, 180); ctx2.fill();
    ctx2.fillStyle = '#15803d';
    ctx2.beginPath(); ctx2.moveTo(0, 180); ctx2.lineTo(300, 100); ctx2.lineTo(600, 180); ctx2.fill();
    ctx2.beginPath(); ctx2.moveTo(400, 180); ctx2.lineTo(750, 90); ctx2.lineTo(950, 180); ctx2.fill();

    ctx2.fillStyle = '#166534'; ctx2.fillRect(0, 180, canvas2.width, canvas2.height - 180);
    ctx2.fillStyle = '#94a3b8';
    ctx2.beginPath(); ctx2.moveTo(0, 320); ctx2.lineTo(950, 240); ctx2.lineTo(950, 310); ctx2.lineTo(0, 390); ctx2.fill();

    drawPuraceChurch(colorChurchWall, colorChurchRoof);

    puraceHouses.forEach(h => {
        ctx2.fillStyle = colorHouseWall; ctx2.fillRect(h.x, h.y, h.w, h.h);
        ctx2.fillStyle = colorHouseRoof;
        ctx2.beginPath(); ctx2.moveTo(h.x - 5, h.y); ctx2.lineTo(h.x + h.w / 2, h.y - 18); ctx2.lineTo(h.x + h.w + 5, h.y); ctx2.fill();
        ctx2.fillStyle = '#78350f'; ctx2.fillRect(h.x + h.w / 2 - 6, h.y + h.h - 22, 12, 22);
    });

    ctx2.fillStyle = 'rgba(22, 101, 52, 0.85)';
    ctx2.fillRect(zoneParque.x, zoneParque.y, zoneParque.w, zoneParque.h);
    ctx2.strokeStyle = '#facc15'; ctx2.lineWidth = 3;
    ctx2.strokeRect(zoneParque.x, zoneParque.y, zoneParque.w, zoneParque.h);
    ctx2.fillStyle = '#fff'; ctx2.font = 'bold 12px sans-serif';
    ctx2.fillText(zoneParque.title, zoneParque.x + 10, zoneParque.y + 20);

    for (let i = 0; i < 4; i++) {
        const tx = zoneParque.x + 30 + (i % 2) * 120;
        const ty = zoneParque.y + 50 + Math.floor(i / 2) * 80;
        ctx2.fillStyle = '#14532d'; ctx2.beginPath(); ctx2.arc(tx, ty, 18, 0, Math.PI * 2); ctx2.fill();
    }

    ctx2.fillStyle = 'rgba(2, 132, 199, 0.85)';
    ctx2.fillRect(zoneCancha.x, zoneCancha.y, zoneCancha.w, zoneCancha.h);
    ctx2.strokeStyle = '#fff'; ctx2.strokeRect(zoneCancha.x, zoneCancha.y, zoneCancha.w, zoneCancha.h);
    ctx2.fillStyle = '#fff'; ctx2.fillText(zoneCancha.title, zoneCancha.x + 10, zoneCancha.y + 20);

    if (alarmState === 2) {
        ctx2.fillStyle = 'rgba(71, 85, 105, 0.55)';
        ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
    }

    let safeCount = 0;

    villagers.forEach(v => {
        v.animTimer += 0.15;
        const legOffset = Math.sin(v.animTimer) * 4;

        if (alarmState === 0 || alarmState === 1) {
            if (Math.hypot(v.targetX - v.x, v.targetY - v.y) < 5) {
                v.targetX = 60 + Math.random() * 830;
                v.targetY = 260 + Math.random() * 120;
            }
        } else if (alarmState === 2) {
            v.targetX = v.homeX;
            v.targetY = v.homeY;
        } else if (alarmState === 3) {
            v.targetX = v.assignedZone.x + 20 + (v.x % (v.assignedZone.w - 40));
            v.targetY = v.assignedZone.y + 35 + (v.y % (v.assignedZone.h - 50));
        }

        const dx = v.targetX - v.x, dy = v.targetY - v.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 2) { v.x += (dx / dist) * v.speed; v.y += (dy / dist) * v.speed; }

        if (alarmState === 3 && ((v.x > zoneCancha.x && v.x < zoneCancha.x + zoneCancha.w && v.y > zoneCancha.y && v.y < zoneCancha.y + zoneCancha.h) ||
            (v.x > zoneParque.x && v.x < zoneParque.x + zoneParque.w && v.y > zoneParque.y && v.y < zoneParque.y + zoneParque.h))) {
            safeCount++;
        }

        ctx2.strokeStyle = '#0f172a'; ctx2.lineWidth = 3;
        ctx2.beginPath(); ctx2.moveTo(v.x - 3, v.y + 10); ctx2.lineTo(v.x - 3 + legOffset, v.y + 20); ctx2.stroke();
        ctx2.beginPath(); ctx2.moveTo(v.x + 3, v.y + 10); ctx2.lineTo(v.x + 3 - legOffset, v.y + 20); ctx2.stroke();

        ctx2.fillStyle = colorPeopleBag; ctx2.fillRect(v.x - 11, v.y - 2, 7, 12);
        ctx2.fillStyle = '#ffffff'; ctx2.fillRect(v.x - 9, v.y + 3, 3, 2);

        ctx2.fillStyle = colorPeopleShirt; ctx2.fillRect(v.x - 5, v.y - 4, 10, 14);

        ctx2.fillStyle = colorPeopleSkin; ctx2.beginPath(); ctx2.arc(v.x, v.y - 10, 5, 0, Math.PI * 2); ctx2.fill();
    });

    animals.forEach(a => {
        if (alarmState === 0 || alarmState === 1) {
            if (Math.hypot(a.targetX - a.x, a.targetY - a.y) < 5) {
                a.targetX = 100 + Math.random() * 750;
                a.targetY = 280 + Math.random() * 90;
            }
        } else if (alarmState === 2) {
            a.targetX = a.homeX;
            a.targetY = a.homeY;
        } else if (alarmState === 3) {
            a.targetX = a.assignedZone.x + 30 + (a.x % (a.assignedZone.w - 60));
            a.targetY = a.assignedZone.y + 40 + (a.y % (a.assignedZone.h - 60));
        }

        const adx = a.targetX - a.x, ady = a.targetY - a.y;
        const adist = Math.hypot(adx, ady);
        if (adist > 2) { a.x += (adx / adist) * a.speed; a.y += (ady / adist) * a.speed; }

        drawAnimal(a);
    });

    document.getElementById('g2-safe-count').innerText = safeCount;
    requestAnimationFrame(loopGame2);
}


// ===================================================
// JUEGO 3: RESCATE EN EL PÁRAMO
// ===================================================
let canvas3, ctx3, g3TimerInterval;
let g3Lvl = 1, g3Score = 0, g3Lives = 3, g3Timer = 45;
let player3 = { x: 450, y: 410, w: 35, h: 42, speed: 8 };

const volcanicRocks = [], frailejones = [], medicalKits = [];
const keysPressed = {};

const g3LvlConfigs = [
    { target: 5, rockSpeed: 3.5, spawnRate: 0.04, time: 45 },
    { target: 8, rockSpeed: 5.0, spawnRate: 0.07, time: 40 },
    { target: 12, rockSpeed: 6.5, spawnRate: 0.10, time: 35 }
];

window.addEventListener('keydown', e => keysPressed[e.key] = true);
window.addEventListener('keyup', e => keysPressed[e.key] = false);

let leftHeld = false, rightHeld = false;
const btnLeft = document.getElementById('btn-left');
const btnRight = document.getElementById('btn-right');

if (btnLeft && btnRight) {
    btnLeft.addEventListener('mousedown', () => leftHeld = true);
    btnLeft.addEventListener('mouseup', () => leftHeld = false);
    btnLeft.addEventListener('touchstart', (e) => { e.preventDefault(); leftHeld = true; });
    btnLeft.addEventListener('touchend', (e) => { e.preventDefault(); leftHeld = false; });

    btnRight.addEventListener('mousedown', () => rightHeld = true);
    btnRight.addEventListener('mouseup', () => rightHeld = false);
    btnRight.addEventListener('touchstart', (e) => { e.preventDefault(); rightHeld = true; });
    btnRight.addEventListener('touchend', (e) => { e.preventDefault(); rightHeld = false; });
}

function initGame3() {
    g3Lvl = 1;
    loadGame3Level();
}

function loadGame3Level() {
    canvas3 = document.getElementById('canvasGame3');
    ctx3 = canvas3.getContext('2d');

    document.getElementById('g3-level-msg').classList.add('hidden');
    const config = g3LvlConfigs[g3Lvl - 1];
    g3Score = 0; g3Lives = 3; g3Timer = config.time;
    volcanicRocks.length = 0; frailejones.length = 0; medicalKits.length = 0;

    document.getElementById('g3-lvl').innerText = g3Lvl;
    document.getElementById('g3-count').innerText = 0;
    document.getElementById('g3-target').innerText = config.target;
    document.getElementById('g3-lives').innerText = g3Lives;
    document.getElementById('g3-timer').innerText = g3Timer;

    if (g3TimerInterval) clearInterval(g3TimerInterval);
    g3TimerInterval = setInterval(() => {
        if (g3Timer > 0 && g3Lives > 0 && g3Score < config.target) {
            g3Timer--;
            document.getElementById('g3-timer').innerText = g3Timer;
        }
    }, 1000);

    requestAnimationFrame(loopGame3);
}

function nextLevelGame3() {
    if (g3Lvl < 3) {
        g3Lvl++;
        loadGame3Level();
    } else {
        showMenu();
    }
}

function loopGame3() {
    if (currentGame !== 3) return;

    const config = g3LvlConfigs[g3Lvl - 1];
    ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

    ctx3.fillStyle = '#0f172a'; ctx3.fillRect(0, 0, canvas3.width, canvas3.height);

    if ((keysPressed['ArrowLeft'] || keysPressed['a'] || keysPressed['A'] || leftHeld) && player3.x > 0) {
        player3.x -= player3.speed;
    }
    if ((keysPressed['ArrowRight'] || keysPressed['d'] || keysPressed['D'] || rightHeld) && player3.x < canvas3.width - player3.w) {
        player3.x += player3.speed;
    }

    if (Math.random() < config.spawnRate) {
        volcanicRocks.push({ x: Math.random() * canvas3.width, y: 0, r: 8 + Math.random() * 12, speed: config.rockSpeed });
    }

    if (frailejones.length < 3 && Math.random() < 0.03) {
        frailejones.push({ x: 40 + Math.random() * (canvas3.width - 80), y: 0, speed: 2.2 });
    }

    if (medicalKits.length < 1 && Math.random() < 0.008) {
        medicalKits.push({ x: 50 + Math.random() * (canvas3.width - 100), y: 0, speed: 2.5 });
    }

    ctx3.fillStyle = '#ea580c'; ctx3.fillRect(player3.x, player3.y + 12, player3.w, player3.h - 12);
    ctx3.fillStyle = '#dc2626'; ctx3.fillRect(player3.x - 7, player3.y + 14, 7, 14);
    ctx3.fillStyle = '#fde047'; ctx3.beginPath(); ctx3.arc(player3.x + player3.w / 2, player3.y + 8, 10, 0, Math.PI * 2); ctx3.fill();

    volcanicRocks.forEach((r, idx) => {
        r.y += r.speed;
        ctx3.fillStyle = '#ef4444';
        ctx3.beginPath(); ctx3.arc(r.x, r.y, r.r, 0, Math.PI * 2); ctx3.fill();

        if (r.x > player3.x && r.x < player3.x + player3.w && r.y > player3.y && r.y < player3.y + player3.h) {
            volcanicRocks.splice(idx, 1);
            g3Lives--;
            document.getElementById('g3-lives').innerText = g3Lives;
        }
    });

    frailejones.forEach((f, idx) => {
        f.y += f.speed;
        ctx3.font = '22px sans-serif'; ctx3.fillText('🌱', f.x, f.y);

        if (f.x > player3.x - 12 && f.x < player3.x + player3.w + 12 && f.y > player3.y && f.y < player3.y + player3.h + 10) {
            frailejones.splice(idx, 1);
            g3Score++;
            document.getElementById('g3-count').innerText = g3Score;
        }
    });

    medicalKits.forEach((k, idx) => {
        k.y += k.speed;
        ctx3.font = '22px sans-serif'; ctx3.fillText('🎒', k.x, k.y);

        if (k.x > player3.x - 12 && k.x < player3.x + player3.w + 12 && k.y > player3.y && k.y < player3.y + player3.h + 10) {
            medicalKits.splice(idx, 1);
            g3Lives++;
            document.getElementById('g3-lives').innerText = g3Lives;
        }
    });

    if (g3Score >= config.target) {
        if (g3TimerInterval) clearInterval(g3TimerInterval);
        document.getElementById('g3-win-title').innerText = `¡Nivel ${g3Lvl} Superado! 🎉`;
        document.getElementById('g3-win-desc').innerText = (g3Lvl < 3) ? "Has logrado salvar el páramo." : "¡Has completado TODOS los niveles!";
        document.getElementById('g3-next-btn').innerText = (g3Lvl < 3) ? "Siguiente ➔" : "Volver al Menú";
        document.getElementById('g3-level-msg').classList.remove('hidden');
        return;
    } else if (g3Lives <= 0 || g3Timer <= 0) {
        if (g3TimerInterval) clearInterval(g3TimerInterval);
        document.getElementById('g3-win-title').innerText = "💥 FIN DEL JUEGO";
        document.getElementById('g3-win-desc').innerText = "Te has quedado sin tiempo o vidas.";
        document.getElementById('g3-next-btn').innerText = "Reintentar Nivel";
        document.getElementById('g3-level-msg').classList.remove('hidden');
        return;
    }

    requestAnimationFrame(loopGame3);
}