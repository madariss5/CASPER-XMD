/**
 * @project CASPER-XMD
 * @description WhatsApp Bot Core File
 * @version 1.0.0
 * @author Casper-Tech-ke
 * @created 2025-02-17 13:00:29
 */

require('./settings')
const makeWASocket = require("@whiskeysockets/baileys").default
const { default: CasperConnect, getAggregateVotesInPollMessage, delay, PHONENUMBER_MCC, makeCacheableSignalKeyStore, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage, makeInMemoryStore, jidDecode, proto, Browsers, normalizeMessageContent } = require("@whiskeysockets/baileys")
const { color } = require('./lib/color')
const fs = require("fs");
const pino = require("pino");
const lolcatjs = require('lolcatjs')
const axios = require('axios')
const path = require('path')
const NodeCache = require("node-cache");
const msgRetryCounterCache = new NodeCache();
const fetch = require("node-fetch")
const FileType = require('file-type')
const _ = require('lodash')
const chalk = require('chalk')
const os = require('os');
const express = require('express')
const RateLimit = require('express-rate-limit')
const app = express();
const moment = require("moment-timezone")
const { performance } = require("perf_hooks");
const { File } = require('megajs');
const { Boom } = require("@hapi/boom");
const PhoneNumber = require("awesome-phonenumber");
const readline = require("readline");
const { formatSize, runtime, sleep, serialize, smsg, getBuffer } = require("./lib/myfunc")
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { toAudio, toPTT, toVideo } = require('./lib/converter')
const store = makeInMemoryStore({ logger: pino().child({ level: "silent", stream: "store" }) }); 

const low = require('./lib/lowdb');
const yargs = require('yargs/yargs');
const { Low, JSONFile } = low;
const port = process.env.PORT || 3000;
const versions = require("./package.json").version
const modeStatus = global.mode === 'public' ? "Public" : "Private";
const PluginManager = require('./PluginManager');

// Initialize PluginManager with the Plugins directory
const pluginManager = new PluginManager(path.resolve(__dirname, './src/Plugins'));

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.db = new Low(new JSONFile(`src/database.json`))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) return new Promise((resolve) => setInterval(function () { (!global.db.READ ? (clearInterval(this), resolve(global.db.data == null ? global.loadDatabase() : global.db.data)) : null) }, 1 * 1000))
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read()
  global.db.READ = false
  global.db.data = {
    chats: {},
    settings: {},
    ...(global.db.data || {})
  }
  global.db.chain = _.chain(global.db.data)
}
loadDatabase()

if (global.db) setInterval(async () => {
   if (global.db.data) await global.db.write()
}, 30 * 1000)

let phoneNumber = "254732982940"
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const usePairingCode = true
const question = (text) => {
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
return new Promise((resolve) => {
rl.question(text, resolve)
})
};

const storeFile = "./src/store.json";

// Function to load stored messages from file
function loadStoredMessages() {
    if (fs.existsSync(storeFile)) {
        return JSON.parse(fs.readFileSync(storeFile));
    }
    return {}; // Return empty object if file doesn't exist
}

// Function to save messages to file
function saveStoredMessages(data) {
    fs.writeFileSync(storeFile, JSON.stringify(data, null, 2));
}

// Load stored messages on startup
global.messageBackup = loadStoredMessages();

async function loadAllPlugins() {
  try {
    await pluginManager.unloadAllPlugins();
    console.log('[CASPER-XMD] Preparing....');
    await pluginManager.loadPlugins();
    console.log('[CASPER-XMD] Plugins saved successfully.');
  } catch (error) {
    console.log(`[CASPER-XMD] Error loading plugins: ${error.message}`);
  }
}

const sessionDir = path.join(__dirname, 'session');
const credsPath = path.join(sessionDir, 'creds.json');

async function downloadSessionData() {
  try {
    // Ensure session directory exists
    await fs.promises.mkdir(sessionDir, { recursive: true });
    
    if (!fs.existsSync(credsPath) && global.SESSION_ID) {
      const sessdata = global.SESSION_ID.split("CASPER-TECH:~")[1];
      const filer = File.fromURL(`https://mega.nz/file/${sessdata}`);
      
      filer.download(async (err, data) => {
        if (err) throw err;
        await fs.promises.writeFile(credsPath, data);
        console.log(color(`[CASPER-XMD] Session saved successfully`, 'green'));
        await startCasper();
      });
    }
  } catch (error) {
    console.error('Error downloading session data:', error);
  }
}

async function startCasper() {
const {  state, saveCreds } =await useMultiFileAuthState(`./session`)
    const msgRetryCounterCache = new NodeCache(); 
    const Casper = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode,
        version: [2, 3000, 1017531287],
        browser: Browsers.ubuntu('Edge'),
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true, 
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
        
            let jid = jidNormalizedUser(key.remoteJid)
            let msg = await store.loadMessage(jid, key.id)

            return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
    })
   
    store.bind(Casper.ev)
  if(usePairingCode && !Casper.authState.creds.registered) {
    if (useMobile) throw new Error('Cannot use pairing code with mobile API');

    let phoneNumber;
    phoneNumber = await question(chalk.bgBlack(chalk.greenBright(`Number to be connected to Casper Bot?\nExample 254796180105:- `)))
    phoneNumber = phoneNumber.trim();

    setTimeout(async () => {
        const code = await Casper.requestPairingCode(phoneNumber);
        console.log(chalk.black(chalk.bgWhite(`[CASPER-XMD]:- ${code}`)));
    }, 3000);
}

Casper.ev.on('connection.update', async (update) => {
    const {
        connection,
        lastDisconnect
    } = update
    const start = performance.now();
    const cpus = os.cpus();
    const uptimeSeconds = os.uptime();
    const uptimeDays = Math.floor(uptimeSeconds / 86400);
    const uptimeHours = Math.floor((uptimeSeconds % 86400) / 3600);
    const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
    const uptimeSecs = Math.floor(uptimeSeconds % 60);
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const muptime = runtime(process.uptime()).trim()
    const formattedUsedMem = formatSize(usedMem);
    const formattedTotalMem = formatSize(totalMem);
    const loadAverage = os.loadavg().map(avg => avg.toFixed(2)).join(", ");
    const speed = (performance.now() - start).toFixed(3);         
    try {
        if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
            if (lastDisconnect.error.output.statusCode === DisconnectReason.loggedOut)
                console.log("Logged out. Please link again.");
            if (lastDisconnect.error.output.statusCode === DisconnectReason.badSession)
                console.log("Bad session. Log out and link again.");
            startCasper();
        }

        if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
            console.log(color(`[CASPER-XMD] Connecting...`, 'red'))
        }
        if (update.connection == "open" || update.receivedPendingNotifications == "true") {
            console.log(color(`[CASPER-XMD] Connected`, 'green'))

            await sleep(2000);
            await Casper.groupAcceptInvite("B6Hk3829WHYChdpqnuz7bL");
            await Casper.sendMessage(Casper.user.id, { text: `┏━━─『 CASPER-XMD 』─━━\n┃ » Username: ${Casper.user.name}\n┃ » Platform: ${os.platform()}\n┃ » Prefix: [ ${global.prefixz} ]\n┃ » Mode: ${modeStatus}\n┃ » Version: [ ${versions} ]\n┗━━━━━━━━━━━━─···` }, { ephemeralExpiration: 20 });
        }
    } catch (err) {
        console.log('Error in Connection.update '+err)
        startCasper();
    }
})

Casper.ev.on('creds.update', saveCreds);

Casper.ev.on('messages.upsert', async (chatUpdate) => {
    try {
        const messages = chatUpdate.messages;
        
        for (const kay of messages) {
            if (!kay.message) continue;
            
            kay.message = normalizeMessageContent(kay.message);

            if (kay.key && kay.key.remoteJid === 'status@broadcast') {
                if (global.autoviewstatus === 'true') {
                    await Casper.readMessages([kay.key]);
                }
                
                if (global.autoreactstatus === 'true' && global.autoviewstatus === 'true') {
                    const reactionEmoji = global.statusemoji || '💚';
                    const participant = kay.key.participant || kay.participant;
                    const botJid = await Casper.decodeJid(Casper.user.id);
                    const messageId = kay.key.id;
                    
                    if (participant && messageId && kay.key.id && kay.key.remoteJid) {
                        await Casper.sendMessage(
                            'status@broadcast',
                            {
                                react: {
                                    key: {
                                        id: kay.key.id, 
                                        remoteJid: kay.key.remoteJid, 
                                        participant: participant,
                                    },
                                    text: reactionEmoji,
                                },
                            },
                            { statusJidList: [participant, botJid] }
                        );
                    }
                }
                
                continue;
            }

            if (
                kay.key.id.startsWith('BAE5') || 
                kay.key.id.startsWith('3EBO') && kay.key.id.length === 22 || 
                (!kay.key.id.startsWith('3EBO') && kay.key.id.length === 22) || 
                (kay.key.id.length !== 32 && kay.key.id.length !== 20) 
            ) continue;

            const processedMessages = new Set();
            const messageId = kay.key.id;
            if (processedMessages.has(messageId)) continue;
            processedMessages.add(messageId);
            
            const m = smsg(Casper, kay, store);
            require('./Xploader')(Casper, m, chatUpdate, store);
        }
    } catch (err) {
        console.error('Error handling messages.upsert:', err);
    }
});

Casper.ev.on("messages.upsert", async (chatUpdate) => {
    for (const msg of chatUpdate.messages) {
        if (!msg.message) return;

        let chatId = msg.key.remoteJid;
        let messageId = msg.key.id;

        if (!global.messageBackup[chatId]) {
            global.messageBackup[chatId] = {};
        }

        let textMessage = msg.message?.conversation ||
                         msg.message?.extendedTextMessage?.text ||
                         null;

        if (!textMessage) return;

        let savedMessage = {
            sender: msg.key.participant || msg.key.remoteJid,
            text: textMessage,
            timestamp: msg.messageTimestamp
        };

        if (!global.messageBackup[chatId][messageId]) {
            global.messageBackup[chatId][messageId] = savedMessage;
            saveStoredMessages(global.messageBackup);
        }
    }
});
  setInterval(() => {
    try {
        const sessionPath = path.join(__dirname, 'session');
        fs.readdir(sessionPath, (err, files) => {
            if (err) {
                console.error("Unable to scan directory:", err);
                return;
            }

            const now = Date.now();
            const filteredArray = files.filter((item) => {
                const filePath = path.join(sessionPath, item);
                const stats = fs.statSync(filePath);

                // Delete files older than 2 days
                return (
                    (item.startsWith("pre-key") ||
                     item.startsWith("sender-key") ||
                     item.startsWith("session-") ||
                     item.startsWith("app-state")) &&
                    item !== 'creds.json' &&
                    now - stats.mtimeMs > 2 * 24 * 60 * 60 * 1000 // 2 days
                );
            });

            if (filteredArray.length > 0) {
                console.log(`Found ${filteredArray.length} old session files.`);
                console.log(`Clearing ${filteredArray.length} old session files...`);

                filteredArray.forEach((file) => {
                    const filePath = path.join(sessionPath, file);
                    fs.unlinkSync(filePath);
                });
            } else {
                console.log("No old session files found.");
            }
        });
    } catch (error) {
        console.error('Error clearing old session files:', error);
    }
}, 7200000); // Check every 2 hours

const cleanupInterval = 60 * 60 * 1000; // Run cleanup every 60 minutes
const maxMessageAge = 24 * 60 * 60; // 24 hours in seconds

function cleanupOldMessages() {
    let storedMessages = loadStoredMessages();
    let now = Math.floor(Date.now() / 1000); // Current time in seconds

    let cleanedMessages = {};

    // Loop through all chats
    for (let chatId in storedMessages) {
        let newChatMessages = {};

        for (let messageId in storedMessages[chatId]) {
            let message = storedMessages[chatId][messageId];

            if (now - message.timestamp <= maxMessageAge) {
                newChatMessages[messageId] = message; // Keep messages less than 24 hours old
            }
        }

        if (Object.keys(newChatMessages).length > 0) {
            cleanedMessages[chatId] = newChatMessages; // Keep only chats that still have messages
        }
    }

    saveStoredMessages(cleanedMessages); // Overwrite `store.json` with cleaned data
    console.log("🧹 Cleanup completed: Removed old messages from store.json");
}

// Run cleanup every 10 minutes
setInterval(cleanupOldMessages, cleanupInterval);

//auto delete rubbish
setInterval(() => {
    let directoryPath = path.join();
    fs.readdir(directoryPath, async function (err, files) {
        var filteredArray = await files.filter(item =>
            item.endsWith("gif") ||
            item.endsWith("png") || 
            item.endsWith("mp3") ||
            item.endsWith("mp4") || 
            item.endsWith("opus") || 
            item.endsWith("jpg") ||
            item.endsWith("webp") ||
            item.endsWith("webm") ||
            item.endsWith("zip") 
        )
        if(filteredArray.length > 0){
            let teks =`Detected ${filteredArray.length} junk files,\nJunk files have been deleted🚮`
            Casper.sendMessage(Casper.user.id, {text : teks })
            setInterval(() => {
                if(filteredArray.length == 0) return console.log("Junk files cleared")
                filteredArray.forEach(function (file) {
                    let sampah = fs.existsSync(file)
                    if(sampah) fs.unlinkSync(file)
                })
            }, 15_000)
        }
    });
}, 30_000)

// Setting
Casper.decodeJid = (jid) => {
    if (!jid) return jid;
    if (/:\d+@/gi.test(jid)) {
        let decode = jidDecode(jid) || {};
        return (decode.user && decode.server && decode.user + "@" + decode.server) || jid;
    } else return jid;
};

Casper.ev.on("contacts.update", (update) => {
    for (let contact of update) {
        let id = Casper.decodeJid(contact.id);
        if (store && store.contacts) store.contacts[id] = { id, name: contact.notify };
    }
});

//Welcome/Goodbye Event
Casper.ev.on('group-participants.update', async ({ id, participants, action }) => {
    if (global.welcome === 'true') {
        try {
            const groupData = await Casper.groupMetadata(id);
            const groupMembers = groupData.participants.length;
            const groupName = groupData.subject;

            for (const participant of participants) {
                const userPic = await getUserPicture(participant);
                const groupPic = await getGroupPicture(id);

                if (action === 'add') {
                    sendWelcomeMessage(id, participant, groupName, groupMembers, userPic);
                } else if (action === 'remove') {
                    sendGoodbyeMessage(id, participant, groupName, groupMembers, userPic);
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
});
  //Helper Functions
async function getUserPicture(userId) {
    try {
        return await Casper.profilePictureUrl(userId, 'image');
    } catch {
        return 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60';
    }
}

async function getGroupPicture(groupId) {
    try {
        return await Casper.profilePictureUrl(groupId, 'image');
    } catch {
        return 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60';
    }
}

async function sendWelcomeMessage(groupId, participant, groupName, memberCount, profilePic) {
    const welcomeMessage = `✨ *Welcome to ${groupName}!* ✨ @${participant.split('@')[0]}

You're our ${memberCount}th member!

Join time: ${moment.tz(`${timezones}`).format('HH:mm:ss')},  ${moment.tz(`${timezones}`).format('DD/MM/YYYY')}

Stay awesome!😊

> ${global.wm}`;
    Casper.sendMessage(groupId, {
        text: welcomeMessage,
        contextInfo: {
            mentionedJid: [participant],
            externalAdReply: {
                title: global.botname,
                body: ownername,
                previewType: 'PHOTO',
                thumbnailUrl: '',
                thumbnail: await getBuffer(profilePic),
                sourceUrl: plink
            }
        }
    });
}

async function sendGoodbyeMessage(groupId, participant, groupName, memberCount, profilePic) {
    const goodbyeMessage = `✨ *Goodbye @${participant.split('@')[0]}!* ✨

You'll be missed in ${groupName}!🥲

We're now ${memberCount} members.

Left at: ${moment.tz(timezones).format('HH:mm:ss')},  ${moment.tz(timezones).format('DD/MM/YYYY')}

> ${global.wm}`;

    Casper.sendMessage(groupId, {
        text: goodbyeMessage,
        contextInfo: {
            mentionedJid: [participant],
            externalAdReply: {
                title: global.botname,
                body: ownername,
                previewType: 'PHOTO',
                thumbnailUrl: '',
                thumbnail: await getBuffer(profilePic),
                sourceUrl: plink
            }
        }
    });
}

//------------------------------------------------------
//anticall
Casper.ev.on('call', async (celled) => {
    let botNumber = await Casper.decodeJid(Casper.user.id)
    let koloi = global.anticall === 'true'
    if (!koloi) return
    console.log(celled)
    for (let kopel of celled) {
        if (kopel.isGroup == false) {
            if (kopel.status == "offer") {
                let nomer = await Casper.sendTextWithMentions(kopel.from, `My owner cannot receive ${kopel.isVideo ? `video` : `audio`} calls at the moment.\n\nSorry @${kopel.from.split('@')[0]} Casper Bot is now blocking you for causing disturbance.\n\nIf you called by mistake please look for means to contact my owner to be unblocked!`)
                await sleep(8000)
                await Casper.updateBlockStatus(kopel.from, "block")
            }
        }
    }
})

Casper.serializeM = (m) => smsg(Casper, m, store)

Casper.getName = (jid, withoutContact = false) => {
    id = Casper.decodeJid(jid);
    withoutContact = Casper.withoutContact || withoutContact;
    let v;
    if (id.endsWith("@g.us"))
        return new Promise(async (resolve) => {
            v = store.contacts[id] || {};
            if (!(v.name || v.subject)) v = Casper.groupMetadata(id) || {};
            resolve(v.name || v.subject || PhoneNumber("+" + id.replace("@s.whatsapp.net", "")).getNumber("international"));
        });
    else
        v =
            id === "0@s.whatsapp.net"
                ? {
                    id,
                    name: "WhatsApp",
                }
                : id === Casper.decodeJid(Casper.user.id)
                    ? Casper.user
                    : store.contacts[id] || {};
    return (withoutContact ? "" : v.name) || v.subject || v.verifiedName || PhoneNumber("+" + jid.replace("@s.whatsapp.net", "")).getNumber("international");
};

Casper.getFile = async (PATH, returnAsFilename) => {
    let res, filename
    const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
    if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
    const type = await FileType.fromBuffer(data) || {
        mime: 'application/octet-stream',
        ext: '.bin'
    }
  let filename = PATH;
    if (data && returnAsFilename && !filename) (filename = path.join(__dirname, './tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data));
    return {
        res,
        filename,
        ...type,
        data,
        deleteFile() {
            return filename && fs.promises.unlink(filename);
        }
    };
};

Casper.sendFile = async (jid, PATH, fileName, quoted = {}, options = {}) => {
    let types = await Casper.getFile(PATH, true);
    let { filename, size, ext, mime, data } = types;
    let type = '', mimetype = mime, pathFile = filename;
    if (options.asDocument) type = 'document';
    if (options.asSticker || /webp/.test(mime)) {
        let { writeExif } = require('./lib/sticker.js');
        let media = { mimetype: mime, data };
        pathFile = await writeExif(media, { ...options });
        type = 'sticker';
        mimetype = 'image/webp';
    }
    else if (/image/.test(mime)) type = 'image';
    else if (/video/.test(mime)) type = 'video';
    else if (/audio/.test(mime)) type = 'audio';
    else type = 'document';
    await Casper.sendMessage(jid, {
        [type]: { url: pathFile },
        mimetype,
        fileName,
        ...options
    }, { quoted, ...options });
    return fs.promises.unlink(pathFile);
};

Casper.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifImg(buff, options);
    } else {
        buffer = await imageToWebp(buff);
    }
    await Casper.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
};

Casper.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
    let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0);
    let buffer;
    if (options && (options.packname || options.author)) {
        buffer = await writeExifVid(buff, options);
    } else {
        buffer = await videoToWebp(buff);
    }
    await Casper.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted });
    return buffer;
};

Casper.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
    let types = await Casper.getFile(path, true);
    let { mime, ext, res, data, filename } = types;
    if (res && res.status !== 200 || file.length <= 65536) {
        try { throw { json: JSON.parse(file.toString()) }; }
        catch (e) { if (e.json) throw e.json; }
    }
    let type = '', mimetype = mime, pathFile = filename;
    if (options.asDocument) type = 'document';
    if (options.asSticker || /webp/.test(mime)) {
        let { writeExif } = require('./lib/exif');
        let media = { mimetype: mime, data };
        pathFile = await writeExif(media, { ...options });
        type = 'sticker';
        mimetype = 'image/webp';
    }
    else if (/image/.test(mime)) type = 'image';
    else if (/video/.test(mime)) type = 'video';
    else if (/audio/.test(mime)) type = 'audio';
    else type = 'document';
    await Casper.sendMessage(jid, {
        [type]: { url: pathFile },
        caption,
        mimetype,
        fileName,
        ...options
    }, { quoted, ...options });
    return fs.promises.unlink(pathFile);
};

Casper.copyNForward = async (jid, message, forwardingScore = true, options = {}) => {
    let m = generateForwardMessageContent(message, !!forwardingScore);
    let mtype = Object.keys(m)[0];
    if (forwardingScore && typeof forwardingScore == 'number' && forwardingScore > 1) m[mtype].contextInfo.forwardingScore += forwardingScore;
    m = generateWAMessageFromContent(jid, m, { ...options, userJid: Casper.user.id });
    await Casper.relayMessage(jid, m.message, { messageId: m.key.id, additionalAttributes: { ...options } });
    return m;
};

Casper.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
    let quoted = message.msg ? message.msg : message;
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(quoted, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    let type = await FileType.fromBuffer(buffer);
    trueFileName = attachExtension ? (filename + '.' + type.ext) : filename;
    await fs.writeFileSync(trueFileName, buffer);
    return trueFileName;
};

Casper.downloadMediaMessage = async (message) => {
    let mime = (message.msg || message).mimetype || '';
    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0];
    const stream = await downloadContentFromMessage(message, messageType);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
};

// Auto file watcher
let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});
