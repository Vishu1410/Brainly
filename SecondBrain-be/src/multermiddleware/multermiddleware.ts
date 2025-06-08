import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null,'uploads/')
    },
    filename : (req,file,cb)=>{
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        cb(null,`${file.fieldname}-${uniqueSuffix}${ext}`)
    }
})

// support multiple files under one field
export const uploads = multer({ storage }).single('file'); // max 10 files


// const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'video/mp4', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Unsupported file type'), false);
//     }
// };

// export const upload = multer({storage,fileFilter})