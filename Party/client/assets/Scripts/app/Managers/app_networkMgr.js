require('mo');

let ErrorCode = require('ErrorCode');

let NetworkMgr = {
    getTobyHost : function() {
        let host = '';
        if (mo.const.server.online === mo.server) {
            host = 'https://aiclasssvr.abctime-me.com';
        } else if (mo.const.server.test === mo.server) {
            host = 'https://test-aiclasssvr.abctime-me.com';
        } else if (mo.const.server.build === mo.server) {
            host = 'https://daily-aiclasssvr.abctime-me.com';
        } else {
            mo.error('mo.server is error!');
        }
        return host;
    },
    
    // 请求回调
    _httpReqStart : function() {

    },
    _httpReqEnd : function() {
        
    },
    _httpReqError : function(e, requesetData) {
        mo.log('_httpReqError ----- requestData: ', requesetData);
        // mo.log('_httpReqError ----- e: ', e);
        let errorInfo = {};
        errorInfo.msg = 'onReqError : ' + JSON.stringify(e, ["message", "arguments", "type", "name"]) + ' url : ' + requesetData.url;
        errorInfo.code = ErrorCode.HttpError;
        window.onerror(errorInfo);
    },
    _httpReqTimeout : function(e, requesetData) {
        mo.log('_httpReqTimeout ----- requestData: ', requesetData);
        // let errorInfo = {};
        // errorInfo.msg = '请求超时 : ' + requesetData.url;
        // errorInfo.code = ErrorCode.HttpTimeout;
        // window.onerror(errorInfo);
        // 重新发起请求 
        // app.NetWorkMgr.reRequest(requestData);
    },
    _httpReqSuccess : function(data, requesetData) {

    },

    // 包装handlers
    packHandlers : function(handlers) {
        let self = this;
        let sp_onReqStart = handlers.onReqStart;
        handlers.onReqStart = function() {
            self._httpReqStart();
            if (sp_onReqStart) {
                sp_onReqStart();
            }
        }
        let sp_onReqEnd = handlers.onReqEnd;
        handlers.onReqEnd = function() {
            self._httpReqEnd();
            if (sp_onReqEnd) {
                sp_onReqEnd();
            }
        }

        let sp_onReqError = handlers.onReqError;
        handlers.onReqError = function(e, requesetData) {
            self._httpReqError(e, requesetData);
            if (sp_onReqError) {
                sp_onReqError(e, requesetData);
            }
        }

        let sp_onReqTimeout = handlers.onReqTimeout;
        handlers.onReqTimeout = function(e, requesetData) {
            self._httpReqTimeout(e, requesetData);
            if (sp_onReqTimeout) {
                sp_onReqTimeout(e, requesetData);
            }
        }

        let sp_onReqSuccess = handlers.onReqSuccess;
        handlers.onReqSuccess = function(data, requesetData) {
            self._httpReqSuccess(data, requesetData);
            if (sp_onReqSuccess) {
                sp_onReqSuccess(data, requesetData);
            }
        }

        return handlers;
    },

    // 重试
    reRequest : function(requestData) {
        mo.network.Http.sendRequest(requestData.url,
                                    requestData.data,
                                    requestData.handlers,
                                    requestData.method,
                                    requestData.headData);
    },

    // 请求TobyAIData
    _requestTobyData : function(inf, handlers) {
        // mo.network.Http
        let host = this.getTobyHost();

        let _handlers = this.packHandlers(handlers);

        let userInfo = app.DataMgr.getUserInfo();
        let timezoneOffset = new Date().getTimezoneOffset();

        let uid = userInfo.uid;
        let token = userInfo.token;

        let data = {};
        data.uid = uid;
        data.timezone_offset = timezoneOffset;
        
        let headData = {};
        headData.UID = uid;
        headData.Authorization = token;

        mo.network.Http.sendRequest(host + inf, data, _handlers, 'GET', headData);
    },
    requestTobyAIData : function(handlers) {               //首次进入的数据
        let inf = '/v1/h5/corpus/toby';
        this._requestTobyData(inf, handlers);
    },
    requestTobyChatData : function(handlers) {              //寒暄的数据
        let inf = '/v1/h5/corpus/toby/chat';
        this._requestTobyData(inf, handlers);
    }
}

module.exports = NetworkMgr;