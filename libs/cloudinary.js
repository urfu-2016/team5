/* eslint camelcase: ["error", {properties: "never"}] */

const cloudinary = require('cloudinary');
const config = require('config');
cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
});

module.exports = {
    upload(file) {
        return cloudinary.uploader.upload(file.path);
    },

    remove(id) {
        return cloudinary.uploader.destroy(id);
    }
};
