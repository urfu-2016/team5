const chai = require('chai');
const chaiHttp = require('chai-http');

chai.should();
chai.use(chaiHttp);

module.exports = function (server) {
    const agent = chai.request.agent(server);

    return {
        get: url => {
            return agent
                .get(url);
        },

        post: (url, data) => {
            return agent
                .post(url)
                .send(data);
        },

        put: (url, data) => {
            return agent
                .put(url)
                .send(data);
        },

        delete: url => {
            return agent
                .delete(url);
        }
    };
};
