const pico = require('node-raspi-pico-ups').pico;
const executor = require('./executor');

var express = require('express');
var app = express();

const maxConcurrent = 1;
const intervalTime = 500;
const path = require('path');

let currentMode = pico.getCurrentPowerMode();
let interval;
console.log('Starting loop');

function sendMessageToContacts(messageCode) {
    let config = require('./contacts.json');
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
            // clearInterval(interval);
            sendMessageToContacts('powerDown')
                .catch((err) => {
                    console.error(err);
                });
        } else if (newMode !== currentMode) {
            console.log('Power back on...');
            sendMessageToContacts('powerUp')
                .catch((err) => {
                    console.error(err);
                });
        }
        currentMode = newMode;
    }
}

function startServer() {
    app.use('/', express.static(path.join(__dirname, 'public')));
    app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

    let server = app.listen(8080, function () {
        let host = server.address().address;
        let port = server.address().port;

        console.log("Example app listening at http://%s:%s", host, port);
    })
}

startServer();
setTimeout(() => {
    sendMessageToContacts('start');
    startListening();
    function startListening() {
        interval = setInterval(loop, intervalTime);
    }
}, 5000);
