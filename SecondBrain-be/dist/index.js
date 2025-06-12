"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DB_1 = require("./DB");
const middleware_1 = require("./middleware");
const utlis_1 = require("./utlis");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
const multermiddleware_1 = require("./multermiddleware/multermiddleware");
const connectToMongo_1 = __importDefault(require("./db/connectToMongo"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 3000;
const JWT_SECRATE = process.env.JWT_SECRATE;
cloudinary_1.v2.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
});
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const hashpassword = yield bcrypt_1.default.hash(password, 10);
        yield DB_1.UserModel.create({
            username: username,
            password: hashpassword
        });
        res.json({
            message: "signup Sucessfull..."
        });
    }
    catch (e) {
        res.send({
            error: e
        });
    }
}));
app.post("/api/v1/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const verifyUser = yield DB_1.UserModel.findOne({
            username: username
        });
        //@ts-ignore
        const matchPassword = bcrypt_1.default.compare(password, verifyUser.password);
        if (verifyUser && matchPassword) {
            const token = jsonwebtoken_1.default.sign({
                id: verifyUser._id
            }, JWT_SECRATE);
            res.send({
                Authorization: token
            });
        }
        else {
            message: "incorrect cred...";
        }
    }
    catch (e) {
        res.send({
            Error: e
        });
    }
}));
app.post("/api/v1/content", middleware_1.middleware, multermiddleware_1.uploads, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const { title, description, type, link } = req.body;
        let fileurl = null;
        let resourceType;
        if (file) {
            if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                resourceType = "raw";
            }
            else {
                resourceType = "auto";
            }
            const result = yield cloudinary_1.v2.uploader.upload(file.path, {
                folder: "upload-doc",
                resource_type: resourceType,
            });
            fileurl = result.secure_url;
        }
        yield DB_1.ContentModel.create({
            title,
            description,
            type,
            fileurl: fileurl || null,
            link: link || null,
            //@ts-ignore
            userId: req.userId
        });
        res.status(201).send({
            "message": "content added..."
        });
    }
    catch (e) {
        console.error("something wrong", e);
        res.status(500).send({
            "error": e
        });
    }
}));
app.get("/api/v1/content", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.userId;
        const content = yield DB_1.ContentModel.find({
            userId: userId
        }).populate("userId", "username");
        res.json({
            content
        });
    }
    catch (e) {
        res.send({
            "error ": e
        });
    }
}));
app.delete("/api/v1/delete/:id", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.params.id;
    yield DB_1.ContentModel.findByIdAndDelete(contentId);
    res.status(200).json({
        "message": "content deleted..."
    });
}));
app.post("/api/v1/brain/share", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingUser = yield DB_1.LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });
        if (existingUser) {
            res.json({
                hash: existingUser.hash
            });
            return;
        }
        const hash = (0, utlis_1.random)(10);
        yield DB_1.LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        });
        res.json({
            hash
        });
    }
}));
app.get("/api/v1/brain/:sharelink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const hash = req.params.sharelink;
    const link = yield DB_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            "message": "sorry incorrect input..."
        });
        return;
    }
    const content = yield DB_1.ContentModel.find({
        userId: link.userId
    });
    const user = yield DB_1.UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "user Not found...ideally should not happen..."
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
app.listen(PORT, () => {
    (0, connectToMongo_1.default)();
    console.log(`i am listening...at port ${PORT}`);
});
