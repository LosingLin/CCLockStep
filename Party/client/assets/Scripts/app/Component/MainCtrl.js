require('mo');
require('app');

let EventMsg = require('EventMsgCfg');
let ErrorCode = require('ErrorCode');
let TobyActiveType = require('TobyActiveType');
let PosType = require('PosType');
let TobyBonesCfg = require('TobyBonesCfg');
let DefaultCfg = require('DefaultCfg');

let TobyData = require('TobyData');

cc.Class({
    extends: cc.Component,

    properties: {
        loadingGrp: {
            default: null,
            type: cc.Node
        },
        retryAlertView: {
            default: null,
            type: cc.Node
        },
        retryAlertText: {
            default: null,
            type: cc.Label
        },
        debugGrp: {
            default: null,
            type: cc.Node
        },
        tobyGrp: {
            default: null,
            type: cc.Node,
        },
        toby: {
            default: null,
            type: cc.Node
        },
        backgroundGrp: {
            default: null,
            type: cc.Node,
        },
        background: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:
    ctor () {
        this.b_isReqing = false;
    },
    onDestroy() {
        this.tobyCtrl = null;
        this.backgroundCtrl = null;
        this.b_isReqing = false;
    },


    onLoad () {
        // 游戏已加载成功
        app.DataMgr.setGameLoaded(true);

        this.tobyCtrl = this.toby.getComponent('TobyCtrl');
        this.backgroundCtrl = this.background.getComponent('TobyBgCtrl');

        // 初始化用户信息
        app.native.msg.initUserInfo();

        // 发起请求
        this.requestTobyData();
        this.requestTobyChatData();

        // this.hideErrorAlert();
        // this.hideErrorMsg();

        
        // let delay = cc.delayTime(0.2);
        // let callfunc = cc.callFunc(function() {
        //     app.DataMgr.setLoadSuccessed(true);
        // }, this);
        // this.node.runAction(cc.sequence(delay, callfunc));
        
    },

    start () {
        
    },

    onEnable () {
        mo.sys.events.addEventListener(EventMsg.ShowErrorAlert, this.showErrorAlert, this);
        // mo.sys.events.addEventListener(EventMsg.HideErrorAlert, this.hideErrorAlert, this);
        mo.sys.events.addEventListener(EventMsg.ShowErrorMsg, this.showErrorMsg, this);

        mo.sys.events.addEventListener(EventMsg.TouchEventNotify_End, this.tobyTouched, this);


        // native
        app.native.msg.registerUpdateUserInfo(this.userInfoUpdated, this);
        app.native.msg.registerActiveToby(this.tobyActived, this);
    },
    onDisable () {
        mo.sys.events.removeEventListener(EventMsg.ShowErrorAlert, this);
        // mo.sys.events.removeEventListener(EventMsg.HideErrorAlert, this);
        mo.sys.events.removeEventListener(EventMsg.ShowErrorMsg, this);

        mo.sys.events.removeEventListener(EventMsg.TouchEventNotify_End, this);

        // native
        app.native.msg.unregisterUpdateUserInfo();
        app.native.msg.unregisterActiveToby();
    },

    // update (dt) {},

    _clearToby () {
        // 停止动作及语音
        this.tobyCtrl.stopTalk();

        // 清理资源和数据
        let tobyData = app.DataMgr.getTobyData();
        this._releaseTobyData(tobyData);
        app.DataMgr.setTobyData(null);
        let tobyBackupData = app.DataMgr.getTobyBackupData();
        this._releaseTobyData(tobyBackupData);
        app.DataMgr.setTobyBackupData(null);
        let chatData = app.DataMgr.getChatData();
        this._releaseTobyData(chatData);
        app.DataMgr.setChatData(null)
        let chatBackupData = app.DataMgr.getChatBackupData();
        this._releaseTobyData(chatBackupData);
        app.DataMgr.setChatBackupData(null);
    },

    _reloadToby () {
        this._clearToby();

        // 重新获取数据
        this.requestTobyData();
        this.requestTobyChatData();
    },

    // Native
    userInfoUpdated (json) {
        if (json) {
            // 更新用户数据
            let jsonData = JSON.parse(json);
            mo.log('userInfoUpdated : ', jsonData);
            let updated =  app.DataMgr.setUserInfo(jsonData);

            if (updated) {
                mo.log('userInfoUpdated  -- reloadToby');
                // 重新加载toby
                this._reloadToby();
            }
        }
    },
    tobyActived (json) {
        if (json) {
            let jsonData = JSON.parse(json);
            mo.log('tobyActived : ', jsonData);

            let activeType = jsonData.type;
            switch (activeType){
                case TobyActiveType.BackToFront:           // 后台切到前台
                    // this.requestTobyData();
                    break;
                case TobyActiveType.FrontToBack:           // 前台切到后台
                    // this.tobyCtrl.stopTalk();
                    break;
                case TobyActiveType.OtherToMain:           // 其他页面到主页
                    // this.requestTobyData();
                    break;
                case TobyActiveType.MainToOther:            // 主页到其他页面
                    this.tobyCtrl.stopTalk();
                    break;
            }
        }
    },

    // 错误处理
    _handlerErrorCode (data, markData, typestr) {
        let code = data.code;
        let errorInfo = {};
        errorInfo.msg = data.msg;
        errorInfo.errMsg = '';
        errorInfo.needShowAlert = false;
        mo.log('------------ _handlerErrorCode : ', data);
        if (code == 1401) {
            mo.log('------------ 1401 ');
            errorInfo.code = ErrorCode.UserInfoError;

            // token不合法
            app.native.msg.tokenIllegal(markData);
        } else if (code == 24000) {
            errorInfo.code = ErrorCode.HttpError;
        } else if (code == 21000) {
            errorInfo.code = ErrorCode.HttpError;
        } else {
            if (errorInfo.msg === '') {
                errorInfo.msg = '语料未知异常';
            }
            errorInfo.code = ErrorCode.HttpError;
        }

        errorInfo.msg = typestr + ' : ' + errorInfo.msg;

        window.onerror(errorInfo);

    },

    // 请求Toby数据
    requestTobyData () {
        this.tobyCtrl.stopTalk();
        
        let tobyData = app.DataMgr.getTobyData();
        this._releaseTobyData(tobyData);
        app.DataMgr.setTobyData(null);

        // 如果有后备数据，则切换到当前数据并播放
        let lastTobyBackupData = app.DataMgr.getTobyBackupData();
        if (lastTobyBackupData) {

            app.DataMgr.setTobyData(lastTobyBackupData);
            app.DataMgr.setTobyBackupData(null);

            this.playCurTobyData();
            mo.log('------***使用后备数据***------');
            return;
        }

        let self = this;
        
        let userInfo = app.DataMgr.getUserInfo();
        let markData = {};
        markData.uid = userInfo.uid;
        markData.token = userInfo.token;

        let processAndPlay = function(jsonData) {
            // 容错 有后背数据则不处理
            let lastTobyBackupData = app.DataMgr.getTobyBackupData();
            if (lastTobyBackupData) {
                return;
            }

            let tobyData = new TobyData();
            tobyData.loadData(jsonData);

            app.utils.tobyloader.load(tobyData, function(tbData){

                // 如果有当前数据，则保存到后备数据
                let lastTobyData = app.DataMgr.getTobyData();
                if (lastTobyData) {
                    app.DataMgr.setTobyBackupData(tbData);    
                } else {
                    //保存
                    app.DataMgr.setTobyData(tbData);
                    mo.log('------***使用当前数据***------');
                }
                
                // 通知原生加载完成了
                if (!app.DataMgr.isLoadSuccessed()) {
                    app.DataMgr.setLoadSuccessed(true);
                }
                
                self.playCurTobyData();
            });
        };

        // 随机播放一段
        let randomCommonPlay = function() {
            let randomData = DefaultCfg.commonTobyDatas;
            let randomIndex = Math.floor(Math.random() * randomData.length);

            let data = randomData[randomIndex];
            processAndPlay(data);
        };

        let handlers = {};
        handlers.onReqError = function() {
            randomCommonPlay();
        },
        handlers.onReqSuccess = function(data, requesetData) {
            mo.log('onReqSuccess ----- data : ', data);
    
            let code = data.code;
            if (code === 0) {
                // data.data = {
                //     "group_audio": "-1,14,19",
                //     "animation_background": "s-2",
                //     "toby_corpus": [{
                //       "audio": "https://classkit-resource.abctime-me.com/watch/2018-12-06/mp3/c9e50f103ecd77446cff1c469cb8873a.mp3",
                //       "animation_action": "shangxin1"
                //     }, {
                //       "audio": "https://classkit-resource.abctime-me.com/watch/2018-12-06/mp3/1f403ebc7ebd0f23a3601b1accb1256e.mp3",
                //       "animation_action": "shangxin1"
                //     }, {
                //       "audio": "https://classkit-resource.abctime-me.com/watch/2018-12-14/mp3/01d4ac4eac106d93e744ed4b96450386.mp3",
                //       "animation_action": "kaixin1"
                //     }]};
                processAndPlay(data.data);
                // randomCommonPlay();
            } else {
                self._handlerErrorCode(data, markData, 'main');
                randomCommonPlay();
                // let data = {
                //     "group_audio": "-1,14,19",
                //     "animation_background": "s-2",
                //     "toby_corpus": [{
                //       "audio": "https://classkit-resource.abctime-me.com/watch/2018-12-06/mp3/c9e50f103ecd77446cff1c469cb8873a.mp3",
                //       "animation_action": "shangxin1"
                //     }, {
                //       "audio": "https://classkit-resource.abctime-me.com/watch/2018-12-06/mp3/1f403ebc7ebd0f23a3601b1accb1256e.mp3",
                //       "animation_action": "shangxin1"
                //     }, {
                //       "audio": "https://classkit-resource.abctime-me.com/watch/2018-12-14/mp3/01d4ac4eac106d93e744ed4b96450386.mp3",
                //       "animation_action": "kaixin1"
                //     }]};
                // processAndPlay(data);
            }
        };
        app.NetWorkMgr.requestTobyAIData(handlers);
    },
    // 请求寒暄数据
    requestTobyChatData () {
        let self = this;

        let processTBJSonData = function(jsonData) {
            let tobyData = new TobyData();
            tobyData.loadData(jsonData);

            app.utils.tobyloader.load(tobyData, function(tbData){

                // 释放上次的资源
                let lastChatBackupData = app.DataMgr.getChatBackupData();
                self._releaseTobyData(lastChatBackupData);
                
                //保存
                app.DataMgr.setChatBackupData(tbData);
                
                // self.tobyCtrl.loadSkeleton(tbData.tobySkeletonName, tbData.tobySkeletonData);
            });
        };

        // 随机播放一段
        let randomCommonPlay = function() {
            let randomData = DefaultCfg.commonTobyDatas;
            let randomIndex = Math.floor(Math.random() * randomData.length);

            let data = randomData[randomIndex];
            processTBJSonData(data);
        };

        let userInfo = app.DataMgr.getUserInfo();
        let markData = {};
        markData.uid = userInfo.uid;
        markData.token = userInfo.token;

        let handlers = {};
        handlers.onReqError = function() {
            self.b_isReqing = false;
            randomCommonPlay();
        },
        handlers.onReqEnd = function() {
            self.b_isReqing = false;
        },
        handlers.onReqSuccess = function(data, requesetData) {
            mo.log('requestTobyChatData onReqSuccess ----- data : ', data);
            let code = data.code;
            if (code === 0) {
                processTBJSonData(data.data);
                // randomCommonPlay()
            } else {
                self._handlerErrorCode(data, markData, 'chat');
                randomCommonPlay();
            }
        };
        app.NetWorkMgr.requestTobyChatData(handlers);
        self.b_isReqing = true;
    },

    playCurTobyData () {
        let tobyData = app.DataMgr.getTobyData();
        if (tobyData) {
            this.tobyCtrl.stopTalk();

            this.tobyCtrl.loadSkeleton(tobyData.tobySkeletonName, tobyData.tobySkeletonData);
            this.backgroundCtrl.loadSkeleton(tobyData.tobySkeletonName, tobyData.bgSkeletonData);

            let tobyBonesCfg = TobyBonesCfg[tobyData.tobySkeletonName];
            if (!tobyBonesCfg) {
                tobyBonesCfg = TobyBonesCfg['default'];
            } 
            this.tobyGrp.x = tobyBonesCfg.x;
            this.tobyGrp.y = tobyBonesCfg.y;

            this.tobyGrp.width = this.toby.width;
            this.tobyGrp.height = this.toby.height;
            this.backgroundGrp.width = this.background.width;
            this.backgroundGrp.height = this.background.height;

            let sentence = tobyData.sentences[0];
            this.tobyCtrl.talkSentence(sentence);
        }
    },

    // toby 被点击了
    tobyTouched () {
        // 先停止上次的语言
        this.tobyCtrl.stopTalk();

        // 如果有后备数据，则将后备数据转换成当前数据
        let lastChatBackupData = app.DataMgr.getChatBackupData();
        if (lastChatBackupData) {
            let chatData = app.DataMgr.getChatData();
            this._releaseTobyData(chatData);

            app.DataMgr.setChatData(lastChatBackupData);
            app.DataMgr.setChatBackupData(null); 
        } 

        //播放当前寒暄数据
        let chatData = app.DataMgr.getChatData();
        if (chatData) {
            let sentence = chatData.sentences[0];
            this.tobyCtrl.talkSentence(sentence);
        }

        //请求一下后备数据
        if (!this.b_isReqing) {
            this.requestTobyChatData();
        }

    },

    // ----- 辅助
    showLoading () {
        this.loadingGrp.active = true;
    },
    hideLoading () {
        this.loadingGrp.active = false;
    },

    showErrorAlert (alertInfo) {

        // if (mo.run_mod === mo.const.run_mod.debug) {
            let code = alertInfo.code;
            let msg = '';
            switch (code) {
                case ErrorCode.GameError:
                msg = '发生错误，请重试\n(code:' + code + ')';
                break;
                case ErrorCode.UrlLoadError:
                msg = '网络连接失败\n(code:' + code + ')';
                break;
                case ErrorCode.ResLoadError:
                msg = '网络连接失败\n(code:' + code + ')';
                break;
            }
            
            if (msg != '') {
                this.retryAlertText.string = msg;
                this.retryAlertView.active = true;
            }
        // } else {
        //     // 正式坏境直接重试
        //     this.retryToby();
        // }
    },
    hideErrorAlert () {
        this.retryAlertView.active = false;
    },

    showErrorMsg (msg) {
        this.debugGrp.active = true;
        let labErrMsg = this.debugGrp.getChildByName('LabErrMsg').getComponent(cc.Label);
        labErrMsg.string = msg;
    },
    hideErrorMsg () {
        this.debugGrp.active = false;
    },

    retryToby () {
        mo.log('--------- retry ');
        this.hideErrorAlert();

        this._reloadToby();
    },

    // 释放资源
    _releaseTobyData (data) {
        if (data) {
            app.utils.tobyloader.release(data);
            data.clear();
        }
    }
});
