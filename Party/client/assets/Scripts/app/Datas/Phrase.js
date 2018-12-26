require('mo');
require('app');

let Phrase = cc.Class({
    properties: {

    },
    ctor () {
        this.acUrl = null;
        this.animName = null;
        this.acData = null;
    },
    clear () {
        // this.acUrl = null;
        // this.animName = null;
        // this.acData = null;
    },

    loadData (data) {
        this.acUrl = data.audio;
        this.animName = data.animation_action;
    }
});

module.exports = Phrase;