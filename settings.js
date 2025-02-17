/**
 * @project CASPER-XMD
 * @description Bot Configuration
 * @version 1.0.0
 * @author Casper-Tech-ke
 * @created 2025-02-17 11:58:41
 */

const fs = require('fs')
const { color } = require('./lib/color')

// Load environment variables
if (fs.existsSync('.env')) require('dotenv').config()

// Bot Configuration
global.SESSION_ID = process.env.SESSION_ID || ''
global.botname = process.env.BOT_NAME || 'CASPER-XMD'
global.ownernumber = process.env.OWNER_NUMBER || 'YOUR_NUMBER'
global.sudo = process.env.SUDO ? process.env.SUDO.split(',') : []
global.ownername = process.env.OWNER_NAME || 'Casper-Tech-ke'
global.packname = process.env.STICKER_PACK_NAME || 'CASPER'
global.author = process.env.STICKER_AUTHOR_NAME || 'XMD'
global.prefixz = process.env.PREFIX || '.'

// Bot Features
global.mode = process.env.MODE || 'public'
global.statusemoji = process.env.STATUS_EMOJI || '💙'
global.autoviewstatus = process.env.AUTO_STATUS_VIEW || 'true'
global.autoreactstatus = process.env.AUTO_STATUS_REACT || 'false'
global.alwaysonline = process.env.ALWAYS_ONLINE || 'true'
global.chatbot = process.env.CHATBOT || 'false'
global.antidelete = process.env.ANTIDELETE || 'private'
global.anticall = process.env.ANTI_CALL || 'false'
global.welcome = process.env.WELCOME_MSG || 'false'
global.autoread = process.env.AUTO_READ || 'false'
global.menustyle = process.env.MENU_STYLE || '2'

// Social Links
global.website = 'https://github.com/Casper-Tech-ke'
global.gc = 'https://chat.whatsapp.com/your-group'
global.instagram = 'https://instagram.com/your-instagram'

// System Messages
global.mess = {
    success: '_Done!_',
    admin: '_This feature is only for group admins!_',
    botAdmin: '_Bot must be admin first!_',
    owner: '_This feature is only for the bot owner!_',
    group: '_This feature is only for groups!_',
    private: '_This feature is only for private chats!_',
    bot: '_This feature is only for the bot!_',
    wait: '_Processing your request..._',
    error: '_Error! Maybe API is down!_',
    premium: '_This feature is only for premium users!_'
}

// Auto Update
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(color(`Update '${__filename}'`, 'yellow'))
    delete require.cache[file]
    require(file)
})
