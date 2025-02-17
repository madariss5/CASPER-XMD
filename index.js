/**
 * @project CASPER-XMD
 * @description WhatsApp Bot using Baileys
 * @version 1.0.0
 * @author Casper-Tech-ke
 * @created 2025-02-17 11:58:41
 */

"use strict";
const { color } = require('./lib/color');
const { say } = require('cfonts');
const { spawn } = require('child_process');
const path = require('path');
const CFonts = require('cfonts');
const os = require('os');

// Banner
function banner() {
    say('CASPER-XMD', {
        font: 'chrome',
        align: 'center',
        colors: ['system']
    });
    say('WhatsApp Bot by Casper-Tech-ke', {
        font: 'console',
        align: 'center',
        colors: ['system']
    });
}

// Start Function
function start() {
    banner();
    let args = [path.join(__dirname, 'core.js'), ...process.argv.slice(2)];
    console.log(color('[SYSTEM]', 'yellow'), color('Starting...', 'yellow'));
    
    let p = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    })
    .on('message', data => {
        if (data == 'reset') {
            console.log(color('[SYSTEM]', 'red'), color('Restarting...', 'red'));
            p.kill();
            start();
            delete p;
        }
    })
    .on('exit', code => {
        console.log(color('[SYSTEM]', 'red'), color('Exited with code:', 'red'), color(code, 'red'));
        if (code == 1) start();
    });
}

// System Information
const startTime = Date.now();
console.log(color('[SYSTEM]', 'yellow'), color('System Information:', 'yellow'));
console.log(color('[SYSTEM]', 'yellow'), color('OS:', 'white'), color(os.type(), 'green'));
console.log(color('[SYSTEM]', 'yellow'), color('Node Version:', 'white'), color(process.version, 'green'));
console.log(color('[SYSTEM]', 'yellow'), color('Time:', 'white'), color(new Date().toLocaleString(), 'green'));

start();

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});
