require('mo');
let NetMsg = require('app_const_NetMsg');
let EventMsg = require('app_const_EventMsg');

let self = null;
let app_socketio = {
    socket_head : 'ws://',
    socket_ip : '127.0.0.1',
    socket_port : ':3124/',

    self : null,
    //建立长链接
    connect : function() {
        self = this;
        let socket = mo.network.SocketIO;
        this.addListener(NetMsg.Connect, this.onConnect, this);
        this.addListener(NetMsg.ConnectFailed, this.onConnectFailed, this);
        this.addListener(NetMsg.Disconnect, this.onDisconnect, this);
        this.addListener(NetMsg.Reconnect, this.onReconnect, this);
        this.addListener('say', this.onSay, this);
        // this.listen('say', function(data) {
        //     mo.log('==== say');
        //     self.send('say', {li: 'hello'});
        //     self.removeListener('say');
        // })
        socket.connect(this.socket_head + this.socket_ip + this.socket_port);
    },
    addListener : function(event, handler, target) {
        //TODO: common handler
        mo.network.SocketIO.addListener(event, handler, target);
    },
    removeListener : function(event, target) {
        mo.network.SocketIO.removeListener(event, target);
    },
    onceListen : function(event, handler, target) {
        mo.network.SocketIO.addOnceListener(event, handler, target);
    },
    send : function(event, data) {
        // mo.log('SOCKETIO SEND : [' + event + ']', data);
        //TODO: common handler data ?
        mo.network.SocketIO.send(event, data);
    },
    printHandlers : function() {
        mo.network.SocketIO.printHandlers();
    },

    onConnect : function(data) {
        mo.log('---- onConnect', data);
        // mo.log('-------this ', this);
        mo.network.SocketIO.isConnecting = true;
        // mo.network.SocketIO.close();
        mo.sys.events.dispatch(EventMsg.SocketConnected, data);
    },
    onConnectFailed : function(data) {
        mo.log('---- onConnectFailed', data);
        mo.network.SocketIO.isConnecting = false;
    },
    onDisconnect : function(data) {
        mo.log('---- onDisconnect', data);
        mo.network.SocketIO.close();
        mo.network.SocketIO.isConnecting = false;
    },
    onReconnect : function(data) {
        mo.log('---- onReconnect', data);
        mo.network.SocketIO.isConnecting = true;
    },

    //test
    onSay : function(data) {
        mo.log('------ say ', data);
        //this.send('say', {li: 'hello'});
        //this.removeListener('say');
    },
};

module.exports = app_socketio;