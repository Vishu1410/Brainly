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
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("cloudinary");
const multermiddleware_1 = require("./multermiddleware/multermiddleware");
const connectToMongo_1 = __importDefault(require("./db/connectToMongo"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const crypto_1 = __importDefault(require("crypto"));
const streamifier_1 = __importDefault(require("streamifier"));
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
app.use(passport_1.default.initialize());
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // Save user to DB or create new
    try {
        const googleEmail = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        if (!googleEmail) {
            return done(new Error("google email not found"), false);
        }
        const brainToken = crypto_1.default.randomBytes(10).toString("hex");
        let user = yield DB_1.UserModel.findOne({ email: googleEmail });
        if (!user) {
            user = yield DB_1.UserModel.create({
                username: googleEmail,
                email: googleEmail,
                googleId: profile.id,
                brainToken
            });
        }
        const token = jsonwebtoken_1.default.sign(
        //@ts-ignore
        { id: user._id }, process.env.JWT_SECRATE, { expiresIn: "7d" });
        // ✅ Use postMessage or redirect to send token
        const html = `
            <script>
                window.opener.postMessage({ token: "${token}",brainToken:"${brainToken}" }, "http://localhost:5173/dashboard");
                window.close();
            </script>
            `;
        return done(null, { html });
    }
    catch (error) {
        console.error("google auth error : ", error);
        return done(error, false);
    }
})));
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"], session: false }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", { session: false, failureRedirect: "/login" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Successful login
    const { html } = req.user;
    res.send(html);
    // Redirect to frontend with JWT in query
}));
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const brainToken = crypto_1.default.randomBytes(10).toString("hex");
        const hashpassword = yield bcrypt_1.default.hash(password, 10);
        yield DB_1.UserModel.create({
            username: username,
            password: hashpassword,
            brainToken
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
        const Secret = process.env.JWT_SECRATE;
        const verifyUser = yield DB_1.UserModel.findOne({
            username: username
        });
        //@ts-ignore
        const matchPassword = yield bcrypt_1.default.compare(password, verifyUser.password);
        if (verifyUser && matchPassword) {
            const token = jsonwebtoken_1.default.sign({
                id: verifyUser._id
            }, Secret);
            const Username = verifyUser.username;
            const brainToken = verifyUser.brainToken;
            res.send({
                Username: Username,
                Authorization: token,
                brainToken: brainToken
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
    var _a;
    try {
        const file = req.file;
        const { title, description, type, link, textContent } = req.body;
        const shareToken = crypto_1.default.randomBytes(8).toString("hex");
        let fileurl = null;
        let filename;
        let filePublicId = null;
        if (file) {
            //stream the in-memory buffer to cloudinary..
            filename = file.originalname;
            const resourceType = /pdf$|docx$/i.test(filename) ? "raw" : "auto";
            const Response = (yield new Promise((resolve, reject) => {
                const upload = cloudinary_1.v2.uploader.upload_stream({
                    folder: "upload-doc",
                    resource_type: resourceType,
                    public_id: filename,
                    filename_override: filename,
                    unique_filename: false
                }, (err, result) => (err ? reject(err) : resolve(result)));
                streamifier_1.default.createReadStream(file.buffer).pipe(upload);
            }));
            fileurl = Response.secure_url;
            filePublicId = Response.public_id;
        }
        else if (link) {
            fileurl = link;
            filename = (_a = link.split("?")[0].split("/").pop()) !== null && _a !== void 0 ? _a : "download";
        }
        const newContent = yield DB_1.ContentModel.create({
            title,
            type,
            description,
            textContent,
            fileurl: fileurl,
            fileName: filename,
            filePublicId: filePublicId,
            //@ts-ignore
            userId: req.userId,
            shareToken
        });
        const populatedContent = yield DB_1.ContentModel.findById(newContent._id).populate("userId", "username");
        console.log("this is populatedContent : ", populatedContent);
        res.status(201).send({
            "message": "content added...",
            data: populatedContent
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
    try {
        const contentId = req.params.id;
        const content = yield DB_1.ContentModel.findById(contentId);
        if (!content) {
            res.status(404).json({ error: "content not found..." });
            return;
        }
        const filePublicId = content.filePublicId;
        const type = content.type;
        const needsDestroy = !!filePublicId && (type === "file" || type === "image" || type === "video");
        if (needsDestroy) {
            try {
                yield cloudinary_1.v2.uploader.destroy(filePublicId, {
                    resource_type: type === "file" ? "raw" : "auto"
                });
            }
            catch (err) {
                console.error("Cloudinary destroy failed:", err);
                res.status(502).json({ error: "Cloud cleanup failed." });
                return;
            }
        }
        yield content.deleteOne();
        res.status(200).json({
            "message": "content deleted..."
        });
    }
    catch (error) {
        console.error("Delete error : ", error);
        res.status(500).json({ error: "Server Error..." });
        return;
    }
}));
// app.post("/api/v1/brain/share",middleware,async(req,res)=>{
//     const share = req.body.share;
//     if(share){
//         const existingUser = await LinkModel.findOne({
//             //@ts-ignore
//             userId : req.userId
//         })
//         if(existingUser){
//             res.json({
//                 hash : existingUser.hash
//             })
//             return
//         }
//         const hash = random(10);
//         await LinkModel.create({
//             //@ts-ignore
//             userId : req.userId,
//             hash : hash
//         })
//         res.json({
//             hash
//         })
//     }
// })
// app.get("/api/v1/brain/:sharelink",async(req,res)=>{
//     //@ts-ignore
//     const hash = req.params.sharelink;
//     const link = await LinkModel.findOne({
//         hash
//     })
//     if(!link){
//         res.status(411).json({
//             "message" : "sorry incorrect input..."
//         })
//         return
//     }
//     const content = await ContentModel.find({
//         userId : link.userId
//     })
//     const user = await UserModel.findOne({
//         _id : link.userId
//     })
//     if(!user){
//         res.status(411).json({
//             message : "user Not found...ideally should not happen..."
//         })
//         return
//     }
//     res.json({
//         username : user.username,
//         content : content
//     })
// })
//@ts-ignore
app.get("/api/v1/shared/:token", middleware_1.middleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const content = yield DB_1.ContentModel.findOne({ shareToken: token });
        if (!content) {
            return res.status(404).json({ message: "content not found" });
        }
        res.send({ content });
    }
    catch (error) {
        console.error("error in sending token : ", error);
    }
}));
app.get("/api/v1/sharebrain/:token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        console.log("this is my token : ", token);
        const user = yield DB_1.UserModel.findOne({ brainToken: token }).lean();
        console.log("this is my found user : ", user);
        if (!user) {
            res.status(404).json({ error: "invalid link" });
            return;
        }
        ;
        const content = yield DB_1.ContentModel.find({ userId: user === null || user === void 0 ? void 0 : user._id }).lean();
        console.log("this is my content : ", content);
        res.json(content);
    }
    catch (error) {
        console.error("error in share complete brain : ", error);
    }
}));
app.listen(PORT, () => {
    (0, connectToMongo_1.default)();
    console.log(`i am listening...at port ${PORT}`);
});
