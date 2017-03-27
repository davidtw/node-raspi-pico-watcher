const pico = require('node-raspi-pico-ups').pico;
const executor = require('./executor');
const config = require('./contacts.json');
const Queue = require('promise-queue');
const Iconv  = require('iconv').Iconv;
const iconv = new Iconv('UTF-8', 'ISO-8859-1');

const maxConcurrent = 1;
const intervalTime = 500;
const queue = new Queue(maxConcurrent);

let currentMode = pico.getCurrentPowerMode();
console.log('Starting loop');

function sendMessageToContacts(messageCode) {
    let contacts = config['contacts'];
    if(contacts && contacts.length > 0) {
        contacts.forEach((contact) => {
            if(config['messages'][contact.lang] && config['messages'][contact.lang][messageCode]) {
                let message = config['messages'][contact.lang][messageCode];
                let cmd = 'gammu sendsms TEXT ' + contact.number + ' -text "' + message + '"';
                console.log('cmd', cmd);
                return queue.add(executor(cmd, 2));
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
            sendMessageToContacts('powerDown')
                .then(() => {
                    interval = setInterval(loop, intervalTime);
                    return interal;
                })
                .catch((err) => console.error(err));
        } else if (newMode !== currentMode) {
            console.log('Power back on...');
            sendMessageToContacts('powerUp')
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
