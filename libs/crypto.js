
const crypto = require('crypto');

const algorithm = 'sha512';
const iterations = 100;
const keylen = 70;

async function hash(data, salt) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(data, salt, iterations, keylen, algorithm, (err, key) => {
            if (err) {
                reject(err);
            }

            resolve(key.toString('hex'));
        });
    });
}

async function genHexSalt() {
    const saltLength = Math.floor(Math.random() * 100) + 16;

    return (await crypto.randomBytes(saltLength)).toString('hex');
}

async function compare(data, hashedData, salt) {
    const hashFromData = await hash(data, salt);

    return hashFromData === hashedData;
}

module.exports = {
    hash,
    compare,
    genHexSalt
};
