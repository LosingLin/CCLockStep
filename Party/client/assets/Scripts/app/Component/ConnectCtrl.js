require('mo');
require('app');

let EventMsg = require('app_const_EventMsg');

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
        ServerAddressEB: {
            default: null,
            type: cc.EditBox
        },
        NameEB: {
            default: null,
            type: cc.EditBox
        },
        ConnectLayer: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onEnable () {
         mo.sys.events.addEventListener(EventMsg.SocketConnected, this.onConnect, this);
    },
    onDisable () {
        mo.sys.events.removeEventListener(EventMsg.SocketConnected, this);
    },

    // update (dt) {},

    connect () {
        mo.log('---connecting...');
        let ip = this.ServerAddressEB.string;
        let name = this.NameEB.string;
        if (name === '') {
            return;
        }
        app.network.socketio.socket_head = 'http://';
        app.network.socketio.socket_ip = ip;
        app.network.socketio.connect();
        mo.log('---connecting...');
    },
    
    onConnect (data) {
        mo.log('连接成功 ： ', data);
        this.ConnectLayer.active = false;

        let name = this.NameEB.string;
        let mWidth = 2000;
        let mHeight = 2000;
        app.network.socketio.send('joinGame', {playerName: name, mapWidth: mWidth, mapHeight: mHeight});

        app.DataMgr.playerName = name;
    },
    onConnectFailed () {

    },
    onDisconnect () {

    },
    onReconnect () {

    }

});
