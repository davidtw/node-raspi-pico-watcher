const pico = require('node-raspi-pico-ups').pico;

let currentMode = pico.getCurrentPowerMode();
console.log('Starting loop');

let interval = setInterval(() => {
    let newMode = pico.getCurrentPowerMode();
    if(newMode !== currentMode && newMode === 2) {
        console.log('Battery mode....');
    } else if(newMode !== currentMode) {
        console.log('Power back on...');
    }
}, 500);
