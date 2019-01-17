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
        this.name = name;
        this.labName.string = name;
    },
    getName () {
        return this.name;
    },

    setDirection (dir) {
        this.direction = dir;
    },
    getDirection () {
        return this.direction;
    }
});
