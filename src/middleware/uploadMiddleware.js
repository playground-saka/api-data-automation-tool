import multer from 'multer';

// config Multer
const upload = multer({ dest: 'src/uploads/' });

// Middleware upload file
export const uploadMiddleware = upload.single('file');