const pico = require('node-raspi-pico-ups').pico;
const exec = require('child_process').exec;

const config = require('./contacts.json');

const intervalTime = 500;

let currentMode = pico.getCurrentPowerMode();
console.log('Starting loop');

function sendMessageToContacts(messageCode) {
    let contacts = config['contacts'];
    if(contacts && contacts.length > 0) {
        let nbContacts = 0;
        clearInterval(interval);
        contacts.forEach((contact) => {
            if(config['messages'][contact.lang] && config['messages'][contact.lang][messageCode]) {
                exec('gammu sendsms TEXT ' + contact.number + ' -text "' + config['messages'][contact.lang][messageCode] + '"', (error, stdout, stderr) => {
                    console.log(stdout);
                    nbContacts++;
                    if(nbContacts === contacts.length) {
                        interval = setInterval(loop, intervalTime);
                    }
                });
            }
        });
    }
}

function loop() {
    let newMode = pico.getCurrentPowerMode();
    if (newMode !== currentMode) {
        if (newMode === 2) {
            console.log('Battery mode....');
            sendMessageToContacts('powerDown');
        } else if (newMode !== currentMode) {
            console.log('Power back on...');
            sendMessageToContacts('powerUp');
        }
        currentMode = newMode;
    }
}

let interval = setInterval(loop, intervalTime);
