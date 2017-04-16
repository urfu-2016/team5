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

        delete: url => agent.delete(url),

        signUp: function (account) {
            return this
                .post('/singup')
                .send(account);
        },

        signInAndGetCookies: function (account) {
            return this
                .post('/signin')
                .send(account)
                .then(res => console.log(res.cookies));
        }
    };
};
