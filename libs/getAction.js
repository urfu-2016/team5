module.exports = (controller, methodName) => {
    return (req, res, next) => {
        Promise.resolve(controller[methodName](req, res, next)).catch(next);
    };
};
