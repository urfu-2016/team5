const multer = require('multer');

let storage = multer.memoryStorage();
module.exports = {
    upload: multer({
        storage: storage,
        onFileUploadStart(file) {
            if (!['image/jpg', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
                return false;
            }
        }
    })
};
