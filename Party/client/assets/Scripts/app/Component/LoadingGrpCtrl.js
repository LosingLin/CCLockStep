require('mo');
require('app');


cc.Class({
    extends: cc.Component,

    properties: {
        magicBox: {
            default: null,
            type: cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.magicBox.stopAllActions();
        let rotate = cc.rotateBy(0.4, 200);
        this.magicBox.runAction(cc.repeatForever(rotate));
    },

    start () {
        
    },

    // update (dt) {},


});
