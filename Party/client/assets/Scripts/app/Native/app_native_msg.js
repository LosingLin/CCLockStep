require ('mo');

let NativeMsg = {
    // 通知原生加载完成
    gameHasLoaded: function() {
        let json = app.external.dsBridge.call('toby.loadFinished', '');
        mo.log('-- gameHasLoaded : ', json);
    },

    // 上报错误
    reportError: function(errorInfo) {
        mo.log('-------- toby.tobyError : ', errorInfo);
        app.external.dsBridge.call('toby.tobyError', errorInfo);
    },

    // 初始化用户信息
    initUserInfo: function() {
        let json = app.external.dsBridge.call('toby.getUserInfo');
        if (json) {
            let jsonData = JSON.parse(json);
            mo.log('userInfo : ', jsonData);
            app.DataMgr.setUserInfo(jsonData);
        } else {
            let jsonData = {
                uid: 595072737,
                token: 'a3e45bbb0cb242a144a96ec4d4d7dc8c',
                env: 1
            }
            app.DataMgr.setUserInfo(jsonData);
        }
    },

    // token不合法
    tokenIllegal: function(data) {
        mo.log('---------- toby.tokenIllegal : ', data);
        app.external.dsBridge.call('toby.tokenIllegal', data);
    },

    // 获取安全区域
    getSafeArea: function() {
        let u = navigator.userAgent;
        let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if (isIOS) {
            if (screen.height == 812 && screen.width == 375) { // iphoneX
                return cc.size(774, 375);
            }
        }
        mo.log('navigator.userAgent --- ', navigator.userAgent);
        mo.log('screen.height --- ', screen.height);
        mo.log('cc.view.getFrameSize() --- ', cc.view.getFrameSize());
        // let json = app.external.dsBridge.call('ips.getSafeArea');
        // mo.log('-- getSafeArea : ', json);
        // if (json) {
        //     return cc.size(900, 375);
        // } else {
            return cc.view.getFrameSize();
        // }
    },

    // 注册用户信息的回调
    registerUpdateUserInfo: function(handler, target) {
        let callback = function(data) {
            // data = JSON.parse(data);
            if (handler) {
                handler.apply(target, arguments);
            }
        };
        app.external.dsBridge.register('updateTobyUserInfo', callback);
    },
    unregisterUpdateUserInfo: function() {
        let callback = function(data) {};
        app.external.dsBridge.register('updateTobyUserInfo', callback);
    },

    //注册获取首页状态的回调
    registerActiveToby: function(handler, target) {
        let callback = function(tid, value) {
            if (handler) {
                handler.apply(target, arguments);
            }
        };
        app.external.dsBridge.register('activeToby', callback);
    },
    unregisterActiveToby: function() {
        let callback = function(tid, value) {};
        app.external.dsBridge.register('activeToby', callback);
    },

};

module.exports = NativeMsg;