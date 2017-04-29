const pico = require('node-raspi-pico-ups').pico;
const executor = require('./executor');
const path = require('path');
const bodyParser = require('body-parser');
const _ = require('lodash');
const jsonfile = require('jsonfile');

const express = require('express');
const app = express();

const url = path.join(__dirname, "contacts.json");

const maxConcurrent = 1;
const intervalTime = 500;

let currentMode = pico.getCurrentPowerMode();
let interval;
console.log('Starting loop');

function sendMessageToContacts(messageCode) {
    let config = require(url);
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
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.get('/contacts', function (req, res) {
        let config = require(url);
        res.json(config);
    });
    app.put('/contacts', function (req, res) {
        let config = require(url);
        config.contacts = _.filter(req.body.data, (item) => {
            return !_.isEmpty(item.number) && !_.isEmpty(item.lang);
        });
        jsonfile.writeFile(url, config, () => {
            res.json(config.contacts);
        });
    });
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
