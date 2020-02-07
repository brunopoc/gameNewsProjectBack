var multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./files");
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${+new Date()}.jpg`);
    }
});

exports.upload = multer({
    storage
});