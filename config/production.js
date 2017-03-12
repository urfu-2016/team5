module.exports = {
    port: 80,
    mode: 'production',
    mongoUri : 'mongodb://' + process.env.mongoLogin + ':' +
        process.env.mongoPass + '@ds145359.mlab.com:45359/quests-team5'
};
