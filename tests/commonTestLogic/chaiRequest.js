const chai = require('chai');
const chaiHttp = require('chai-http');
const User = require('../../models/user');
const fs = require('fs');

chai.should();
chai.use(chaiHttp);

module.exports = function (server) {
    const agent = chai.request.agent(server);

    return {
        get: url => agent.get(url),

        post: (url, data) => agent.post(url).send(data),

        put: (url, data) => agent.put(url).send(data),

        delete: url => agent.delete(url),

        sendFormData(url, data, file) {
            return agent.post(url)
                .set('content-type', 'multipart/form-data')
                .field('title', data.title)
                .field('description', data.description)
                .field('location', data.location)
                .attach('image', fs.readFileSync(file), file);
        },

        putFormData(url, data, file) {
            return agent.put(url)
                .set('content-type', 'multipart/form-data')
                .field('title', data.title)
                .field('description', data.description)
                .field('location', data.location)
                .attach('image', fs.readFileSync(file), file);
        },

        signInUser: user => agent.post('/signin').send(user),

        createUserAndSignIn: async user => {
            await User.create(user);

            return await agent.post('/signin').send(user);
        },

        logout: async () => await agent.post('/logout')
    };
};
