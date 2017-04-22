module.exports = {
    formatDateToDDMMYY(date) {
        const day = `0${date.getDate()}`.slice(-2);
        const month = `0${(date.getMonth() + 1)}`.slice(-2);
        const year = `0${date.getFullYear()}`.slice(-2);

        return `${day}.${month}.${year}`;
    }
};
