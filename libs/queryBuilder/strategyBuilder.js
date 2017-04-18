module.exports = {
    getMongoRegExp: searchString => ({$regex: searchString, $options: 'i'})
};
