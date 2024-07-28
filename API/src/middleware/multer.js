import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
// const upload = multer({ dest: 'images/' });

// const __dirname = path.resolve();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        let dir;
        debugger
        // if (req.baseUrl === '/api/posts') dir = path.join(__dirname, `../images/${req?.body?.userId || req?.params?.id}`);
        if (req.baseUrl === '/api/posts') dir = path.join(__dirname, `../images/${file.originalname}`);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }
        // callback(null, path.join(__dirname, '../images/task'));
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        debugger
        callback(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        debugger
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "application/pdf") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

export default upload;