"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploads = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path_1.default.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});
exports.uploads = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 }
}).single('file');
// const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Unsupported file type'), false);
//     }
// };
// export const upload = multer({storage,fileFilter})
