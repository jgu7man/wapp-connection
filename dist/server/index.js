"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_routes_1 = require("./index.routes");
// import * as http from 'http';
// const { Client } = require('whatsapp-web.js');
// const client = new Client();
const app = express_1.default();
// const routes = new Routes()
const connections = new index_routes_1.Connections(app);
const wawebServer = connections.WhatsServer();
// const server = http.createServer(client)
wawebServer.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port 8999`);
});
// client.on('qr', (qr:string) => {
//     // Generate and scan this code with your phone
//     console.log('QR RECEIVED', qr);
// });
// client.on('ready', () => {
//     console.log('Client is ready!');
// });
// client.on('message', (msg:messageType) => {
//     if (msg.body == '!ping') {
//         msg.reply('pong');
//     }
// });
// client.initialize();
//# sourceMappingURL=index.js.map