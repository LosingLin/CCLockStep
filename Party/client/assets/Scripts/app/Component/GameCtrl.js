require('mo');
require('app');


cc.Class({
    extends: cc.Component,

    properties: {
        gameMap: {
            default: null,
            type: cc.Node
        },
        playerPb: {
            default: null,
            type: cc.Prefab
        }
    },

    // LIFE-CYCLE CALLBACKS:
    ctor () {
        this.player = null;
        this.players = {};
    },
    onDestroy () {
        this.player = null;
        this.players = null;
    },

    // onLoad () {},

    start () {

    },

    onEnable () {
        app.network.socketio.addListener('playerJoin', this.playerJoin, this);
        app.network.socketio.addListener('startGame', this.startGame, this);
    },
    onDisable () {
        app.network.socketio.removeListener('playerJoin', this);
        app.network.socketio.removeListener('startGame', this);
    },

    // update (dt) {},

    playerJoin (data) {
        mo.log('---- playerJoin : ', data);
        let playerName = data.playerName;
        let player = cc.instantiate(this.playerPb);
        // player.x = data.posX;
        // player.y = data.posY;
        player.x = 0;
        player.y = 0;
        player.getComponent('PlayerCtrl').setName(playerName);
        this.gameMap.addChild(player);
        
        if (playerName === app.DataMgr.playerName) {
            this.player = player;
        }
        this.players[playerName] = player;
    },
    startGame (data) {
        
    }
});
