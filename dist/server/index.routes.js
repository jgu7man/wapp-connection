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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connections = exports.Routes = void 0;
const express_1 = require("express");
const wa_web_1 = require("./scripts/wa-web");
const http = __importStar(require("http"));
class Routes {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
    }
}
exports.Routes = Routes;
class Connections {
    constructor(app) {
        this.app = app;
    }
    WhatsServer() {
        const server = http.createServer(this.app);
        new wa_web_1.WhatsappClient().contection(server, '/wa-connect');
        return server;
    }
}
exports.Connections = Connections;
//# sourceMappingURL=index.routes.js.map