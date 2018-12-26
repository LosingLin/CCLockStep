require('mo');

let tobyloader = {
    load : function(tobyData, callback) {

        // 计算 Total
        let total = 0;   
        total += 2;     // toby和背景 骨骼 
        let sentences = tobyData.sentences;
        for (let i = 0; i < sentences.length; ++ i) {
            let sentence = sentences[i];
            let phrases = sentence.phrases;
            total += phrases.length;      // 短语
        }

        //load
        let curCount = 0;
        let finishLoad = function () {
            curCount ++;
            
            if (curCount >= total) {    // 加载成功之后回调
                callback(tobyData);
            }
        };


        mo.ResourceMgr.loadRes('tobybones/' + tobyData.tobySkeletonName, sp.SkeletonData, function(err, obj) {
            tobyData.tobySkeletonData = obj;
            finishLoad();
        });
        mo.ResourceMgr.loadRes('background/' + tobyData.tobySkeletonName + '-bg', sp.SkeletonData, function(err, obj) {
            tobyData.bgSkeletonData = obj;
            finishLoad();
        });



        for (let i = 0; i < sentences.length; ++ i) {
            let sentence = sentences[i];
            let phrases = sentence.phrases;

            for (let j = 0; j < phrases.length; ++ j) {
                let phrase = phrases[j];

                if (phrase.acUrl == '' || phrase.acUrl === null) {
                    let errorInfo = {};
                    errorInfo.msg = 'phrases.acUrl : ' + phrase.acUrl + ' load error! ' + sentence.length + ' of ' + j;
                    errorInfo.code = ErrorCode.UrlLoadError;
                    window.onerror(errorInfo);
                }
                mo.ResourceMgr.loadRes(phrase.acUrl, function(err, obj) {
                    phrase.acData = obj;
                    finishLoad();
                });
            }
        }

    },
    release : function(tobyData) {
        // mo.ResourceMgr.releaseRes('tobybones/' + tobyData.tobySkeletonName);
        // mo.ResourceMgr.releaseRes('background/' + tobyData.tobySkeletonName + '-bg');
        let sentences = tobyData.sentences;
        for (let i = 0; i < sentences.length; ++ i) {
            let sentence = sentences[i];
            let phrases = sentence.phrases;
            for (let j = 0; j < phrases.length; ++ j) {
                let phrase = phrases[j];
                mo.ResourceMgr.releaseRes(phrase.acUrl);
            }
        }
    }
};

module.exports = tobyloader;