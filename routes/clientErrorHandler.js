module.exports = function (err, req, res, next) {
    /* eslint no-unused-vars: "off" */

    res.status(err.status).send(err.message);
};
