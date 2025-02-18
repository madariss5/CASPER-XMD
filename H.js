/**
 * XPLOADER BOT - Advanced WhatsApp Bot
 * Author: Casper-Tech-ke
 * Version: 2.0.0
 * Timestamp: 2025-02-18 06:32:46
 */

// Baileys imports
const {
    BufferJSON,
    WA_DEFAULT_EPHEMERAL,
    generateWAMessageFromContent,
    proto,
    useMultiFileAuthState,
    makeWASocket,
    downloadContentFromMessage,
    generateWAMessageContent,
    generateWAMessage,
    prepareWAMessageMedia,
    areJidsSameUser,
    getContentType
} = require('@whiskeysockets/baileys');

// System dependencies
const {
    exec,
    spawn,
    execSync
} = require('child_process');
const util = require('util');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const chalk = require('chalk');
const googleTTS = require('google-tts-api');
const acrcloud = require('acrcloud');
const FormData = require('form-data');
const cheerio = require('cheerio');
const { randomBytes } = require('crypto');
const { performance } = require('perf_hooks');
const moment = require('moment-timezone');
const lolcatjs = require('lolcatjs');
const os = require('os');
const checkDiskSpace = require('check-disk-space').default;
const speed = require('performance-now');
const yts = require('yt-search');
const { translate } = require('@vitalets/google-translate-api');
const jsobfus = require('javascript-obfuscator');
const { toAudio, toPTT, toVideo, ffmpeg, addExifAvatar } = require('./lib/converter');
const { uploadMedia, handleMediaUpload } = require('./lib/catbox');
const { addExif } = require('./lib/exif');

// Configuration and Constants
const config = {
    VERSION: '1.0.0',
    OWNER_NUMBER: '254732982940',
    BOT_NAME: 'CASPER-XMD🤓 ',
    PREFIX: '/',
    API_KEY: '882a7ef12dc0dc408f70a2f3f4724340',
    TIMEZONE: 'Africa/Nairobi',
    HEROKU_API_KEY: process.env.HEROKU_API_KEY || '',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME || '',
    SESSION_DIR: './session',
    DATABASE_PATH: './src/database.json',
    LOGS_DIR: './logs',
    MEDIA_DIR: './Media/Images',
    TEMP_DIR: './temp'
};

// Global variables
global.api = {
    lolhuman: 'https://api.lolhuman.xyz/api',
    zenz: 'https://zenzapis.xyz'
};

// Load media assets
const MEDIA = {
    BOT_PIC1: fs.readFileSync('./Media/Images/Xploader1.jpg'),
    BOT_PIC2: fs.readFileSync('./Media/Images/Xploader2.jpg'),
    BOT_PIC3: fs.readFileSync('./Media/Images/Xploader3.jpg'),
    BOT_PIC4: fs.readFileSync('./Media/Images/Xploader4.jpg'),
    BOT_PIC5: fs.readFileSync('./Media/Images/Xploader5.jpg')
};

// Initialize ACRCloud
const acr = new acrcloud({
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: config.API_KEY,
    access_secret: 'qVvKAxknV7bUdtxjXS22b5ssvWYxpnVndhy2isXP'
});

// Special characters
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
// Import utility functions
const {
    smsg,
    formatDate,
    getTime,
    getGroupAdmins,
    formatp,
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
    GIFBufferToVideoBuffer
} = require('./lib/myfunc');

// Database Manager Class
class DatabaseManager {
    constructor() {
        this.path = config.DATABASE_PATH;
        this.data = {
            users: new Map(),
            groups: new Map(),
            settings: new Map(),
            stats: new Map(),
            cooldowns: new Map(),
            blacklist: new Set(),
            premium: new Set()
        };
        this.autoSaveInterval = 300000; // 5 minutes
        this.init();
    }

    init() {
        this.load();
        setInterval(() => this.save(), this.autoSaveInterval);
    }

    load() {
        try {
            if (fs.existsSync(this.path)) {
                const data = JSON.parse(fs.readFileSync(this.path));
                this.data = {
                    users: new Map(Object.entries(data.users || {})),
                    groups: new Map(Object.entries(data.groups || {})),
                    settings: new Map(Object.entries(data.settings || {})),
                    stats: new Map(Object.entries(data.stats || {})),
                    cooldowns: new Map(Object.entries(data.cooldowns || {})),
                    blacklist: new Set(data.blacklist || []),
                    premium: new Set(data.premium || [])
                };
                console.log(chalk.green('Database loaded successfully'));
            } else {
                this.save();
                console.log(chalk.yellow('Created new database file'));
            }
        } catch (error) {
            console.error('Database load error:', error);
            this.save();
        }
    }

    save() {
        try {
            const data = {
                users: Object.fromEntries(this.data.users),
                groups: Object.fromEntries(this.data.groups),
                settings: Object.fromEntries(this.data.settings),
                stats: Object.fromEntries(this.data.stats),
                cooldowns: Object.fromEntries(this.data.cooldowns),
                blacklist: Array.from(this.data.blacklist),
                premium: Array.from(this.data.premium)
            };
            
            // Ensure directory exists
            const dir = path.dirname(this.path);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(this.path, JSON.stringify(data, null, 2));
            console.log(chalk.blue('Database saved successfully'));
        } catch (error) {
            console.error('Database save error:', error);
        }
    }

    getUser(id) {
        if (!this.data.users.has(id)) {
            this.data.users.set(id, {
                id: id,
                name: '',
                xp: 0,
                level: 1,
                limit: 20,
                balance: 0,
                registered: false,
                premium: false,
                lastDaily: 0,
                warnings: 0,
                banned: false,
                banExpiration: null,
                afk: false,
                afkReason: '',
                afkTime: null,
                createdAt: Date.now(),
                settings: {
                    autoread: true,
                    autotyping: false,
                    autorecording: false
                }
            });
        }
        return this.data.users.get(id);
    }

    updateUser(id, updates) {
        const user = this.getUser(id);
        Object.assign(user, updates);
        this.data.users.set(id, user);
        return user;
    }

    getGroup(id) {
        if (!this.data.groups.has(id)) {
            this.data.groups.set(id, {
                id: id,
                name: '',
                welcome: true,
                antilink: false,
                antispam: true,
                antibadword: false,
                members: new Set(),
                settings: {
                    restrict: false,
                    nolink: false,
                    nodelete: false,
                    nobadword: false
                },
                createdAt: Date.now()
            });
        }
        return this.data.groups.get(id);
    }

    updateGroup(id, updates) {
        const group = this.getGroup(id);
        Object.assign(group, updates);
        this.data.groups.set(id, group);
        return group;
    }

    isBlacklisted(id) {
        return this.data.blacklist.has(id);
    }

    isPremium(id) {
        return this.data.premium.has(id);
    }

    addBlacklist(id) {
        this.data.blacklist.add(id);
        this.save();
    }

    removeBlacklist(id) {
        this.data.blacklist.delete(id);
        this.save();
    }

    addPremium(id, duration) {
        this.data.premium.add(id);
        const user = this.getUser(id);
        user.premium = true;
        user.premiumExpiration = Date.now() + duration;
        this.save();
    }

    removePremium(id) {
        this.data.premium.delete(id);
        const user = this.getUser(id);
        user.premium = false;
        user.premiumExpiration = null;
        this.save();
    }
}
// XP System Implementation
class XPSystem {
    constructor(database) {
        this.db = database;
        this.levelMultiplier = 1.5;
        this.baseXP = 100;
        this.xpCooldowns = new Map();
        this.cooldownDuration = 60000; // 1 minute cooldown
    }

    calculateRequiredXP(level) {
        return Math.floor(this.baseXP * Math.pow(this.levelMultiplier, level));
    }

    async addXP(userId, amount) {
        // Check cooldown
        const lastXP = this.xpCooldowns.get(userId);
        const now = Date.now();
        
        if (lastXP && (now - lastXP) < this.cooldownDuration) {
            return {
                success: false,
                reason: 'cooldown',
                timeLeft: Math.ceil((this.cooldownDuration - (now - lastXP)) / 1000)
            };
        }

        const user = this.db.getUser(userId);
        user.xp += amount;

        // Check for level up
        const requiredXP = this.calculateRequiredXP(user.level);
        let levelUp = false;

        while (user.xp >= requiredXP) {
            user.level += 1;
            user.xp -= requiredXP;
            levelUp = true;
        }

        this.db.updateUser(userId, user);
        this.xpCooldowns.set(userId, now);

        return {
            success: true,
            levelUp,
            newLevel: user.level,
            currentXP: user.xp,
            requiredXP: this.calculateRequiredXP(user.level)
        };
    }

    getLeaderboard(limit = 10) {
        return Array.from(this.db.data.users.entries())
            .map(([id, data]) => ({
                id,
                xp: data.xp,
                level: data.level,
                name: data.name
            }))
            .sort((a, b) => b.level - a.level || b.xp - a.xp)
            .slice(0, limit);
    }

    getRank(userId) {
        const leaderboard = this.getLeaderboard(Infinity);
        return leaderboard.findIndex(user => user.id === userId) + 1;
    }

    async sendLevelUpMessage(client, userId, chat, levelUpInfo) {
        const user = this.db.getUser(userId);
        const rank = this.getRank(userId);
        const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        
        const levelUpEmbed = {
            title: '🎉 LEVEL UP!',
            description: `Congratulations <@${userId}>! You've reached level ${levelUpInfo.newLevel}!`,
            fields: [
                {
                    name: '📊 Statistics',
                    value: `Level: ${levelUpInfo.newLevel}\nXP: ${levelUpInfo.currentXP}/${levelUpInfo.requiredXP}\nRank: #${rank}`
                }
            ],
            footer: {
                text: `Keep chatting to earn more XP! | ${currentTime}`
            }
        };

        await client.sendMessage(chat, {
            text: `🎉 *LEVEL UP!*\n\n` +
                  `👤 User: @${userId.split('@')[0]}\n` +
                  `📊 New Level: ${levelUpInfo.newLevel}\n` +
                  `🏆 Rank: #${rank}\n` +
                  `⭐ XP: ${levelUpInfo.currentXP}/${levelUpInfo.requiredXP}\n\n` +
                  `Keep chatting to earn more XP! 🌟`,
            mentions: [userId],
            contextInfo: {
                externalAdReply: {
                    title: "CASPER-XMD🤓  - Level Up System",
                    body: "Your Premium Bot Assistant",
                    thumbnail: MEDIA.BOT_PIC1,
                    mediaType: 1,
                    showAdAttribution: true
                }
            }
        });
    }
                             }
// Message Handler Class
class MessageHandler {
    constructor(client, database, xpSystem) {
        this.client = client;
        this.db = database;
        this.xp = xpSystem;
        this.commands = new Map();
        this.cooldowns = new Map();
        this.spam = new AntiSpamSystem();
        this.queue = new MessageQueue();
        this.logger = new ActivityLogger();
        this.mediaProcessor = new MediaProcessor();
        this.initializeCommands();
    }

    initializeCommands() {
        // Command registration and initialization logic
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
        
        for (const file of commandFiles) {
            const command = require(`./commands/${file}`);
            this.commands.set(command.name, command);
        }
    }

    async handleMessage(m, chatUpdate, store) {
        try {
            // Basic message extraction
            const type = getContentType(m.message);
            const content = JSON.stringify(m.message);
            const from = m.key.remoteJid;
            const quoted = m.quoted ? m.quoted : m;
            const mime = (quoted.msg || quoted).mimetype || '';
            const isMedia = /image|video|sticker|audio/.test(mime);
            const budy = (type === 'conversation') ? m.message.conversation : 
                      (type === 'imageMessage') ? m.message.imageMessage.caption :
                      (type === 'videoMessage') ? m.message.videoMessage.caption :
                      (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text :
                      (type === 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId :
                      (type === 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
                      (type === 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : '';

            // Message metadata
            const isGroup = from.endsWith('@g.us');
            const sender = m.sender;
            const pushName = m.pushName || "No Name";
            const body = budy;
            const args = body.trim().split(/ +/);
            const isCommand = body.startsWith(config.PREFIX);
            const command = isCommand ? args[0].slice(config.PREFIX.length).toLowerCase() : '';
            const messageTimestamp = moment(m.messageTimestamp * 1000).format('YYYY-MM-DD HH:mm:ss');

            // Log activity
            this.logger.log('message', {
                from,
                sender,
                type,
                body,
                isGroup,
                isCommand,
                timestamp: messageTimestamp
            });

            // Anti-spam check
            const spamCheck = this.spam.checkSpam(sender, Date.now());
            if (spamCheck.isSpam) {
                const message = spamCheck.isBanned ? 
                    `You are temporarily banned for spamming. Please wait ${spamCheck.remainingTime} seconds.` :
                    'Please slow down to avoid being temporarily banned.';
                    
                await this.client.sendMessage(from, { text: message });
                return;
            }

            // XP System for group messages
            if (isGroup && !m.key.fromMe) {
                const xpGain = Math.floor(Math.random() * 15) + 10;
                const xpResult = await this.xp.addXP(sender, xpGain);
                
                if (xpResult.levelUp) {
                    await this.xp.sendLevelUpMessage(
                        this.client,
                        sender,
                        from,
                        xpResult
                    );
                }
            }

            // Command Processing
            if (isCommand) {
                this.db.updateUser(sender, {
                    lastCommandUsed: messageTimestamp,
                    lastSeen: messageTimestamp
                });

                // Check if command exists
                const cmd = this.commands.get(command);
                if (!cmd) {
                    await this.client.sendMessage(from, {
                        text: `Command *${command}* not found. Use ${config.PREFIX}menu to see available commands.`
                    });
                    return;
                }

                // Check user permissions
                if (cmd.premium && !this.db.isPremium(sender)) {
                    await this.client.sendMessage(from, {
                        text: '❌ This command is only for premium users!'
                    });
                    return;
                }

                // Check cooldowns
                const cooldown = this.cooldowns.get(`${sender}-${command}`);
                if (cooldown) {
                    const timeLeft = (cooldown - Date.now()) / 1000;
                    if (timeLeft > 0) {
                        await this.client.sendMessage(from, {
                            text: `Please wait ${timeLeft.toFixed(1)} seconds before using ${command} again.`
                        });
                        return;
                    }
                }

                try {
                    // Execute command
                    await cmd.execute(this.client, m, {
                        args: args.slice(1),
                        prefix: config.PREFIX,
                        command,
                        text: args.slice(1).join(' '),
                        sender,
                        pushName,
                        isGroup,
                        from,
                        quoted,
                        mime,
                        isMedia,
                        store,
                        timestamp: messageTimestamp
                    });

                    // Set cooldown
                    this.cooldowns.set(`${sender}-${command}`, Date.now() + (cmd.cooldown || 3) * 1000);

                    // Update command usage statistics
                    const stats = this.db.data.stats.get(command) || { uses: 0, lastUsed: null };
                    stats.uses++;
                    stats.lastUsed = messageTimestamp;
                    this.db.data.stats.set(command, stats);

                } catch (error) {
                    console.error(`Error executing command ${command}:`, error);
                    await this.client.sendMessage(from, {
                        text: '❌ An error occurred while executing this command.'
                    });
                }
                  }
                      // Handle media messages
            if (isMedia) {
                const mediaData = await this.mediaProcessor.processMedia(m, mime);
                if (mediaData) {
                    await this.handleMediaUpload(mediaData, from, sender, messageTimestamp);
                }
            }

            // Handle group-specific features
            if (isGroup) {
                const groupData = this.db.getGroup(from);
                
                // Anti-link check
                if (groupData.antilink && !this.isAdmin(sender, from)) {
                    if (budy.includes('http://') || budy.includes('https://')) {
                        await this.client.sendMessage(from, { 
                            text: '⚠️ Links are not allowed in this group!' 
                        });
                        if (this.canBotDelete(from)) {
                            await this.client.sendMessage(from, { delete: m.key });
                        }
                        return;
                    }
                }

                // Anti-badword check
                if (groupData.antibadword && !this.isAdmin(sender, from)) {
                    const badwords = await this.getBadWords();
                    if (badwords.some(word => budy.toLowerCase().includes(word))) {
                        await this.client.sendMessage(from, { 
                            text: '⚠️ Please watch your language!' 
                        });
                        if (this.canBotDelete(from)) {
                            await this.client.sendMessage(from, { delete: m.key });
                        }
                        return;
                    }
                }
            }

            // AFK System
            const mentionedJids = [...new Set([...(m.mentionedJid || []), ...(m?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [])])];
            
            if (mentionedJids.length > 0) {
                for (const jid of mentionedJids) {
                    const user = this.db.getUser(jid);
                    if (user.afk) {
                        const afkDuration = moment.duration(moment().diff(moment(user.afkTime)));
                        const afkMessage = `
🚫 @${jid.split('@')[0]} is currently AFK 
⏰ Duration: ${afkDuration.humanize()}
💭 Reason: ${user.afkReason || 'No reason specified'}
📅 Started: ${moment(user.afkTime).format('YYYY-MM-DD HH:mm:ss')}`;
                        
                        await this.client.sendMessage(from, {
                            text: afkMessage,
                            mentions: [jid]
                        });
                    }
                }
            }

            // Return from AFK
            if (this.db.getUser(sender).afk && !isCommand) {
                const user = this.db.getUser(sender);
                const afkDuration = moment.duration(moment().diff(moment(user.afkTime)));
                
                await this.client.sendMessage(from, {
                    text: `👋 Welcome back @${sender.split('@')[0]}!\n⏰ You were AFK for ${afkDuration.humanize()}`,
                    mentions: [sender]
                });

                this.db.updateUser(sender, {
                    afk: false,
                    afkReason: '',
                    afkTime: null
                });
            }

            // Auto-response system
            if (!isCommand && !isGroup) {
                const response = await this.getAutoResponse(budy);
                if (response) {
                    await this.client.sendMessage(from, { text: response });
                }
            }

        } catch (error) {
            console.error('Error in message handler:', error);
            this.logger.error('messageHandler', error);
        }
    }

    async isAdmin(jid, groupId) {
        try {
            const groupMetadata = await this.client.groupMetadata(groupId);
            const admins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
            return admins.includes(jid);
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    }

    async canBotDelete(groupId) {
        try {
            const groupMetadata = await this.client.groupMetadata(groupId);
            const botId = this.client.user.id;
            const botMember = groupMetadata.participants.find(p => p.id === botId);
            return botMember && botMember.admin === 'admin';
        } catch (error) {
            console.error('Error checking bot permissions:', error);
            return false;
        }
    }

    async getBadWords() {
        try {
            // This could be loaded from a database or file
            return ['badword1', 'badword2', 'badword3'];
        } catch (error) {
            console.error('Error loading bad words:', error);
            return [];
        }
    }

    async getAutoResponse(message) {
        try {
            // This could be more sophisticated with AI or pattern matching
            const responses = {
                'hello': 'Hi there! How can I help you?',
                'hi': 'Hello! Need any assistance?',
                'help': `Type ${config.PREFIX}menu to see available commands.`
            };
            
            return responses[message.toLowerCase()];
        } catch (error) {
            console.error('Error in auto-response:', error);
            return null;
        }
    }
}
// Anti-Spam System Implementation
class AntiSpamSystem {
    constructor() {
        this.messages = new Map();
        this.warnings = new Map();
        this.bans = new Map();
        this.maxMessages = 5; // Maximum messages per minute
        this.warningThreshold = 3; // Warnings before ban
        this.banDuration = 300000; // 5 minutes
    }

    checkSpam(userId, timestamp) {
        // Clean up old messages
        this.cleanup(timestamp);

        // Check if user is banned
        if (this.isBanned(userId, timestamp)) {
            const banInfo = this.bans.get(userId);
            const remainingTime = Math.ceil((banInfo.expires - timestamp) / 1000);
            return {
                isSpam: true,
                isBanned: true,
                remainingTime
            };
        }

        // Get user's message history
        let userMessages = this.messages.get(userId) || [];
        userMessages = userMessages.filter(time => (timestamp - time) <= 60000); // Last minute

        // Update message history
        userMessages.push(timestamp);
        this.messages.set(userId, userMessages);

        // Check if spam threshold exceeded
        if (userMessages.length > this.maxMessages) {
            const warnings = (this.warnings.get(userId) || 0) + 1;
            this.warnings.set(userId, warnings);

            // Ban if too many warnings
            if (warnings >= this.warningThreshold) {
                this.banUser(userId, timestamp);
                return {
                    isSpam: true,
                    isBanned: true,
                    remainingTime: this.banDuration / 1000
                };
            }

            return {
                isSpam: true,
                isBanned: false,
                warnings,
                maxWarnings: this.warningThreshold
            };
        }

        return {
            isSpam: false,
            isBanned: false
        };
    }

    cleanup(currentTime) {
        // Clean up expired bans
        for (const [userId, banInfo] of this.bans.entries()) {
            if (currentTime >= banInfo.expires) {
                this.bans.delete(userId);
                this.warnings.delete(userId);
            }
        }

        // Clean up old messages
        for (const [userId, messages] of this.messages.entries()) {
            const recentMessages = messages.filter(time => (currentTime - time) <= 60000);
            if (recentMessages.length === 0) {
                this.messages.delete(userId);
            } else {
                this.messages.set(userId, recentMessages);
            }
        }
    }

    isBanned(userId, currentTime) {
        const banInfo = this.bans.get(userId);
        return banInfo && currentTime < banInfo.expires;
    }

    banUser(userId, timestamp) {
        this.bans.set(userId, {
            timestamp: timestamp,
            expires: timestamp + this.banDuration
        });
        this.warnings.delete(userId);
        this.messages.delete(userId);
    }

    unbanUser(userId) {
        this.bans.delete(userId);
        this.warnings.delete(userId);
        this.messages.delete(userId);
    }

    getStatus(userId) {
        return {
            messageCount: (this.messages.get(userId) || []).length,
            warnings: this.warnings.get(userId) || 0,
            isBanned: this.bans.has(userId),
            banExpires: this.bans.get(userId)?.expires
        };
    }
}

// Message Queue Implementation
class MessageQueue {
    constructor() {
        this.queue = [];
        this.processing = false;
        this.rateLimit = 1000; // 1 second between messages
    }

    async add(message) {
        this.queue.push({
            message,
            timestamp: Date.now()
        });
        
        if (!this.processing) {
            this.processQueue();
        }
    }

    async processQueue() {
        if (this.queue.length === 0) {
            this.processing = false;
            return;
        }

        this.processing = true;
        const { message, timestamp } = this.queue[0];

        try {
            await message();
            this.queue.shift();
            
            // Wait for rate limit
            const elapsed = Date.now() - timestamp;
            if (elapsed < this.rateLimit) {
                await delay(this.rateLimit - elapsed);
            }
        } catch (error) {
            console.error('Error processing message:', error);
            // Remove failed message
            this.queue.shift();
        }

        // Process next message
        this.processQueue();
    }

    clear() {
        this.queue = [];
        this.processing = false;
    }

    getQueueLength() {
        return this.queue.length;
    }
  }
// Activity Logger Implementation
class ActivityLogger {
    constructor() {
        this.logPath = config.LOGS_DIR;
        this.currentDate = moment().format('YYYY-MM-DD');
        this.currentLogFile = null;
        this.queue = [];
        this.batchSize = 10;
        this.flushInterval = 5000; // 5 seconds
        this.initialize();
    }

    initialize() {
        if (!fs.existsSync(this.logPath)) {
            fs.mkdirSync(this.logPath, { recursive: true });
        }
        
        setInterval(() => this.flushLogs(), this.flushInterval);
    }

    getLogFileName() {
        const date = moment().format('YYYY-MM-DD');
        return path.join(this.logPath, `activity-${date}.log`);
    }

    async log(type, data) {
        const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
        const logEntry = {
            timestamp,
            type,
            data,
            user: 'Casper-Tech-ke' // Current system user
        };

        this.queue.push(logEntry);

        if (this.queue.length >= this.batchSize) {
            await this.flushLogs();
        }
    }

    async error(type, error) {
        const errorData = {
            message: error.message,
            stack: error.stack,
            type: error.type || 'unknown'
        };
        await this.log('error', {
            type,
            error: errorData
        });
    }

    async flushLogs() {
        if (this.queue.length === 0) return;

        const currentFileName = this.getLogFileName();
        const logsToWrite = this.queue.splice(0, this.queue.length);

        try {
            const logStrings = logsToWrite.map(log => JSON.stringify(log)).join('\n') + '\n';
            fs.appendFileSync(currentFileName, logStrings);
        } catch (error) {
            console.error('Error writing to log file:', error);
            // Re-add failed logs to the front of the queue
            this.queue.unshift(...logsToWrite);
        }
    }

    async getRecentLogs(count = 100) {
        const fileName = this.getLogFileName();
        try {
            if (!fs.existsSync(fileName)) {
                return [];
            }

            const fileContent = fs.readFileSync(fileName, 'utf8');
            return fileContent
                .trim()
                .split('\n')
                .slice(-count)
                .map(line => JSON.parse(line));
        } catch (error) {
            console.error('Error reading log file:', error);
            return [];
        }
    }

    async searchLogs(query, options = {}) {
        const {
            startDate = moment().subtract(7, 'days').format('YYYY-MM-DD'),
            endDate = moment().format('YYYY-MM-DD'),
            type = null,
            limit = 100
        } = options;

        let results = [];
        const logFiles = fs.readdirSync(this.logPath)
            .filter(file => {
                const fileDate = file.match(/activity-(\d{4}-\d{2}-\d{2})\.log/)?.[1];
                return fileDate && fileDate >= startDate && fileDate <= endDate;
            });

        for (const file of logFiles) {
            const content = fs.readFileSync(path.join(this.logPath, file), 'utf8');
            const logs = content.trim().split('\n').map(line => JSON.parse(line));
            
            const filtered = logs.filter(log => {
                if (type && log.type !== type) return false;
                return JSON.stringify(log).toLowerCase().includes(query.toLowerCase());
            });

            results.push(...filtered);

            if (results.length >= limit) {
                results = results.slice(0, limit);
                break;
            }
        }

        return results;
    }

    async cleanup(daysToKeep = 30) {
        const cutoffDate = moment().subtract(daysToKeep, 'days').format('YYYY-MM-DD');
        
        const files = fs.readdirSync(this.logPath);
        for (const file of files) {
            const match = file.match(/activity-(\d{4}-\d{2}-\d{2})\.log/);
            if (match && match[1] < cutoffDate) {
                fs.unlinkSync(path.join(this.logPath, file));
            }
        }
    }
}
// Media Processor Implementation
class MediaProcessor {
    constructor() {
        this.supportedMimes = {
            image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            video: ['video/mp4', 'video/quicktime', 'video/webm'],
            audio: ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm'],
            sticker: ['image/webp']
        };
        this.maxSize = {
            image: 5 * 1024 * 1024, // 5MB
            video: 50 * 1024 * 1024, // 50MB
            audio: 15 * 1024 * 1024, // 15MB
            sticker: 1 * 1024 * 1024 // 1MB
        };
        this.tempDir = config.TEMP_DIR;
        this.mediaDir = config.MEDIA_DIR;
        this.initialize();
    }

    initialize() {
        [this.tempDir, this.mediaDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
    }

    async processMedia(message, mime) {
        try {
            const type = this.getMediaType(mime);
            if (!type) return null;

            const buffer = await this.downloadMedia(message);
            if (!buffer) return null;

            // Check file size
            if (buffer.length > this.maxSize[type]) {
                throw new Error(`File size exceeds maximum limit for ${type}`);
            }

            const metadata = await this.extractMetadata(buffer, type);
            const processedBuffer = await this.optimizeMedia(buffer, type, metadata);
            const hash = crypto.createHash('sha256').update(processedBuffer).digest('hex');

            const mediaInfo = {
                type,
                mime,
                size: processedBuffer.length,
                hash,
                metadata,
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                processor: 'Casper-Tech-ke'
            };

            // Save to permanent storage
            const fileName = `${hash}.${mime.split('/')[1]}`;
            const filePath = path.join(this.mediaDir, fileName);
            fs.writeFileSync(filePath, processedBuffer);

            return {
                buffer: processedBuffer,
                info: mediaInfo,
                path: filePath
            };

        } catch (error) {
            console.error('Error processing media:', error);
            return null;
        }
    }

    getMediaType(mime) {
        for (const [type, mimes] of Object.entries(this.supportedMimes)) {
            if (mimes.includes(mime)) return type;
        }
        return null;
    }

    async downloadMedia(message) {
        try {
            const stream = await downloadContentFromMessage(message, message.type);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            return buffer;
        } catch (error) {
            console.error('Error downloading media:', error);
            return null;
        }
    }

    async extractMetadata(buffer, type) {
        try {
            const tempFile = path.join(this.tempDir, `temp_${Date.now()}`);
            fs.writeFileSync(tempFile, buffer);

            let metadata = {};
            switch (type) {
                case 'image':
                    const imageInfo = await this.getImageMetadata(tempFile);
                    metadata = {
                        width: imageInfo.width,
                        height: imageInfo.height,
                        format: imageInfo.format,
                        hasAnimation: imageInfo.hasAnimation
                    };
                    break;

                case 'video':
                    const videoInfo = await this.getVideoMetadata(tempFile);
                    metadata = {
                        width: videoInfo.width,
                        height: videoInfo.height,
                        duration: videoInfo.duration,
                        fps: videoInfo.fps,
                        codec: videoInfo.codec
                    };
                    break;

                case 'audio':
                    const audioInfo = await this.getAudioMetadata(tempFile);
                    metadata = {
                        duration: audioInfo.duration,
                        bitrate: audioInfo.bitrate,
                        channels: audioInfo.channels,
                        codec: audioInfo.codec
                    };
                    break;
            }

            fs.unlinkSync(tempFile);
            return metadata;

        } catch (error) {
            console.error('Error extracting metadata:', error);
            return {};
        }
    }

    async optimizeMedia(buffer, type, metadata) {
        try {
            switch (type) {
                case 'image':
                    return await this.optimizeImage(buffer, metadata);
                case 'video':
                    return await this.optimizeVideo(buffer, metadata);
                case 'audio':
                    return await this.optimizeAudio(buffer, metadata);
                case 'sticker':
                    return await this.optimizeSticker(buffer, metadata);
                default:
                    return buffer;
            }
        } catch (error) {
            console.error('Error optimizing media:', error);
            return buffer;
        }
    }
      // Media optimization methods
    async optimizeImage(buffer, metadata) {
        try {
            if (metadata.format === 'gif' && metadata.hasAnimation) {
                // Preserve GIF animation but optimize
                return await this.optimizeGif(buffer);
            }

            const sharp = require('sharp');
            return await sharp(buffer)
                .resize(1280, 1280, {
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .jpeg({
                    quality: 85,
                    progressive: true,
                    optimizeCoding: true
                })
                .toBuffer();
        } catch (error) {
            console.error('Error optimizing image:', error);
            return buffer;
        }
    }

    async optimizeGif(buffer) {
        try {
            const gifsicle = require('gifsicle');
            const tempInput = path.join(this.tempDir, `temp_${Date.now()}.gif`);
            const tempOutput = path.join(this.tempDir, `temp_${Date.now()}_opt.gif`);

            fs.writeFileSync(tempInput, buffer);
            await util.promisify(exec)(`gifsicle --optimize=3 -o ${tempOutput} ${tempInput}`);

            const optimizedBuffer = fs.readFileSync(tempOutput);
            fs.unlinkSync(tempInput);
            fs.unlinkSync(tempOutput);

            return optimizedBuffer;
        } catch (error) {
            console.error('Error optimizing GIF:', error);
            return buffer;
        }
    }

    async optimizeVideo(buffer, metadata) {
        try {
            const tempInput = path.join(this.tempDir, `temp_${Date.now()}.mp4`);
            const tempOutput = path.join(this.tempDir, `temp_${Date.now()}_opt.mp4`);

            fs.writeFileSync(tempInput, buffer);

            // Calculate target bitrate based on resolution
            const targetBitrate = this.calculateTargetBitrate(metadata.width, metadata.height);

            await util.promisify(exec)(
                `ffmpeg -i ${tempInput} -c:v libx264 -b:v ${targetBitrate}k ` +
                `-preset medium -movflags +faststart -c:a aac -b:a 128k ${tempOutput}`
            );

            const optimizedBuffer = fs.readFileSync(tempOutput);
            fs.unlinkSync(tempInput);
            fs.unlinkSync(tempOutput);

            return optimizedBuffer;
        } catch (error) {
            console.error('Error optimizing video:', error);
            return buffer;
        }
    }

    async optimizeAudio(buffer, metadata) {
        try {
            const tempInput = path.join(this.tempDir, `temp_${Date.now()}.mp3`);
            const tempOutput = path.join(this.tempDir, `temp_${Date.now()}_opt.mp3`);

            fs.writeFileSync(tempInput, buffer);

            await util.promisify(exec)(
                `ffmpeg -i ${tempInput} -c:a libmp3lame -b:a 128k ${tempOutput}`
            );

            const optimizedBuffer = fs.readFileSync(tempOutput);
            fs.unlinkSync(tempInput);
            fs.unlinkSync(tempOutput);

            return optimizedBuffer;
        } catch (error) {
            console.error('Error optimizing audio:', error);
            return buffer;
        }
    }

    async optimizeSticker(buffer, metadata) {
        try {
            const sharp = require('sharp');
            return await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .webp({
                    quality: 80,
                    lossless: false
                })
                .toBuffer();
        } catch (error) {
            console.error('Error optimizing sticker:', error);
            return buffer;
        }
    }

    calculateTargetBitrate(width, height) {
        const pixels = width * height;
        if (pixels > 1920 * 1080) return 4000; // 4Mbps for 1080p+
        if (pixels > 1280 * 720) return 2500;  // 2.5Mbps for 720p+
        if (pixels > 854 * 480) return 1500;   // 1.5Mbps for 480p+
        return 800;                            // 800kbps for smaller videos
    }

    // Metadata extraction methods
    async getImageMetadata(filePath) {
        try {
            const sharp = require('sharp');
            const metadata = await sharp(filePath).metadata();
            return {
                width: metadata.width,
                height: metadata.height,
                format: metadata.format,
                hasAnimation: metadata.pages > 1
            };
        } catch (error) {
            console.error('Error getting image metadata:', error);
            return {};
        }
    }
      async getVideoMetadata(filePath) {
        try {
            const ffprobe = util.promisify(require('fluent-ffmpeg').ffprobe);
            const info = await ffprobe(filePath);
            const videoStream = info.streams.find(s => s.codec_type === 'video');
            
            return {
                width: videoStream.width,
                height: videoStream.height,
                duration: parseFloat(info.format.duration),
                fps: eval(videoStream.r_frame_rate),
                codec: videoStream.codec_name
            };
        } catch (error) {
            console.error('Error getting video metadata:', error);
            return {};
        }
    }

    async getAudioMetadata(filePath) {
        try {
            const ffprobe = util.promisify(require('fluent-ffmpeg').ffprobe);
            const info = await ffprobe(filePath);
            const audioStream = info.streams.find(s => s.codec_type === 'audio');
            
            return {
                duration: parseFloat(info.format.duration),
                bitrate: parseInt(audioStream.bit_rate) / 1000,
                channels: audioStream.channels,
                codec: audioStream.codec_name
            };
        } catch (error) {
            console.error('Error getting audio metadata:', error);
            return {};
        }
    }

    // Main class utility methods
    cleanup() {
        try {
            const tempFiles = fs.readdirSync(this.tempDir);
            const now = Date.now();
            
            tempFiles.forEach(file => {
                const filePath = path.join(this.tempDir, file);
                const stats = fs.statSync(filePath);
                
                // Remove files older than 1 hour
                if (now - stats.mtimeMs > 3600000) {
                    fs.unlinkSync(filePath);
                }
            });
        } catch (error) {
            console.error('Error cleaning up temp files:', error);
        }
    }

    async uploadToCloud(mediaInfo) {
        try {
            const response = await uploadMedia(mediaInfo.path);
            return {
                ...mediaInfo,
                url: response.url,
                cloudId: response.id
            };
        } catch (error) {
            console.error('Error uploading to cloud:', error);
            return mediaInfo;
        }
    }
}

// Export all classes
module.exports = {
    DatabaseManager,
    XPSystem,
    MessageHandler,
    AntiSpamSystem,
    MessageQueue,
    ActivityLogger,
    MediaProcessor
};

// Start cleanup intervals
const mediaProcessor = new MediaProcessor();
setInterval(() => mediaProcessor.cleanup(), 3600000); // Clean every hour

// Handle process termination
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    
    // Save database
    const db = global.db;
    if (db) {
        await db.save();
    }

    // Flush logs
    const logger = global.logger;
    if (logger) {
        await logger.flushLogs();
    }

    process.exit(0);
});

// Handle uncaught exceptions
process.on('uncaughtException', async (error) => {
    console.error('Uncaught Exception:', error);
    
    // Log error
    const logger = global.logger;
    if (logger) {
        await logger.error('uncaughtException', error);
        await logger.flushLogs();
    }
    
    // Restart process
    process.exit(1);
});

// Handle unhandled rejections
process.on('unhandledRejection', async (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    
    // Log error
    const logger = global.logger;
    if (logger) {
        await logger.error('unhandledRejection', { reason, promise });
        await logger.flushLogs();
    }
});

console.log(chalk.green(`
╔═══════════════════════════════════════════════════╗
║                 CASPER-XMD🤓 v1.0.0               ║
║              Created by Casper-Tech.              ║
║         Started at: ${moment().format('YYYY-MM-DD HH:mm:ss')}          ║
╚═══════════════════════════════════════════════════╝
`));
