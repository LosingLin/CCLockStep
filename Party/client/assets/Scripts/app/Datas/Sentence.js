require('mo');
require('app');

let Phrase = require('Phrase');

let Sentence = cc.Class({
    properties: {

    },
    ctor () {
        this.phrases = [];
    },
    clear () {
        for (let i = 0; i < this.phrases.length; ++ i) {
            this.phrases[i].clear();
        }
        this.phrases = null;
    },
    loadData (data) {
        this.phrases = [];

        let arr = data;
        for(let i = 0; i < arr.length; ++ i) {
            let phrase = new Phrase();
            phrase.loadData(arr[i]);
            this.phrases.push(phrase);
        }

    }
});

module.exports = Sentence;