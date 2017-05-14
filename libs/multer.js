const multer = require('multer');

module.exports = {
    upload: multer({
        dest: '../uploads/',
        onFileUploadStart(file) {
            if (!['image/jpg', 'image/png', 'image/jpeg'].includes(file.mimetype)) {
                return false;
            }
        },
        inMemory: true
    })
};
