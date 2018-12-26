require('mo_debug_init');

let Audio = {
    playAudioRepeat (audioclip, times, callback) {
        let time = 0;
        let playAudio = function() {
            let acId = cc.audioEngine.play(audioclip, false, 1);
            mo.log('   ----- acId : ', acId);
            cc.audioEngine.setFinishCallback(acId, function() {
                time ++;
                if (time < times) {
                    playAudio();
                } else {
                    callback();
                }
            });
        }
        if (times > 0) {
            playAudio();
        }
    }    
};

module.exports = Audio;

