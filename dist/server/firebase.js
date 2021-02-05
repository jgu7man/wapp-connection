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
exports.firestore = exports.Firebase = exports.ACCOUNT = void 0;
const admin = __importStar(require("firebase-admin"));
const main_agentesmart_589511385b0d_json_1 = __importDefault(require("./secret/main-agentesmart-589511385b0d.json"));
exports.ACCOUNT = main_agentesmart_589511385b0d_json_1.default;
class Firebase {
    constructor() {
        this.auth = admin.initializeApp({
            credential: admin.credential.cert(exports.ACCOUNT),
            databaseURL: "https://main-agentesmart.firebaseio.com",
        });
    }
}
exports.Firebase = Firebase;
exports.firestore = new Firebase().auth.firestore();
//# sourceMappingURL=firebase.js.map