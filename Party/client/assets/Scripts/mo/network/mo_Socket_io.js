"use strict";
require('mo_debug_init');

// if (window.io == null) {
//     mo.log('window.io ==== ', window.io);
//     window.io = require("socket.io");
// }

if (cc.sys.isNative) {
    window.io = SocketIO;
}

let MoSocket = {
    io : null,
    isConnecting : false,
    handlers : {}, 
    onceHandlers : {},
    b_isOnceAval : true,         //是否支持 once
    b_isOnMulti : true,          //on是否可以多次监听相同的事件
    _reHandler : function(handler, target, event) {
        return function(data) {
            // mo.log(event + '-------- data : ', data)
            if (event != 'disconnect') {
                if (data == null) {
                    data = {};
                    data.com = true;
                } else {
                    // if (typeof(data) == 'string') {
                    //     let old = data;
                    //     data = {};
                    //     data.com = true;
                    //     data.data = JSON.parse(old);
                    // }

                    // mo.log(event + ' handler data str -----', data);
                    // data = JSON.parse(data);

                    // data = mo.utils.Object.clone(data);
                    // data.com = true;

                    // let temp = {}
                    // temp = mo.utils.Object.obj_clone(data);
                    // temp.com = true;
                    // data = temp;

                    // var temp = {};
                    // for(var k in data) {
                    //     temp[k] = data[k];
                    // }
                    // data = temp;
                    // data.com = true;

                    // Object.defineProperty(data, 'com', {value:true, writable:true});
                    // let newData = JSON.parse(data);
                }
            }
            // mo.log(event + ' handler data -----', data);
            // for (var k in data) {
            //     mo.log(k + ' : ' + data[k]);
            // }
            if (target) {
                handler.call(target, data);
            } else {
                handler(data);
            }
        };
    },
    addOnceListener : function(event, handler, target) {
        if (this.b_isOnceAval) {
            let reHandler = this._reHandler(handler, target, event);

            if (this.io) {
                this.io.once(event, reHandler);
            } else {
                if (this.onceHandlers[event] == null) {
                    this.onceHandlers[event] = new Array();
                }
                let item = {};
                item.target = target;
                item.handler = reHandler;
                this.onceHandlers[event].push(item);
            }
        } else {
            mo.warn('io once is not support!');
        }
    },  
    addListener : function(event, handler, target) {
        //mo.assert(target != null, 'target can not be null');

        if (this.b_isOnMulti) {
            if (this.handlers[event] == null) {
                this.handlers[event] = new Array();
            }
            let reHandler = this._reHandler(handler, target, event);
    
            let item = {};
            item.target = target;
            item.handler = reHandler;
            this.handlers[event].push(item);
    
            if (this.io) {
                this.io.on(event, reHandler);
            }
        } else {
            if (this.handlers[event] != null) {
                mo.warn('event : ' + event + ' has be added.');
                return;
            }
            mo.log('-- addListener : ' + event);
            let reHandler = this._reHandler(handler, target, event);
            this.handlers[event] = reHandler;
            if (this.io) {
                this.io.on(event, reHandler);
            }
        }
        
    },
    removeListener : function(event, target) {
        if (this.handlers[event] == null) {
            mo.warn('there is no listenr at event : ' + event);
            return;
        }
        if (this.b_isOnMulti) {
            let newArr = new Array();
            let offArr = new Array();
            this.handlers[event].forEach(element => {
                if (element.target == target) {
                    offArr.push(element);
                } else {
                    newArr.push(element);
                }
            });
            this.handlers[event] = newArr;     //重新赋值
            if (newArr.length == 0) {
                this.handlers[event] = null;
            }
            //取消监听
            if (this.io) {
                offArr.forEach(element=>{
                    this.io.off(event, element.handler);
                });
            }
        } else {
            if (this.io.off) {
                this.io.off(event, this.handlers[event]);
            } else {
                this.io.on(event, function(){ mo.log( event + '*****EMPTY*****');});
            }
            this.handlers[event] = null;
        }
    },
    // 建立长链接
    connect : function(ip) {
        let opts = {
            'reconnection' : false,
            'force new connection' : true,
            'transports' : ['websocket', 'polling'],
        };
        this.io = window.io.connect(ip, opts);

        // let self = this;
        // this.io.on('reconnect', function(){
        //     mo.log('----reconnect');
        // });
        // this.io.on('connect', function(data){
        //     mo.log('----connect', data);
        //     self.isConnecting = true;
        // });
        // this.io.on('disconnect', function(data){
        //     mo.log('----disconnect', data);
        //     self.isConnecting = false;
        // });
        // this.io.on('connect_failed', function(data){
        //     mo.log('----connect_failed', data);
        //     self.isConnecting = false;
        // });

        // 处理this.io未初始化时的监听
        if (this.b_isOnMulti) {
            for (let key in this.handlers) {
                var value = this.handlers[key];
                value.forEach(element => {
                    this.io.on(key, element.handler);
                });
            }
        } else {
            for (let key in this.handlers) {
                var value = this.handlers[key];
                this.io.on(key, value);
            }
        }
        
        for (let key in this.onceHandlers) {
            var value = this.onceHandlers[key];
            value.forEach(element => {
                this.io.once(key, element.handler);
            });
        }
        this.onceHandlers = {};
    },
    send : function(event, data) {
        mo.assert(this.io != null, 'connect is not init');
        // TODO: common handler data?
        if (this.isConnecting) {
            this.io.emit(event, data);
        } else {
            mo.warn('socket is not connect, event : "' + event + '" send failed! ');
        }
    },
    close : function() {
        if (this.io) {
            if (this.isConnecting) {
                this.io.disconnect();
                this.isConnecting = false;
            }
            this.io = null;
        }
    },
    printHandlers : function() {
        mo.log('Socket IO Handlers :', this.handlers);
        mo.log('Socket IO onceHandlers :', this.onceHandlers);
    },
};

MoSocket.b_isOnceAval = false;
MoSocket.b_isOnMulti = false;

module.exports = MoSocket;