require('mo');
require('app');

let EventMsg = require('EventMsgCfg');

if (!window.g_curTouchId) {
    window.g_curTouchId = null;
}

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
        move_with: false,       //是否跟随移动
        limitInScreen: true,        //跟随移动是否限制在屏幕内
        single_touch: false,
        needScale: false,       //是否需要缩放
        scaleVal: 0.2,          //缩放的值
    },

    // LIFE-CYCLE CALLBACKS:
    ctor () {
        
    },
    onDestroy () {
        
    },

    onLoad () {
        if (!this.orgScaleX && !this.orgScaleY) {
            this.orgScaleX = this.node.scaleX;
            this.orgScaleY = this.node.scaleY;
        }
        // mo.log('-- this.orgScaleX : ', this.orgScaleX);
    },

    start () {

    },

    onEnable () {
        this.addTouchEvent();
    },
    onDisable () {
        this.removeTouchEvent();
    },

    // update (dt) {},

    // TouchEvent
    addTouchEvent () {
        // mo.log("----------- addTouchEvent");
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    },
    removeTouchEvent() {
        // mo.log("----------- removeTouchEvent");
        this.node.off(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
    },

    _packEventData (event) {
        let eventData = {};
        eventData.target = this.node;
        eventData.event = event;
        eventData.isMoved = this.isMoved;
        return eventData;
    },

    touchStart (event) {

        // mo.log('------ event ------', event);
        if (this.single_touch) {
            // 单点触摸
            if (window.g_curTouchId) {
                return;
            }
            window.g_curTouchId = event.touch.__instanceId;
            // mo.log('------ window.g_curTouchId ------', window.g_curTouchId);
        }

        this.isMoved = false;

        let nodeLoc = this.node.convertToNodeSpace(event);
        this.startLoc = nodeLoc;

        if (this.needScale) {
            this.node.scaleX = this.orgScaleX + this.scaleVal;
            this.node.scaleY = this.orgScaleY + this.scaleVal;
        }

        mo.sys.events.dispatch(EventMsg.TouchEventNotify_Start, this._packEventData(event));
    },
    touchMove (event) {

        if (this.single_touch) {
            // 单点触摸
            if (window.g_curTouchId != event.touch.__instanceId) {
                return;
            }
        }

        let nodeLoc = this.node.convertToNodeSpace(event);
        if (Math.abs(nodeLoc.x - this.startLoc.x) >= 10 || Math.abs(nodeLoc.y - this.startLoc.y) >= 10) {
            this.isMoved = true;
        }
        if (this.isMoved) {
            
        }

        if (this.move_with) {
            let loc = event.getLocation();
            let preLoc = event.getPreviousLocation();
            let new_x = this.node.x + loc.x - preLoc.x;
            let new_y = this.node.y + loc.y - preLoc.y;

            if (this.limitInScreen) {
                let worldPos = this.node.parent.convertToWorldSpaceAR(cc.v2(new_x, new_y));
                let visibleSize = mo.utils.UI.getVisibleSize();
                if ( worldPos.x >= 0 && worldPos.x <= visibleSize.width && worldPos.y >=0 && worldPos.y <= visibleSize.height ) {
                    this.node.x = new_x;
                    this.node.y = new_y;
                }
            } else {
                this.node.x = new_x;
                this.node.y = new_y;
            }
            
        }

        mo.sys.events.dispatch(EventMsg.TouchEventNotify_Move, this._packEventData(event));
    },
    touchEnd (event) {
        if (this.single_touch) {
            // 单点触摸
            if (window.g_curTouchId != event.touch.__instanceId) {
                return;
            }
        }

        if (!this.isMoved) {
            
        } else {
            
        }
        mo.sys.events.dispatch(EventMsg.TouchEventNotify_End, this._packEventData(event));
        
        this.isMoved = false;
        window.g_curTouchId = null; 
        
        if (this.needScale) {
            this.node.scaleX = this.orgScaleX;
            this.node.scaleY = this.orgScaleY;
        }
    },
    touchCancel (event) {

        if (this.single_touch) {
            // 单点触摸
            if (window.g_curTouchId != event.touch.__instanceId) {
                return;
            }
        }

        mo.sys.events.dispatch(EventMsg.TouchEventNotify_Cancel, this._packEventData(event));

        this.isMoved = false;
        window.g_curTouchId = null;

        if (this.needScale) {
            this.node.scaleX = this.orgScaleX;
            this.node.scaleY = this.orgScaleY;
        }
    },

});
