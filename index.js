const pico = require('node-raspi-pico-ups').pico;
const executor = require('./executor');
const config = require('./contacts.json');
const Queue = require('promise-queue');

const intervalTime = 500;

let currentMode = pico.getCurrentPowerMode();
console.log('Starting loop');

function sendMessageToContacts(messageCode) {
    let contacts = config['contacts'];
    if(contacts && contacts.length > 0) {
        contacts.forEach((contact) => {
            if(config['messages'][contact.lang] && config['messages'][contact.lang][messageCode]) {
                let cmd = 'gammu sendsms TEXT ' + contact.number + ' -text "' + config['messages'][contact.lang][messageCode] + '"';
                console.log('cmd', cmd);
                return executor(cmd, 2);
            } else {
                return Promise.reject('No contacts');
            }
        });
    }
}

function loop() {
    let newMode = pico.getCurrentPowerMode();
    if (newMode !== currentMode) {
        if (newMode === 2) {
            console.log('Battery mode....');
            clearInterval(interval);
            Queue.add(sendMessageToContacts('powerDown'))
                .then(() => {
                    interval = setInterval(loop, intervalTime);
                    return interal;
                })
                .catch((err) => console.error(err));
        } else if (newMode !== currentMode) {
            console.log('Power back on...');
            Queue.add(sendMessageToContacts('powerUp'))
                .then(() => {
                    interval = setInterval(loop, intervalTime);
                    return interal;
                })
                .catch((err) => console.error(err));;
        }
        currentMode = newMode;
    }
}
sendMessageToContacts('powerUp');
let interval = setInterval(loop, intervalTime);
