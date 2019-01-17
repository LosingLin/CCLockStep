require('mo');
require('app');

let EventMsg = require('app_const_NetMsg');

// 状态
let STATUS = {
    WAIT: 1,
    START: 2
}

// 方向
let DIRECTION = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
}

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
        },
        infoLab: {
            default: null,
            type: cc.Label
        }
    },

    // LIFE-CYCLE CALLBACKS:
    ctor () {
        this.player = null;
        this.players = {};

        this.b_isConnect = false;
        this.gameStatus = STATUS.WAIT;

        this.stepInterval = 0;
        this.stepUpdateCounter = 0;

        this.stepTime = 0;
        this.recvCommands = [];
        this.runningCommands = null;

        // 对时
        this.avgDelay = 0;
        this.avgDelayCount = 0;
        this.avgDelayMax = 20;
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
        
        app.network.socketio.addListener(EventMsg.TimeSync, this.onTimeSync, this);
        app.network.socketio.addListener(EventMsg.StartGame, this.onStartGame, this);
        app.network.socketio.addListener(EventMsg.Message, this.onMessage, this);
        app.network.socketio.addListener(EventMsg.System, this.onSystem, this);
    },
    onDisable () {
        app.network.socketio.removeListener('playerJoin', this);

        app.network.socketio.removeListener(EventMsg.TimeSync, this);
        app.network.socketio.removeListener(EventMsg.StartGame, this);
        app.network.socketio.removeListener(EventMsg.Message, this);
        app.network.socketio.removeListener(EventMsg.System, this);
    },

    // update (dt) {},

    playerJoin (data) {
        mo.log('---- playerJoin : ', data);

        // let playerName = data.playerName;
        // let player = cc.instantiate(this.playerPb);
        // // player.x = data.posX;
        // // player.y = data.posY;
        // player.x = 0;
        // player.y = 0;
        // player.getComponent('PlayerCtrl').setName(playerName);
        // this.gameMap.addChild(player);
        
        // if (playerName === app.DataMgr.playerName) {
        //     this.player = player;
        // }
        // this.players[playerName] = player;
    },

    onTimeSync (data) {
        // mo.log('------------- onTimeSync : ', data);
        let clientTime = data.client;
        let serverTime = data.server;

        let delay = Date.now() - clientTime;
        
        this.avgDelay += delay;
        this.avgDelayCount ++;

        if (this.avgDelayCount === this.avgDelayMax) {
            this.infoLab.string = this.avgDelay / this.avgDelayMax + 'ms';

            this.avgDelay = 0;
            this.avgDelayCount = 0;
        }
    },

    onStartGame (data) {
        mo.log('--------- onStartGame : ', data);
        this.b_isConnect = true;
        
        this.gameStatus = STATUS.START;
        
        this.stepInterval = data.stepInterval;
        this.players = {};
        for (let i = 0; i < data.player.length; ++ i) {
            let playerName = data.player[i];
            let player = cc.instantiate(this.playerPb);
            player.getComponent('PlayerCtrl').setName(playerName);
            this.gameMap.addChild(player);
            this.players[playerName] = player;
        }
    },

    onMessage (data) {
        // mo.log('--------- onMessage : ', data);

        for (let i = 0; i < data.length; ++ i) {
            let command = data[i];
            this.recvCommands.push(command);
            this.stepTime = command[command.length - 1].step;

            // mo.log('------ recv stepTime : ' + this.stepTime);
        }
    },

    onSystem (data) {
        mo.log('-------- onSystem : ', data)
    },

    stepUpdate () {

    },

    update (dt) {

        // mo.log('--------update : ', dt);
        if (this.gameStatus === STATUS.START) {
            this.stepUpdateCounter += dt;

            if (this.stepUpdateCounter >= this.stepInterval) {
                this.stepUpdate();
                this.stepUpdateCounter -= this.stepInterval;
            }

            let scale = Math.ceil(this.recvCommands.length / 3)
			if(scale > 10) scale = 10
            this.isFastRunning = (scale > 1)
            
            // mo.log('-------------------- this.recvCommands.length : ', this.recvCommands.length);
            if (this.recvCommands.length > 0) {
                let ms = dt * scale;
                // let ms = dt;
                
                if (this.runningCommands == null) {
                    this.runningCommands = this.recvCommands[0];
                    this.runningCommands.ms = this.stepInterval / 1000;
                }
                // mo.log('--------- this.runningCommands.ms : ', this.runningCommands.ms);
                // mo.log('-------------------- ms : ', ms);

                if (this.runningCommands.ms < ms) {
                    ms = this.runningCommands.ms;
                }
                
                for (let i = 0; i <this.runningCommands.length; ++ i) {
                    let command = this.runningCommands[i];
                    let commandData = command.data;
                    if (commandData) {
                        // mo.log('-------------command : ', commandData);
                        let msg = commandData.msg;
                        if (msg === 'orgPos') {
                            this.players[command.id].x = commandData.x;
                            this.players[command.id].y = commandData.y;
                        } else if (msg === 'move') {
                            let dir = commandData.dir;
                            let playerCtrl = this.players[command.id].getComponent('PlayerCtrl');
                            playerCtrl.setDirection(dir);
                            // this.movePlayer(this.players[command.id], ms);
                        }
                    }
                }

                for (let key in this.players) {
                    this.movePlayer(this.players[key], ms);
                }

                this.runningCommands.ms = this.runningCommands.ms - ms;
                if (this.runningCommands.ms === 0) {
                    this.recvCommands.shift();
                    this.runningCommands = null;

                    // mo.log('----- reciveCommands')
                }
            }

        }

        if (this.b_isConnect) {

            let now = Date.now();
            app.network.socketio.send('timeSync', now);
        }
    },

    movePlayer (player, dt) {


        let playerCtrl = player.getComponent('PlayerCtrl');
        let speed = 200;
        let dis = speed * dt;

        let x = player.x;
        let y = player.y;

        // mo.log('----- movePlayer : ', dis);

        switch(playerCtrl.getDirection()) {
            case DIRECTION.UP: {
                y += dis;
                break;
            }
            case DIRECTION.DOWN: {
                y -= dis;
                break;
            }
            case DIRECTION.LEFT: {
                x -= dis;
                break;
            }
            case DIRECTION.RIGHT: {
                x += dis;
                break;
            }
        }
        let mapWidthSep = app.DataMgr.mapWidth * 0.5;
        let mapHeightSep = app.DataMgr.mapHeight * 0.5;
        if (x >= -mapWidthSep && x <= mapHeightSep) {
            player.x = x;
        }
        if (y >= -mapHeightSep && y <= mapHeightSep) {
            player.y = y;
        }
    },
    
    moveBtnCallback (target, direction) {
        // if (this.isFastRunning) {
        //     return;
        // }
        mo.log('---------------- moveBtnCallback ', direction);

        direction = parseInt(direction);

        // let delayTime = cc.delayTime(0.04);
        // let callFunc = cc.callFunc(function() {
        //     let playerCtrl = this.players[app.DataMgr.playerName].getComponent('PlayerCtrl');
        //     playerCtrl.setDirection(direction);
        // }, this);
        // this.node.runAction(cc.sequence(delayTime, callFunc));

        let command = {};
        command.id = app.DataMgr.playerName;
        let cdata = {};
        cdata.msg = 'move';
        cdata.dir = direction;
        command.data = cdata;
        command.step = this.stepTime;

        app.network.socketio.send('message', command);
    }
});
