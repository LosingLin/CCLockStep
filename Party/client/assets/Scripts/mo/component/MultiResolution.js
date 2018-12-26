require('mo');

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
        mo.log('MultiResolution-------onLoad');
        this.reDesignResolution();

        // let delay = cc.delayTime(1);
        // let callFunc = cc.callFunc(function() {
        //     console.log('MultiResolution-------onLoad2');
        //     this.reDesignResolution();
        // }, this);
        // this.node.runAction(cc.sequence(delay, callFunc));
    },

    reDesignResolution () {
        
        let canvas = cc.Canvas.instance;
        canvas.designResolution = cc.size(1280, 720);
        // canvas.designResolution = cc.size(1280, 640);

        mo.log('designResolution -- ', canvas.designResolution);
        mo.log('frameSize -- ', cc.view.getFrameSize());
        // mo.log('visibleSize -- ', cc.view.getVisibleSize());
        // mo.log('visibleSizeInPixel -- ', cc.view.getVisibleSizeInPixel());
        // mo.log('getDesignResolutionSize -- ', cc.view.getDesignResolutionSize());
        
        let frameSize = cc.view.getFrameSize();
        let device = frameSize.width / frameSize.height; 
        
        let design = 1280 / 720;
        // let design = 1280 / 640;
        if (device >= design) {
            canvas.fitWidth = false;
            canvas.fitHeight = true;
            mo.log("------ fixHeight");
        } else {
            canvas.fitWidth = true;
            canvas.fitHeight = false;
            mo.log("------ fixWidth");
        }
        //设计分辨率 : 1280 x 720
        //适配从ipad --> iphonex 分辨率区间的设备
        //ipad : 1024 x 768         fixWidth    --> 1280 x 960
        //iphonex : 960 x 375     fixHeight   --> 1843.2 x 720 
        //背景图大小 : 1844 x 960

        //FPS显示
        if (mo.run_mod == mo.const.run_mod.debug) {
            cc.director.setDisplayStats(true);
        } else {
            cc.director.setDisplayStats(false);
        }
    },

    start () {
        
    },

    // update (dt) {},
});
