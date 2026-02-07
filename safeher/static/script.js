// Initialization
const logBox = document.getElementById('log-box');
const riskText = document.getElementById('risk-val');
const siren = new Audio('https://www.soundjay.com/buttons/sounds/beep-01a.mp3');
siren.loop = true;

function addLog(msg) {
    const time = new Date().toLocaleTimeString();
    const p = document.createElement('p');
    p.innerHTML = `<span style="color: #444;">[${time}]</span> > ${msg}`;
    logBox.appendChild(p);
    logBox.scrollTop = logBox.scrollHeight;
}

// 1. ADVANCED SPEECH RECOGNITION (Voice Control)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recog = new SpeechRecognition();
    recog.continuous = true;
    recog.lang = 'en-US';

    recog.onresult = (event) => {
        const cmd = event.results[event.results.length - 1][0].transcript.toLowerCase();
        addLog(`Voice Engine: "${cmd}"`);
        
        if (cmd.includes('help') || cmd.includes('emergency') || cmd.includes('bachao')) {
            executeSOS("Distress Voice Command");
        }
    };
    
    recog.start();
    addLog("Audio AI: Monitoring ambient distress frequencies...");
}

// 2. SHAKE DETECTION LOGIC
let lastShake = 0;
window.addEventListener('devicemotion', (e) => {
    let acc = e.accelerationIncludingGravity;
    let total = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);
    
    if (total > 35 && (Date.now() - lastShake > 2000)) {
        lastShake = Date.now();
        executeSOS("High-G Shake Detection");
    }
});

// 3. CORE SOS FUNCTION
async function executeSOS(reason) {
    addLog(`🚨 PROTOCOL 0: Triggered via ${reason}`);
    siren.play();
    document.body.style.animation = "emergency-bg 0.5s infinite alternate";

    navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        addLog(`📍 Location Secured: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);

        const response = await fetch('/process_ai', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({type: reason, location: `${lat},${lng}`})
        });

        const data = await response.json();
        riskText.innerText = data.risk_score + "%";
        data.automated_actions.forEach(act => addLog(`✅ ${act}`));
    });
}

// 4. INTERACTIVE FEATURES
async function fetchPolice() {
    addLog("Scanning for nearest law enforcement units...");
    const res = await fetch('/get_nearby_police');
    const stations = await res.json();
    stations.forEach(s => addLog(`👮 ${s.name} - ${s.dist} (${s.status})`));
}

function toggleSiren() {
    if(siren.paused) { siren.play(); addLog("Manual Siren: ON"); }
    else { siren.pause(); addLog("Manual Siren: OFF"); }
}

addLog("SafeHer AI: Operational. All systems nominal.");