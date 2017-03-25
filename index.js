const pico = require('node-raspi-pico-ups');

let currentMode = pico.pico.getCurrentPowerMode();
let interval = setInterval(() => {
    let newMode = pico.pico.getCurrentPowerMode();
    if(newMode !== currentMode && newMode === 2) {
        console.log('Battery mode....');
    } else if(newMode !== currentMode) {
        console.log('Power back on...');
    }
}, 500);
