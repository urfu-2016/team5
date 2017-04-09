const login = process.env.mongoLogin;
const password = process.env.mongoPass;
const uri = 'ds145359.mlab.com:45359/quests-team5';

module.exports = {
    port: 80,
    mode: 'production',
    mongoUri: `mongodb://${login}:${password}@${uri}`,
    staticPath: '//team5.surge.sh',
    secret: process.env.secret
};
