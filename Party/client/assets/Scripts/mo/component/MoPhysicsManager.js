require('mo')

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

    ctor () {

    },

    onDestory () {

    },

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
                                                        cc.PhysicsManager.DrawBits.e_pairBit |
                                                        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
                                                        cc.PhysicsManager.DrawBits.e_jointBit |
                                                        cc.PhysicsManager.DrawBits.e_shapeBit;
       
        // cc.director.getPhysicsManager().debugDrawFlags = 0;

        mo.log('cc.PhysicsManager.PTM_RATIO = ', cc.PhysicsManager.PTM_RATIO);
        // mo.log("UserAgent: ", navigator.userAgent);
    },

    start () {

    },

    onEnable () {
        
    },
    onDisable () {
        cc.director.getPhysicsManager().enabled = false;
    },

    // update (dt) {},
});
