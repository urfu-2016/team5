module.exports = {
    getMongoRegExp(searchString) {
        return {$regex: searchString, $options: 'i'};
    },

    getCanApply(property) {
        return key => {
            if (key === property) {
                return true;
            }

            return false;
        };
    }
};
