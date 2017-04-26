const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../../models/user');

chai.should();
chai.use(chaiHttp);

module.exports = function (server) {
    const agent = chai.request.agent(server);

    return {
        get: url => agent.get(url),

        post: (url, data) => agent.post(url).send(data),

        put: (url, data) => agent.put(url).send(data),

        delete: url => agent.delete(url),

        signInUser: user => agent.post('/signin').send(user),

        createUserAndSignIn: async user => {
            await User.create(user);

            return await agent.post('/signin').send(user);
        },

        logout: async () => await agent.post('/logout')
    };
};
