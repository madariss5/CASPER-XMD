
require('./settings')
const fs = require('fs') 
if (fs.existsSync('.env')) require('dotenv').config({ path: __dirname+'/.env' })
const { makeWASocket, makeCacheableSignalKeyStore, downloadContentFromMessage, emitGroupParticipantsUpdate, emitGroupUpdate, generateWAMessageContent, generateWAMessage, makeInMemoryStore, prepareWAMessageMedia, generateWAMessageFromContent, MediaType, areJidsSameUser, WAMessageStatus, downloadAndSaveMediaMessage, AuthenticationState, GroupMetadata, initInMemoryKeyStore, getContentType, MiscMessageGenerationOptions, useSingleFileAuthState, BufferJSON, WAMessageProto, MessageOptions, WAFlag, WANode, WAMetric, ChatModification, MessageTypeProto, WALocationMessage, ReconnectMode, WAContextInfo, proto, WAGroupMetadata, ProxyAgent, waChatKey, MimetypeMap, MediaPathMap, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WATextMessage, WAMessageContent, WAMessage, BaileysError, WA_MESSAGE_STATUS_TYPE, MediaConnInfo, URL_REGEX, WAUrlInfo, WA_DEFAULT_EPHEMERAL, WAMediaUpload, mentionedJid, processTime, Browser, MessageType, Presence, WA_MESSAGE_STUB_TYPES, Mimetype, relayWAMessage, Browsers, GroupSettingChange, DisconnectReason, WASocket, getStream, WAProto, isBaileys, PHONENUMBER_MCC, AnyMessageContent, useMultiFileAuthState, fetchLatestBaileysVersion, templateMessage, InteractiveMessage, Header, getDevice } = require('@whiskeysockets/baileys')
const { exec, spawn, execSync } = require("child_process")
const util = require('util')
const fetch = require('node-fetch')
const path = require('path')
const axios = require('axios')
const chalk = require('chalk')
const googleTTS = require("google-tts-api");
const acrcloud = require ('acrcloud');
const FormData = require('form-data');
const cheerio = require('cheerio')
const { randomBytes } = require('crypto')
const { performance } = require("perf_hooks");
const process = require('process');
const moment = require("moment-timezone")
const lolcatjs = require('lolcatjs')
const os = require('os');
const scp2 = require("./lib/scraper2");
const checkDiskSpace = require('check-disk-space').default;
const speed = require('performance-now')
const yts = require("yt-search")
const jsobfus = require("javascript-obfuscator");
const gifted = require('gifted-dls');
const { y2save } = require('./lib/y2save.js'); 
const { translate } = require("@vitalets/google-translate-api");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const timestampp = speed();
const https = require('https')
const latensi = speed() - timestampp
const { bytesToSize, checkBandwidth, formatSize, jsonformat, nganuin, shorturl, color } = require('./lib/function');
const { addExif } = require('./lib/exif');
const devTylor = '254732982940';
const {
  TelegraPh,
  UploadFileUgu,
  webp2mp4File,
  floNime,
} = require("./lib/uploader");
const {
  toAudio,
  toPTT,
  toVideo,
  ffmpeg,
  addExifAvatar,
} = require("./lib/converter");
const {
    smsg,
    formatDate,
    getTime,
    getGroupAdmins,
    formatp,
    await,
    sleep,
    isUrl,
    runtime,   
    clockString,
    msToDate,
    sort,
    toNumber,
    enumGetKey,
    fetchJson,
    getBuffer,
    json,
    delay,
    format,
    logic,
    generateProfilePicture,
    parseMention,
    getRandom,
    fetchBuffer,
    buffergif,
    GIFBufferToVideoBuffer,
    totalcase
} = require('./lib/myfunc')

//error handling
const errorLog = new Map();
const ERROR_EXPIRY_TIME = 60000; // 60 seconds

const recordError = (error) => {
  const now = Date.now();
  errorLog.set(error, now);
  setTimeout(() => errorLog.delete(error), ERROR_EXPIRY_TIME);
};

const shouldLogError = (error) => {
  const now = Date.now();
  if (errorLog.has(error)) {
    const lastLoggedTime = errorLog.get(error);
    if (now - lastLoggedTime < ERROR_EXPIRY_TIME) {
      return false;
    }
  }
  return true;
};

//Images
const tylorkid1 = fs.readFileSync("./Media/Images/Xploader1.jpg");
const tylorkid2 = fs.readFileSync("./Media/Images/Xploader2.jpg");
const tylorkid3 = fs.readFileSync("./Media/Images/Xploader3.jpg");
const tylorkid4 = fs.readFileSync("./Media/Images/Xploader4.jpg");
const tylorkid5 = fs.readFileSync("./Media/Images/Xploader5.jpg");

//Version
const versions = require("./package.json").version

//badwords
const bad = JSON.parse(fs.readFileSync("./src/badwords.json")); 

//Shazam
const acr = new acrcloud({
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: '882a7ef12dc0dc408f70a2f3f4724340',
    access_secret: 'qVvKAxknV7bUdtxjXS22b5ssvWYxpnVndhy2isXP'
});

//Catbox upload
const { uploadMedia, handleMediaUpload } = require('./lib/catbox'); 

//database 
global.db.data = JSON.parse(fs.readFileSync("./src/database.json"));
if (global.db.data)
  global.db.data = {
    sticker: {},
    database: {},
    game: {},
    others: {},
    users: {},
    chats: {},
    settings: {},
    ...(global.db.data || {}),
  };

module.exports = Xploader = async (Xploader, m, chatUpdate, store) => {
try {
   const { type, quotedMsg, mentioned, now, fromMe } = m;
    var body =
      m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
        ? m.message.imageMessage.caption
        : m.mtype == "videoMessage"
        ? m.message.videoMessage.caption
        : m.mtype == "extendedTextMessage"
        ? m.message.extendedTextMessage.text
        : m.mtype == "buttonsResponseMessage"
        ? m.message.buttonsResponseMessage.selectedButtonId
        : m.mtype == "listResponseMessage"
        ? m.message.listResponseMessage.singleSelectReply.selectedRowId
        : m.mtype == "templateButtonReplyMessage"
        ? m.message.templateButtonReplyMessage.selectedId
        : m.mtype === "messageContextInfo"
        ? m.message.buttonsResponseMessage?.selectedButtonId ||
          m.message.listResponseMessage?.singleSelectReply.selectedRowId ||
          m.text
        : "";
    var budy = typeof m.text == "string" ? m.text : "";
    //prefix 1
    var prefix = [".", "/"]
      ? /^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi.test(body)
        ? body.match(/^[°•π÷×¶∆£¢€¥®™+✓_=|~!?@#$%^&.©^]/gi)[0]
        : ""
      : prefixz;
    const isCmd = body.startsWith(prefix, "");
    const isCmd2 = body.startsWith(prefix);
    const command = body
      .replace(prefix, "")
      .trim()
      .split(/ +/)
      .shift()
      .toLowerCase();
       //prefix 2
    const pric = /^#.¦|\\^/.test(body) ? body.match(/^#.¦|\\^/gi) : prefixz;
    const XpBotbody = body.startsWith(pric);
    const isCommand = XpBotbody
      ? body.replace(pric, "").trim().split(/ +/).shift().toLowerCase()
      : "";
      
const args = body.trim().split(/ +/).slice(1);
const full_args = body.replace(command, '').slice(1).trim();
const pushname = m.pushName || "No Name";
const botNumber = await Xploader.decodeJid(Xploader.user.id);
const sender = m.sender
const senderNumber = sender.split('@')[0]
const isCreator = [botNumber, devTylor, global.ownernumber, ...global.sudo]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender);
const itsMe = m.sender == botNumber ? true : false;
const text = q = args.join(" ");
const from = m.key.remoteJid;
const fatkuns = m.quoted || m;
const quoted =
      fatkuns.mtype == "buttonsMessage"
        ? fatkuns[Object.keys(fatkuns)[1]]
        : fatkuns.mtype == "templateMessage"
        ? fatkuns.hydratedTemplate[Object.keys(fatkuns.hydratedTemplate)[1]]
        : fatkuns.mtype == "product"
        ? fatkuns[Object.keys(fatkuns)[0]]
        : m.quoted
        ? m.quoted
        : m;
const mime = (quoted.msg || quoted).mimetype || "";
 const qmsg = quoted.msg || quoted;
const isMedia = /image|video|sticker|audio/.test(mime);
const isImage = (type === 'imageMessage')
const isVideo = (type === 'videoMessage')
const isSticker = (type == 'stickerMessage')
const isAudio = (type == 'audioMessage')
//group
    const groupMetadata = m.isGroup
      ? await Xploader.groupMetadata(m.chat).catch((e) => {})
      : "";
    const groupName = m.isGroup ? groupMetadata.subject : "";
    const participants = m.isGroup ? await groupMetadata.participants : "";
   const groupAdmins = m.isGroup ? await getGroupAdmins(participants) : "";
    const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false;
const isBot = botNumber.includes(senderNumber)
    const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
    const groupOwner = m.isGroup ? groupMetadata.owner : "";
    const isGroupOwner = m.isGroup
      ? (groupOwner ? groupOwner : groupAdmins).includes(m.sender)
      : false;
const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false;
const isMediaLily = m.mtype
//================== [ TIME ] ==================//
const dayz = moment(Date.now()).tz(`${timezones}`).locale('en').format('dddd');
const timez = moment(Date.now()).tz(`${timezones}`).locale('en').format('HH:mm:ss z');
const datez = moment(Date.now()).tz(`${timezones}`).format("DD/MM/YYYY");
if (timez < "23:59:00") {
  var timewisher = `Good Night 🌌`;
}
if (timez < "19:00:00") {
  var timewisher = `Good Evening 🌃`;
}
if (timez < "18:00:00") {
  var timewisher = `Good Evening 🌃`;
}
if (timez < "15:00:00") {
  var timewisher = `Good Afternoon 🌅`;
}
if (timez < "11:00:00") {
  var timewisher = `Good Morning 🌄`;
}
if (timez < "05:00:00") {
  var timewisher = `Good Morning 🌄`;
}


//================== [ FUNCTION ] ==================//
async function dellCase(filePath, caseNameToRemove) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('There is an error:', err);
            return;
        }

        const regex = new RegExp(`case\\s+'${caseNameToRemove}':[\\s\\S]*?break`, 'g');
        const modifiedData = data.replace(regex, '');

        fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
            if (err) {
                console.error('An error occurred while writing the file:', err);
                return;
            }

            console.log(`The text of case '${caseNameToRemove}' has been removed from the file.`);
        });
    });
}

async function setHerokuEnvVar(varName, varValue) {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;
  
  try {
    const response = await axios.patch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      [varName]: varValue
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error setting env var:', error);
    throw new Error(`Failed to set environment variable, please make sure you've entered heroku api key and app name correctly.`);
  }
}

async function getHerokuEnvVars() {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;

  try {
    const response = await axios.get(`https://api.heroku.com/apps/${appName}/config-vars`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error getting env vars:', error);
    throw new Error('Failed to get environment variables');
  }
}

async function deleteHerokuEnvVar(varName) {
  const apiKey = process.env.HEROKU_API_KEY;
  const appName = process.env.HEROKU_APP_NAME;

  try {
    const response = await axios.patch(`https://api.heroku.com/apps/${appName}/config-vars`, {
      [varName]: null
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.heroku+json; version=3',
        'Authorization': `Bearer ${apiKey}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting env var:', error);
    throw new Error(`Failed to set environment variable, please make sure you've entered heroku api key and app name correctly`); 
  }
}

 //ytmp3 downloader
async function downloadXMp3Doc (link) {
  try {
    Xploader.sendMessage(m.chat, { react: { text: '🤗', key: m.key } });

    // First method using the updated GiftedTech API
    try {
      const response = await fetchJson(`https://api.giftedtech.my.id/api/download/dlmp3?apikey=gufted&url=${encodeURIComponent(link)}`);
      if (!response.success) throw new Error('*Failed to retrieve the song!*');

      const audioBuffer = await fetch(response.result.download_url).then(res => res.buffer());

      await Xploader.sendMessage(m.chat, {
        document: { buffer: audioBuffer },
        mimetype: 'audio/mp3',
        fileName: `${response.result.title}.mp3`,
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: `${response.result.title}`,
            thumbnailUrl: `${response.result.thumbnail}`,
            sourceUrl: `${link}`,
            mediaType: 2,
            mediaUrl: `${response.result.thumbnail}`
          }
        }
      }, { quoted: m });
      Xploader.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
    } catch (error) {
      console.error('First method (GiftedTech API) failed:', error);

      // Second method using y2save
      try {
        const { y2save } = require('./lib/y2save.js'); // Ensure the y2save module is in the same directory
        const audioUrl = await y2save.main(link, 'mp3', '128kbps');
        
        if (!audioUrl) {
          throw new Error('*Failed to retrieve the song!*');
        }

        const audioBuffer = await fetch(audioUrl).then(res => res.buffer());

        await Xploader.sendMessage(m.chat, {
          document: { buffer: audioBuffer },
          mimetype: 'audio/mp3',
          fileName: `${link}.mp3`,
          contextInfo: {
            externalAdReply: {
              title: botname,
              body: `${link}`,
              thumbnailUrl: `${link}`,
              sourceUrl: `${link}`,
              mediaType: 2,
              mediaUrl: `${link}`
            }
          }
        }, { quoted: m });
        Xploader.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
      } catch (fallbackError) {
        console.error('Second method (y2save) failed:', fallbackError);
        m.reply(`Error: ${fallbackError.message}`);
      }
    }
  } catch (error) {
    console.error('Download command failed:', error);
    m.reply(`Error: ${error.message}`);
  }
}



async function downloadXMp4(link) {
  try {
    Xploader.sendMessage(m.chat, { react: { text: '🎬', key: m.key } });

    // Fetch video details from the new API
    const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp4q?apikey=gufted&quality=720&url=${encodeURIComponent(link)}`;
    const response = await axios.get(apiUrl);

    if (response.status !== 200 || !response.data.success) {
      throw new Error('*Failed to retrieve the video!*');
    }

    const videoUrl = response.data.result.download_url; // Get the actual download URL
    const title = response.data.result.title; // Title fetched from the API

    // Send video as document
    await Xploader.sendMessage(m.chat, {
      video: { url: videoUrl },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption: `POWERED BY 𝖢𝖠𝖲𝖯𝖤𝖱 𝖳𝖤𝖢𝖧`,
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: `${link}`,
          thumbnailUrl: response.data.result.thumbnail, // Thumbnail URL if available
          sourceUrl: `${link}`,
          mediaType: 2,
          mediaUrl: `${link}`
        }
      }
    }, { quoted: m });

    Xploader.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Download command failed:', error);
    m.reply(`Error: ${error.message}`);
  }
}


async function downloadXMp3 (link) {
  try {
    Xploader.sendMessage(m.chat, { react: { text: '⏯️', key: m.key } });

    // First method using the updated GiftedTech API
    try {
      const response = await fetchJson(`https://api.giftedtech.my.id/api/download/dlmp3?apikey=gufted&url=${encodeURIComponent(link)}`);
      if (!response.success) throw new Error('*Failed to retrieve the song!*');

      const audioBuffer = await fetch(response.result.download_url).then(res => res.buffer());

      await Xploader.sendMessage(m.chat, {
        audio: audioBuffer,
        mimetype: 'audio/mpeg',
        contextInfo: {
          externalAdReply: {
            title: botname,
            body: `${response.result.title}`,
            thumbnailUrl: `${response.result.thumbnail}`,
            sourceUrl: `${link}`,
            mediaType: 2,
            mediaUrl: `${response.result.thumbnail}`,
            showAdAttribution: true,
            renderLargerThumbnail: false
          }
        }
      }, { quoted: m });
      Xploader.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
    } catch (error) {
      console.error('First method (GiftedTech API) failed:', error);

      // Second method using y2save
      try {
        const { y2save } = require('./lib/y2save.js'); // Ensure the y2save module is in the same directory
        const audioUrl = await y2save.main(link, 'mp3', '128kbps');
        
        if (!audioUrl) {
          throw new Error('*Failed to retrieve the song!*');
        }

        await Xploader.sendMessage(m.chat, {
          audio: { url: audioUrl },
          mimetype: 'audio/mpeg',
          contextInfo: {
            externalAdReply: {
              title: botname,
              body: `${link}`,
              thumbnailUrl: `${link}`,
              sourceUrl: `${link}`,
              mediaType: 2,
              mediaUrl: `${link}`,
              showAdAttribution: true,
              renderLargerThumbnail: false
            }
          }
        }, { quoted: m });
        Xploader.sendMessage(m.chat, { react: { text: '✅', key: m.key }});
      } catch (fallbackError) {
        console.error('Second method (y2save) failed:', fallbackError);
        m.reply(`Error: ${fallbackError.message}`);
      }
    }
  } catch (error) {
    console.error('Download command failed:', error);
    m.reply(`Error: ${error.message}`);
  }
}


async function downloadXMp4Doc(link) {
  try {
    Xploader.sendMessage(m.chat, { react: { text: '🎬', key: m.key } });

    // Fetch video details from the new API
    const apiUrl = `https://api.giftedtech.my.id/api/download/dlmp4q?apikey=gufted&quality=720&url=${encodeURIComponent(link)}`;
    const response = await axios.get(apiUrl);

    if (response.status !== 200 || !response.data.success) {
      throw new Error('*Failed to retrieve the video!*');
    }

    const videoUrl = response.data.result.download_url; // Get the actual download URL
    const title = response.data.result.title; // Title fetched from the API

    // Send video as document
    await Xploader.sendMessage(m.chat, {
      document: { url: videoUrl },
      mimetype: 'video/mp4',
      fileName: `${title}.mp4`,
      caption: `©🄲🄰🅂🄿🄴🅁-🅇🄼🄳`,
      contextInfo: {
        externalAdReply: {
          title: botname,
          body: `${link}`,
          thumbnailUrl: response.data.result.thumbnail, // Thumbnail URL if available
          sourceUrl: `${link}`,
          mediaType: 2,
          mediaUrl: `${link}`
        }
      }
    }, { quoted: m });

    Xploader.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Download command failed:', error);
    m.reply(`Error: ${error.message}`);
  }
}


async function Telesticker(url) {
      return new Promise(async (resolve, reject) => {
        if (!url.match(/(https:\/\/t.me\/addstickers\/)/gi))
          return m.reply("*_Enter your telegram sticker link_*");
        packName = url.replace("https://t.me/addstickers/", "");
        data = await axios(
          `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getStickerSet?name=${encodeURIComponent(
            packName
          )}`,
          { method: "GET", headers: { "User-Agent": "GoogleBot" } }
        );
        const XpBotresult = [];
        for (let i = 0; i < data.data.result.stickers.length; i++) {
          fileId = data.data.result.stickers[i].thumb.file_id;
          data2 = await axios(
            `https://api.telegram.org/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/getFile?file_id=${fileId}`
          );
          result = {
            status: 200,
            author: "CASPER",
            url:
              "https://api.telegram.org/file/bot891038791:AAHWB1dQd-vi0IbH2NjKYUk-hqQ8rQuzPD4/" +
              data2.data.result.file_path,
          };
          XpBotresult.push(result);
        }
        resolve(XpBotresult);
      });
    }
    
async function ephoto(url, texk) {
      let form = new FormData();
      let gT = await axios.get(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        },
      });
      let $ = cheerio.load(gT.data);
      let text = texk;
      let token = $("input[name=token]").val();
      let build_server = $("input[name=build_server]").val();
      let build_server_id = $("input[name=build_server_id]").val();
      form.append("text[]", text);
      form.append("token", token);
      form.append("build_server", build_server);
      form.append("build_server_id", build_server_id);
      let res = await axios({
        url: url,
        method: "POST",
        data: form,
        headers: {
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
          cookie: gT.headers["set-cookie"]?.join("; "),
          "Content-Type": "multipart/form-data",
        },
      });
      let $$ = cheerio.load(res.data);
      let json = JSON.parse($$("input[name=form_value_input]").val());
      json["text[]"] = json.text;
      delete json.text;
      let { data } = await axios.post(
        "https://en.ephoto360.com/effect/create-image",
        new URLSearchParams(json),
        {
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            cookie: gT.headers["set-cookie"].join("; "),
          },
        }
      );
      return build_server + data.image;
 }

//obfuscator 
async function obfus(query) {
      return new Promise((resolve, reject) => {
        try {
          const obfuscationResult = jsobfus.obfuscate(query, {
            compact: false,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1,
          });
          const result = {
            status: 200,
            author: `${ownername}`,
            result: obfuscationResult.getObfuscatedCode(),
          };
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    }

 //cmds
const totalCmds = () => {
  const myText = fs.readFileSync("./Xploader.js", "utf8");
  const numUpper = (myText.match(/case "/g) || []).length;
  return numUpper;
};
const pickRandom = (arr) => {
return arr[Math.floor(Math.random() * arr.length)]
}
 
// TAKE  PP USER
try {
var ppuser = await Xploader.profilePictureUrl(m.sender, 'image')} catch (err) {
let ppuser = 'https://telegra.ph/file/6880771a42bad09dd6087.jpg'}
let ppnyauser = await getBuffer(ppuser)
let ppUrl = await Xploader.profilePictureUrl(m.sender, 'image').catch(_ => 'https://telegra.ph/file/6880771a42bad09dd6087.jpg')

//================== [ DATABASE ] ==================//
    //database
    try {
      let isNumber = (x) => typeof x === "number" && !isNaN(x);
      let user = global.db.data.users[sender];
      if (typeof user !== "object") global.db.data.users[sender] = {};
      if (user) {
        if (!isNumber(user.afkTime)) user.afkTime = -1;
        if (!("badword" in user)) user.badword = 0;
        if (!("title" in user)) user.title = "";
        if (!("serialNumber" in user))
          user.serialNumber = randomBytes(16).toString("hex");
        if (!("afkReason" in user)) user.afkReason = "";
        if (!("nick" in user)) user.nick = Xploader.getName(sender);
      } else
        global.db.data.users[sender] = {
          serialNumber: randomBytes(16).toString("hex"),
          afkTime: -1,
          badword: 0,
          afkReason: "",
          nick: Xploader.getName(sender),
        };

      let chats = global.db.data.chats[from];
      if (typeof chats !== "object") global.db.data.chats[from] = {};
      if (chats) {
        if (!("badword" in chats)) chats.badword = false;
        if (!("antibot" in chats)) chats.antibot = false;
        if (!("antilink" in chats)) chats.antilink = false;
        if (!("antilinkgc" in chats)) chats.antilinkgc = false;
      } else
        global.db.data.chats[from] = {
          badword: false,
          antibot: false,
          antilink: false,
          antilinkgc: false,
        };

      let setting = global.db.data.settings[botNumber];
      if (typeof setting !== "object") global.db.data.settings[botNumber] = {};
      if (setting) {
        if (!("unavailable" in setting)) setting.unavailable = false;
        if (!("autobio" in setting)) setting.autobio = false;
        if (!("public" in setting)) setting.public = true;
        if (!("autorecordtype" in setting)) setting.autorecordtype = false;
        if (!("autorecord" in setting)) setting.autorecord = false;
        if (!("autotype" in setting)) setting.autotype = false;
        if (!("watermark" in setting)) setting.watermark = { packname, author };
        if (!("about" in setting))
          setting.about = {
            bot: { nick: Xploader.getName(botNumber), alias: botname },
            owner: {
              nick: Xploader.getName(
                global.ownernumber + "@s.whatsapp.net"
              ),
              alias: global.ownernumber,
            },
          };
      } else
        global.db.data.settings[botNumber] = {
          unavailable: false,
          autobio: false,
          autoread: false,
          public: true,
          antiviewonce: false,
          autorecordtype: false,
          autorecord: false,
          autotype: false,
          watermark: {
            packname: global.packname,
            author: global.author,
          },
          about: {
            bot: {
              nick: Xploader.getName(botNumber),
              alias: botname,
            },
            owner: {
              nick: Xploader.getName(
                global.ownernumber + "@s.whatsapp.net"
              ),
              alias: global.ownernumber,
            },
          },
        };
    } catch (err) {
      console.log(err);
    }

//================== [ CONSOLE LOG] ==================//
if (m.message) {
  lolcatjs.fromString(`────────────『 CASPER-XMD🤓 』────────────`);
  lolcatjs.fromString(`» Sent Time: ${dayz}, ${timez}`);
  lolcatjs.fromString(`» Message Type: ${m.mtype}`);
  lolcatjs.fromString(`» Sender Name: ${pushname || 'N/A'}`);
  lolcatjs.fromString(`» Chat ID: ${m.chat.split('@')[0]}`);
  lolcatjs.fromString(`» Message: ${budy || 'N/A'}`);
  lolcatjs.fromString(`» Made By: CASPER-TECH`);
 lolcatjs.fromString('───────────────────────────────────⳹\n');
}

    //auto set bio\\
    if (db.data.settings[botNumber].autobio) {
let xdpy = moment(Date.now()).tz(`${timezones}`).locale('en').format('dddd');
let xtipe = moment(Date.now()).tz(`${timezones}`).locale('en').format('HH:mm z');
let xdpte = moment(Date.now()).tz(`${timezones}`).format("DD/MM/YYYY");
      Xploader.updateProfileStatus(
        `${xtipe}, ${xdpy}; ${xdpte}:- ${botname}`
      ).catch((_) => _);
    }
    //auto type record
    if (db.data.settings[botNumber].autorecordtype) {
      if (m.message) {
        let XpBotmix = ["composing", "recording"];
        XpBotmix2 = XpBotmix[Math.floor(XpBotmix.length * Math.random())];
        Xploader.sendPresenceUpdate(XpBotmix2, from);
      }
    }
    if (db.data.settings[botNumber].autorecord) {
      if (m.message) {
        let XpBotmix = ["recording"];
        XpBotmix2 = XpBotmix[Math.floor(XpBotmix.length * Math.random())];
        Xploader.sendPresenceUpdate(XpBotmix2, from);
      }
    }
    if (db.data.settings[botNumber].autotype) {
      if (m.message) {
        let XpBotpos = ["composing"];
        Xploader.sendPresenceUpdate(XpBotpos, from);
      }
    }   
//<================================================>//
    if (db.data.chats[m.chat].antibot) {
      if (m.isBaileys && m.fromMe == false) {
        if (isAdmins || !isBotAdmins) {
        } else {
          m.reply(
            `*BOT DETECTED*\n\nCASPER-XMD🤓 Doesnt want competition!`
          );
          return await Xploader.groupParticipantsUpdate(
            m.chat,
            [m.sender],
            "remove"
          );
        }
      }
    }
//<================================================>//
if (db.data.chats[m.chat].antilinkgc) {
    if (budy.match(`chat.whatsapp.com`)) {
        if (isAdmins || isCreator || !isBotAdmins) return;
        await Xploader.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
        Xploader.sendMessage(
            from,
            {
                text: `GROUP LINK DETECTED\n\n@${m.sender.split("@")[0]} *Beware, group links are not allowed in this group!*`,
                contextInfo: { mentionedJid: [m.sender] },
            },
            { quoted: m }
        );
    }
}

if (db.data.chats[m.chat].antilink) {
    if (budy.match("http") || budy.match("https")) {
        if (isAdmins || isCreator || !isBotAdmins) return;
        await Xploader.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                fromMe: false,
                id: m.key.id,
                participant: m.key.participant,
            },
        });
        Xploader.sendMessage(
            from,
            {
                text: `LINK DETECTED\n\n@${m.sender.split("@")[0]} *Beware, links are not allowed in this group!*`,
                contextInfo: { mentionedJid: [m.sender] },
            },
            { quoted: m }
        );
    }
}
//<================================================>//
//anti bad words.
if (db.data.chats[m.chat].badword) {
  for (let bak of bad) {
    let regex = new RegExp(`\\b${bak}\\b`, 'i'); // Create a regex to match the bad word (case-insensitive)
    if (regex.test(budy)) {
      let baduser = await db.data.users[sender].badword;
      await Xploader.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id,
          participant: m.key.participant,
        },
      });
      await Xploader.sendMessage(
        from,
        {
          text: `BAD WORD DETECTED\n\n@${
            m.sender.split("@")[0]
          } *Beware, using bad words is prohibited in this group!*`,
          contextInfo: { mentionedJid: [m.sender] },
        },
        { quoted: m }
      );
      break; // Exit the loop after detecting the first bad word
    }
  }
}
//<================================================>//
// Updated automatic anti-view-once logic
    if (
      db.data.settings[botNumber].antiviewonce &&
      m.mtype == "viewOnceMessageV2"
    ) {
      let val = { ...m };
      let msg =
        val.message?.viewOnceMessage?.message ||
        val.message?.viewOnceMessageV2?.message;
      delete msg[Object.keys(msg)[0]].viewOnce;
      val.message = msg;
      await Xploader.sendMessage(Xploader.user.id, { forward: val }, { quoted: m });
    }
//<================================================>//
    if (db.data.settings[botNumber].unavailable) {
      if (m.message) {
        Xploader.sendPresenceUpdate("unavailable", from);
      }
    }
//=================================================//
if (global.autoread === 'true') {
  Xploader.readMessages([m.key]);
}
//<================================================>//
//=================================================//
//<================================================>//
//<================================================>//
//<================================================>// 
//=================================================//
//<================================================>//
//<================================================>//
//<================================================>// 
//=================================================//
//<================================================>//
//<================================================>//
if (!m.sender.startsWith(global.countrycode) && global.gcantiforeign === 'true') {
  if (isCreator || isAdmins || !isBotAdmins) return;
  Xploader.sendMessage(m.chat, {
    text: `*FOREIGN NUMBER DETECTED*\n\nOnly +${global.countrycode} users are allowed to join the group.`,
  }, { quoted: m });
  await sleep(2000);
  await Xploader.groupParticipantsUpdate(m.chat, [m.sender], "remove");
}
//<================================================>//
if (!m.sender.startsWith(`${global.countrycode}`) && global.autoblockforeign === 'true') {
  if (isCreator || isAdmins || !isBotAdmins) return;
  Xploader.sendMessage(m.chat, {
    text: `*FOREIGN NUMBER DETECTED*\n\nSorry, but my owner has enabled a strict policy to block foreign numbers. Only users with country code +${global.countrycode} are allowed.`,
  }, { quoted: m });
  await sleep(2000);
  return Xploader.updateBlockStatus(m.sender, "block");
}
//<================================================>//
//<================================================>// 
//=================================================//
//<================================================>//
if (global.mode === 'private') {
  if (isCommand && !isCreator && !m.key.fromMe) return;
}
//<================================================// 
//mode checker
const modeStatus = global.mode === 'public' ? "Public" : "Private";
    
//================== [ FAKE REPLY ] ==================//
const fkontak = {
key: {
participants: "0@s.whatsapp.net",
remoteJid: "status@broadcast",
fromMe: false,
id: "Halo"},
message: {
contactMessage: {
vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
}},
participant: "0@s.whatsapp.net"
}

const reply = async(teks) => { 
Xploader.sendMessage(m.chat, { text : teks,
contextInfo: {
mentionedJid: [m.sender],
forwardingScore: 9999, 
isForwarded: true, 
forwardedNewsletterMessageInfo: {
newsletterJid: '120363375953549654@newsletter',
serverMessageId: 20,
newsletterName: '𝗖𝗔𝗦𝗣𝗘𝗥-𝗫𝗠𝗗'
},
externalAdReply: {
title: "𝗖𝗔𝗦𝗣𝗘𝗥 𝗧𝗘𝗖𝗛", 
body: "",
thumbnailUrl: "https://i.ibb.co/DQM7vpb/IMG-20250126-042251.png", 
sourceUrl: null,
mediaType: 1
}}}, { quoted : m })
}

//=================================================//
const PluginManager = require('./PluginManager');

const pluginManager = new PluginManager(path.resolve(__dirname, './Plugins'));

(async () => {
  await pluginManager.loadPlugins();

const ringtone = require("./lib/scraper");
const { pinterest } = require("./lib/scraper");

const context = {
    Xploader,
    reply,
    m,
    chatUpdate,
    store,
    body,
    prefix,
    prefixz,
    isCommand,
    versions,
    command,
    q,
    text,
    quoted,
    require,
    smsg,
    getGroupAdmins,
    formatp,
    formatDate,
    getTime,
    sleep,
    clockString,
    msToDate,
    sort,
    toNumber,
    enumGetKey,
    runtime,
    fetchJson,
    getBuffer,
    json,
    delay,
    format,
    logic,
    generateProfilePicture,
    parseMention,
    getRandom,
    pickRandom,
    fetchBuffer,
    buffergif,
    GIFBufferToVideoBuffer,
    totalcase,
    ownername,
    prefixz,
    modeStatus,
    plugins: pluginManager.plugins, // Pass pluginManager.plugins
    readmore,
    tylorkid1,
    tylorkid2,
    tylorkid3,
    tylorkid4,
    tylorkid5,
    menustyle,
    fkontak,
    plink,
    botname,
    isCreator,
    mess,
    args,
    db,
    botNumber,
    isUrl,
    bad,
    mime,
    quoted,
    formatSize,
    nganuin,
    shorturl,
    color,
    jsonformat,
    checkBandwidth,
    participants,
    isGroupOwner,
    isAdmins,
    isBotAdmins,
    groupMetadata,
    setHerokuEnvVar,
    getHerokuEnvVars,
    deleteHerokuEnvVar,
    performance,
    timezones,
    toAudio, // Add toAudio to context
    webp2mp4File, // Add webp2mp4File to context
    toPTT, // Add toPTT to context
    y2save, // Add y2save to context
    yts, // Add yts to context
    axios, // Add axios to context
    fs, // Add fs to context
    exec, // Add exec to context
    path, // Add path to context
    packname, // Add packname to context
    author, // Add author to context
    moment, // Add moment to context
    util, // Add util to context
    https, // Add https to context
    downloadContentFromMessage, // Add downloadContentFromMessage to context
    Telesticker, // Add Telesticker to context
    downloadXMp3, // Add downloadXMp3 to context
    downloadXMp4, // Add downloadXMp4 to context
    downloadXMp3Doc, // Add downloadXMp3Doc to context
    downloadXMp4Doc, // Add downloadXMp4Doc to context
    ringtone, // Add ringtone to context
    pinterest,
    getDevice,
    os,
    checkDiskSpace 
};

  const handled = await pluginManager.executePlugin(context, isCommand);

  fs.watch('./Plugins', async () => {
    await pluginManager.unloadAllPlugins();
    await pluginManager.loadPlugins();
  });
})();
//<================================================>//
switch (isCommand) {
case 'menu':

    // Memory Formatting Function
    const formatMemory = (memory) => {
        if (memory < 1024 * 1024 * 1024) {
            return Math.round(memory / 1024 / 1024) + ' MB';
        } else {
            return Math.round(memory / 1024 / 1024 / 1024) + ' GB';
        }
    };

    // Generate Menu Function
    const generateMenu = (plugins, ownername, prefixz, modeStatus, versions, latensie, readmore) => {
        const memoryUsage = process.memoryUsage();
        const usedMemory = memoryUsage.heapUsed;
        const totalMemory = os.totalmem();

        let menu = `┏▣ ◊ 𝙲𝙰𝚂𝙿𝙴𝚁-𝚇𝙼𝙳 ◊\n`;
        menu += `┃ *ᴏᴡɴᴇʀ* : ${ownername}\n`;
        menu += `┃ *ᴘʀᴇғɪx* : [ ${prefixz} ]\n`;
        menu += `┃ *ʜᴏsᴛ* : ${os.platform()}\n`;
        menu += `┃ *ᴘʟᴜɢɪɴs* : ${Object.values(plugins).flat().length}\n`;
        menu += `┃ *ᴍᴏᴅᴇ* : ${modeStatus}\n`;
        menu += `┃ *ᴠᴇʀsɪᴏɴ* : ${versions}\n`;
        menu += `┃ *sᴘᴇᴇᴅ* : ${latensie.toFixed(4)} ms\n`;
        menu += `┃ *ᴜsᴀɢᴇ* : ${formatMemory(usedMemory)} of ${formatMemory(totalMemory)}\n`;
        menu += `┗▣ \n${readmore}\n`;

        for (const category in plugins) {
            menu += `┏▣ ◊ *${category.toUpperCase()} MENU* ◊\n`;
            plugins[category].forEach(plugin => {
                plugin.command.forEach(command => {
                    menu += `│□ ${prefixz}${command}\n`;
                });
            });
            menu += `┗▣ \n\n`;
        }
        return menu;
    };

    // Load Plugins Function
    const loadMenuPlugins = (directory) => {
        const plugins = {};

        const searchDirectory = (currentDirectory, parentFolder = null) => {
            const entries = fs.readdirSync(currentDirectory);
            entries.forEach(entry => {
                const fullPath = path.join(currentDirectory, entry);
                const stats = fs.lstatSync(fullPath);

                if (stats.isDirectory()) {
                    searchDirectory(fullPath, entry);
                } else if (fullPath.endsWith('.js')) {
                    try {
                        delete require.cache[require.resolve(fullPath)];
                        const plugin = require(fullPath);
                        
                        const category = parentFolder || 'Uncategorized';
                        if (!plugins[category]) {
                            plugins[category] = [];
                        }
                        
                        plugins[category].push(plugin);
                    } catch (error) {
                        console.error(`Error loading plugin at ${fullPath}:`, error);
                    }
                }
            });
        };

        searchDirectory(directory);
        return plugins;
    };

    const tylorkids = [tylorkid1, tylorkid2, tylorkid3, tylorkid4, tylorkid5][Math.floor(Math.random() * 5)];

    const startTime = performance.now();
    await m.reply("Loading menu...");
    const endTime = performance.now();
    const latensie = endTime - startTime;

    // Load plugins
    const plugins = loadMenuPlugins(path.resolve(__dirname, './Plugins'));

    const menulist = generateMenu(plugins, ownername, prefixz, modeStatus, versions, latensie, readmore);

    if (menustyle === '1') {
        Xploader.sendMessage(m.chat, {
            document: {
                url: "https://i.ibb.co/2W0H9Jq/avatar-contact.png",
            },
            caption: menulist,
            mimetype: "application/zip",
            fileName: "𝗖𝗔𝗦𝗣𝗘𝗥-𝗫𝗠𝗗",
            fileLength: "9999999",
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: "",
                    body: "",
                    thumbnail: tylorkids,
                    sourceUrl: plink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: fkontak });
    } else if (menustyle === '2') {
        m.reply(menulist);
    } else if (menustyle === '3') {
        Xploader.sendMessage(m.chat, {
            text: menulist,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: botname,
                    body: ownername,
                    thumbnail: tylorkids,
                    sourceUrl: plink,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                },
            },
        }, { quoted: m });
    } else if (menustyle === '4') {
        Xploader.sendMessage(m.chat, {
            image: tylorkids,
            caption: menulist,
        }, { quoted: m });
    } else if (menustyle === '5') {
        Xploader.relayMessage(m.chat, {
            requestPaymentMessage: {
                currencyCodeIso4217: 'USD',
                requestFrom: '0@s.whatsapp.net',
                amount1000: '1',
                noteMessage: {
                    extendedTextMessage: {
                        text: menulist,
                        contextInfo: {
                            mentionedJid: [m.sender],
                            externalAdReply: {
                                showAdAttribution: true,
                            },
                        },
                    },
                },
            },
        }, {});
    }
    break;
//<================================================>//
default: {
    if (budy.startsWith('$')) {
        if (!isCreator) return;
        exec(budy.slice(2), (err, stdout) => {
            if (err) return m.reply(err);
            if (stdout) return m.reply(stdout);
        });
    }

    if (budy.startsWith('>')) {
        if (!isCreator) return;
        try {
            let evaled = await eval(budy.slice(2));
            if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
            await m.reply(evaled);
        } catch (err) {
            console.error(err); // Log the error to the console
            await m.reply(String(err));
        }
    }

    if (budy.startsWith('=>')) {
        if (!isCreator) return;

        function Return(sul) {
            let sat = JSON.stringify(sul, null, 2);
            let bang = util.format(sat);
            if (sat == undefined) {
                bang = util.format(sul);
            }
            return m.reply(bang);
        }
        try {
            const result = await eval(`(async () => { return ${budy.slice(3)} })()`);
            m.reply(util.format(result));
        } catch (e) {
            console.error(e); // Log the error to the console
            m.reply(String(e));
        }
    }
}

}
} catch (err) {
  let formattedError = util.format(err);
  let errorMessage = String(formattedError);

  if (shouldLogError(errorMessage)) {
    if (typeof err === 'string') {
      m.reply(`An error occurred:\n\nError Description: ${errorMessage}`);
    } else {
      console.log(formattedError);
      Xploader.sendMessage(Xploader.user.id, {
        text: `An error occurred:\n\nError Description: ${errorMessage}`,
        contextInfo: {
          forwardingScore: 9999999,
          isForwarded: true
        }
      });
    }

    recordError(errorMessage);
  } else {
    console.log(`Repeated error suppressed: ${errorMessage}`);
  }
}
}

//file watch code...
let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(color(`Updated ${__filename}`));
  delete require.cache[file];
  require(file);
});
