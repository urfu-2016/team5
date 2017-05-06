const cities = require('./cities.json');

module.exports = {
    async getCities(req, res) {
        res.send(cities);
    }
};
