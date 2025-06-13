"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.TagsModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const user = new Schema({
    username: { type: String, unique: true },
    password: String
});
const content = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['text', 'youtube', 'twitter', 'image', 'video', 'file'] },
    fileurl: String,
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: 'Tags' }],
    createdAt: { type: Date, default: Date.now() },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'UserModel', required: true },
});
const tags = new Schema({
    title: { type: String, require: true }
});
const link = new Schema({
    hash: String,
    userId: { type: mongoose_1.default.Types.ObjectId, ref: 'UserModel', required: true, unique: true }
});
exports.UserModel = (0, mongoose_1.model)("UserModel", user);
exports.ContentModel = (0, mongoose_1.model)("ContentModel", content);
exports.TagsModel = (0, mongoose_1.model)("TagsModel", tags);
exports.LinkModel = (0, mongoose_1.model)("LinkModel", link);
