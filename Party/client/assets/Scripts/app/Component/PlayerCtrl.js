require('mo');
require('app');


cc.Class({
    extends: cc.Component,

    properties: {
        labName: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},

    setName (name) {
        this.labName.string = name;
    }
});
