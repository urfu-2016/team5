/* eslint camelcase: ["error", {properties: "never"}] */

const cloudinary = require('cloudinary');
const config = require('config');
const Datauri = require('datauri');

cloudinary.config({
    cloud_name: config.cloudinary.name,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret
});

module.exports = {
    upload(file) {
        const dataUri = new Datauri();
        dataUri.format(file.originalname, file.buffer);

        return cloudinary.uploader.upload(dataUri.content);
    },

    remove(id) {
        return cloudinary.uploader.destroy(id);
    }
};
