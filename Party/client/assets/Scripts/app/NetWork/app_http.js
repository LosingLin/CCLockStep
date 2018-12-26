require('mo');

let app_http = {
    head : 'http://',
    ip : '192.168.8.103',
    port : ':8080/',
    _packHandlers : function(handlers) {
        if (handlers) {
            if (!handlers.onReqStart) {

            }
            if (!handlers.onReqEnd) {

            }
            if (!handlers.onReqSuccess) {
                handlers.onReqSuccess = function(ret) {
                    let isSuccess = ret.code == 0 ? true : false;
                    if (isSuccess) {
                        if (handlers.onSuccess) {
                            handlers.onSuccess(ret.data);
                        }
                    } else {
                        if (handlers.onFail) {
                            handlers.onFail();
                        }
                    }
                    
                }
            }
            if (!handlers.onReqError) {

            }
        }
        return handlers;
    },
    _httpRequest : function(path, data, handlers) {
        handlers = this._packHandlers(handlers);
        mo.network.Http.sendRequest(this.head + this.ip + this.port + path, data, handlers);
    },

    //用户登录
    userLogin : function(data, handlers) {
        let path = 'login';
        this._httpRequest(path, data, handlers);
    },
    
};

module.exports = app_http;