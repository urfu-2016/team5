class Emitter {
    constructor() {
        this.events = {};
    }

    on(name, func) {
        this.events[name] = func;
    }

    off(name) {
        delete this.events[name];
    }

    emit(name) {
        setTimeout(this.events[name], 0);
    }
}

module.exports = new Emitter();
