require('mo');
require('app');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        let canvas = cc.Canvas.instance;
        let designResolution = canvas.designResolution;

        let visibleSize = mo.utils.UI.getVisibleSize();
        mo.log('-------- visibleSize : ', visibleSize);
        let frameSize = cc.view.getFrameSize();
        mo.log('-------- frameSize : ', frameSize);
        let safeArea = app.native.msg.getSafeArea();
        mo.log('-------- safeArea : ', safeArea);

        if (canvas.fitHeight) {
            this.node.width = visibleSize.width * safeArea.width / frameSize.width;
        } else if (canvas.fitWidth) {
            this.node.height = visibleSize.height * safeArea.height / frameSize.height;
        }
    },

    start () {

    },

    // update (dt) {},
});
