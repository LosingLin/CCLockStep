require('mo');
require('app');

let Sentence = require('Sentence');

let TobyData = cc.Class({
    properties: {

    },

    ctor () {
        this.sentences = [];
        this.tobySkeletonName = null;   // toby骨骼文件名称
        this.tobySkeletonData = null;   // toby骨骼数据
        this.bgSkeletonData = null;     // 背景骨骼数据
    },
    clear () {
        for(let i = 0; i < this.sentences.length; ++ i) {
            this.sentences[i].clear();
        }
        this.sentences = null;
        this.tobySkeletonName = null;
        this.tobySkeletonData = null;
        this.bgSkeletonData = null;
    },

    loadData (data) {
        this.sentences = [];

        this.tobySkeletonName = data.animation_background;  
        // this.tobySkeletonName = 's-18';
        if (this.tobySkeletonName == null || this.tobySkeletonName == '') {
            this.tobySkeletonName = 's-2';
        }
        
        // let arr = data;
        // for (let i = 0; i < arr.length; ++ i) {
        //     let sentence = new Sentence();
        //     sentence.loadData(arr[i]);
        //     this.sentences.push(sentence);
        // }
        
        let sentence = new Sentence();
        sentence.loadData(data.toby_corpus);
        this.sentences.push(sentence);
    }
});

module.exports = TobyData;