module.exports = {
    defaultState: {
        active: false,
        dispatchFailed: false,
        noConnection: false
    },
    noConnectionState: {
        active: false,
        dispatchFailed: true,
        noConnection: true
    },
    failedState: {
        active: false,
        dispatchFailed: true,
        noConnection: false
    },
    actionState: {
        active: true,
        dispatchFailed: false,
        noConnection: false
    }
};
