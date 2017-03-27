const pico = require('node-raspi-pico-ups').pico;
const executor = require('./executor');
const config = require('./contacts.json');

const maxConcurrent = 1;
const intervalTime = 500;

let currentMode = pico.getCurrentPowerMode();
let interval;
console.log('Starting loop');

function sendMessageToContacts(messageCode) {
    let contacts = config['contacts'];
    if (contacts && contacts.length > 0) {
        let promise;
        contacts.forEach((contact) => {
            if (config['messages'][contact.lang] && config['messages'][contact.lang][messageCode]) {
                let message = config['messages'][contact.lang][messageCode];
                let cmd = 'gammu sendsms TEXT ' + contact.number + ' -text "' + message + '"';
                console.log('cmd', cmd);
                promise = executor(cmd, 2);
            } else {
                promise = Promise.reject('No message');
            }
        });
        return promise;
    } else {
        return Promise.reject('No contacts');
    }
}

function loop() {
    let newMode = pico.getCurrentPowerMode();
    if (newMode !== currentMode) {
        if (newMode === 2) {
            console.log('Battery mode....');
            clearInterval(interval);
            sendMessageToContacts('powerDown')
                .then(() => startListening())
                .catch((err) => {
                    console.error(err);
                    startListening();
                });
        } else if (newMode !== currentMode) {
            console.log('Power back on...');
            sendMessageToContacts('powerUp')
                .then(() => startListening())
                .catch((err) => {
                    console.error(err);
                    startListening();
                });
        }
        currentMode = newMode;
    }
}
sendMessageToContacts('start');
startListening();
function startListening() {
    interval = setInterval(loop, intervalTime);
}
