"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappClient = void 0;
const { Client } = require('whatsapp-web.js');
const QRCode = require('qrcode');
const WebSocket = __importStar(require("ws"));
const firebase_1 = require("../firebase");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
class WhatsappClient {
    constructor() {
        this.client = new Client({
            qrRefreshIntervalMs: 2000,
            qrTimeoutMs: 4500,
            restartOnAuthFail: false,
            takeoverTimeoutMs: 5000,
            takeoverOnConflict: true,
        });
    }
    contection(server, path) {
        const wss = new WebSocket.Server({ server, path });
        wss.on('connection', async (ws, req) => {
            const params = req.url ? req.url.split('?')[1] : null;
            // Validate URL
            if (!params) {
                console.log('Connection invalid');
                ws.send('DISSCONECTED');
                ws.onclose = () => { console.log('Connection closed'); };
                ws.close();
            }
            else {
                const projectId = params.split('=')[1];
                console.log('Connecting: ' + projectId);
                const agentsQuery = await firebase_1.firestore
                    .collectionGroup('agentes')
                    .where('projectId', '==', projectId)
                    .get();
                // Validate agent
                if (agentsQuery.empty) {
                    console.log('Agent not found');
                    ws.send('DISSCONECTED');
                    ws.onclose = () => { console.log('Connection closed'); };
                    ws.close();
                }
                else {
                    const projectPath = agentsQuery.docs[0].ref.path;
                    const whatsappRef = firebase_1.firestore.doc(`${projectPath}/integraciones/whatsapp`);
                    const whatsappDoc = await whatsappRef.get();
                    // Validate session
                    const session = whatsappDoc.exists ?
                        whatsappDoc.data()['session'] ? whatsappDoc.data()['session'] : null
                        : null;
                    console.log(session);
                    const client = new Client({
                        session: session,
                        qrTimeoutMs: 30000,
                        restartOnAuthFail: false,
                        takeoverTimeoutMs: 5000,
                        takeoverOnConflict: true,
                    });
                    client.initialize();
                    let qrCant = 0;
                    client.on('qr', (qr) => {
                        qrCant += 1, console.log(qrCant);
                        // Generate and scan this code with your phone
                        if (qrCant === 4) {
                            client.destroy();
                            ws.onclose = () => { console.error('max qr events emited'); };
                            ws.close();
                        }
                        else {
                            if (qrCant === 1 && !whatsappDoc.exists)
                                whatsappRef.set({ status: 'DISSCONECTED' });
                            console.log('QR RECEIVED', qr);
                            QRCode.toString(qr, { type: 'terminal' }, (err, url) => { console.log(url); });
                            whatsappRef.update({ qr });
                            ws.send(qr);
                        }
                    });
                    client.on('authenticated', (session) => {
                        console.log('AUTHENTICATED', session);
                        session = session;
                        whatsappRef.update({ session });
                    });
                    client.on('auth_failure', (msg) => {
                        // Fired if session restore was unsuccessfull
                        whatsappRef.update({
                            session: firebase_admin_1.default.firestore.FieldValue.delete(),
                            status: 'DISSCONECTED'
                        });
                        client.destroy();
                        ws.send('DISSCONECTED');
                        ws.onclose = () => { console.error('AUTHENTICATION FAILURE', msg); };
                        ws.close();
                    });
                    client.on('ready', () => {
                        console.log('Client is ready!');
                        whatsappRef.update({
                            status: 'CONNECTED',
                            qr: firebase_admin_1.default.firestore.FieldValue.delete()
                        });
                        ws.send('CONNECTED');
                    });
                    client.on('disconnected', (reason) => {
                        console.log('Client was logged out', reason);
                        whatsappRef.update({
                            status: 'DISSCONECTED',
                            session: firebase_admin_1.default.firestore.FieldValue.delete()
                        });
                        ws.send('DISSCONECTED');
                        client.destroy();
                        ws.onclose = () => { console.log(`${projectId} logout`); };
                        ws.close();
                    });
                    client.on('message', async (msg) => {
                        // const chat = await msg.getChat();
                        // simulates typing in the chat
                        // chat.sendStateTyping();
                        console.log('tipo mensaje: ', msg.type);
                        console.log('author: ', msg.author);
                        console.log('from: ', msg.from);
                        console.log(projectId + ' recibe:', msg.body);
                        console.log('\n');
                        if (msg.body === '!STATUS') {
                            client.sendMessage(msg.from, `
                                *Agente conectado*
                                projectId: _${projectId}_
                            `);
                        }
                        // stops typing or recording in the chat
                        // chat.clearState();
                        // SEND MESSAGE CONTENT 
                        // msg.reply(`
                        //     *Media info*
                        //     MimeType: ${attachmentData.mimetype}
                        //     Filename: ${attachmentData.filename}
                        //     Data (length): ${attachmentData.data.length}
                        // `);
                        // SEND LOCATION
                        //  else if (msg.body === '!location') {
                        //      msg.reply(new Location(37.422, -122.084, 'Googleplex\nGoogle Headquarters'));
                        //  });
                    });
                }
            }
        });
        // wss.on( 'close', () => {
        //     wss.close()
        // })
    }
}
exports.WhatsappClient = WhatsappClient;
//# sourceMappingURL=wa-web.js.map