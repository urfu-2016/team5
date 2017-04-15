const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

module.exports = function (server) {
    const agent = chai.request.agent(server);

    return {
        get: url => agent.get(url),

        post: (url, data) => agent.post(url).send(data),

        put: (url, data) => agent.put(url).send(data),

        delete: url => agent.delete(url)
    };
};
