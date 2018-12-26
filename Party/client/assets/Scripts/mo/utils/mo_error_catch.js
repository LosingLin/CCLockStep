require('mo_debug_init');

// 使用window.onerror来捕获异常信息
/** 
 * @param {String} errorMessage  错误信息 
 * @param {String} scriptURI   出错的文件 
 * @param {Long}  lineNumber   出错代码的行号 
 * @param {Long}  columnNumber  出错代码的列号 
 * @param {Object} errorObj    错误的详细信息，Anything 
 */
window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj, errorCode) { 

    // TODO 
    // mo.log("错误信息：" , errorMessage); 
    // mo.log("出错文件：" , scriptURI); 
    // mo.log("出错行号：" , lineNumber); 
    // mo.log("出错列号：" , columnNumber); 
    // mo.log("错误详情：" , errorObj); 
    // mo.log("UserAgent: ", navigator.userAgent);

    // mo.log(' mo.run_mod : ', mo.run_mod);

    let ErrorCode = require('ErrorCode');

    let msg = '';
    let code = ErrorCode.GameError;
    let needShowAlert = false;

    if (errorMessage.msg && errorMessage.code) {
        msg = 'Toby错误信息：' + errorMessage.msg;
        code = errorMessage.code;
    } else {
        msg = 'Toby错误信息：' + errorMessage;
    }

    if (errorMessage.needShowAlert || errorMessage.needShowAlert === undefined) {
        needShowAlert = true;
    } else {
        needShowAlert = false;
    }
    
    if (scriptURI) {
        msg += '\n文件：' + scriptURI; 
    }
    if (lineNumber) {
        msg += '\n行号：' + lineNumber;
    }
    if (columnNumber) {
        msg += '\n列号：' + columnNumber;
    }
    if (errorObj && errorObj.stack) {
        msg += '\n详情：' + errorObj.stack;
    }
    if (navigator && navigator.userAgent) {
        msg += '\nUserAgent: ' + navigator.userAgent;
    }

    let EventMsg = require('EventMsgCfg');
    if (mo.run_mod == mo.const.run_mod.debug) {
        
        mo.log('ErrorMsg : ' + msg);
        //开发环境不作上报，直接显示在界面上
        mo.sys.events.dispatch(EventMsg.ShowErrorMsg, msg);  

        let alertInfo = {};
        alertInfo.code = code;
        mo.sys.events.dispatch(EventMsg.ShowErrorAlert, alertInfo);

        // 测试
        // let info = {};
        // info.code = code;
        // info.errMsg = '';
        // info.msg = msg;
        // let appNativeMsg = require('app_native_msg');
        // appNativeMsg.reportError(info);      // 上报错误
    
    } else {
        
        // let info = {
        //     "code": 2000,      //错误码，
        //     "errMsg": '资源加载失败',  //错误提示，如果不需要App端弹出提示时，为空字符。
        //     "msg": errorInfo,    //具体错误信息
        //    }
        let errMsg = '';
        if (app && app.DataMgr && app.DataMgr.isLoadSuccessed()) {
            msg += '\nExtInfo: 加载成功后';
        } else {
            // 加载过程中，抛出错误给App端处理提示
            if (code == ErrorCode.GameError) {
                errMsg = '加载发生错误';
            } else {
                errMsg = '网络连接失败';
            }
            msg += '\nExtInfo: 加载中';
        }

        if (errorMessage.errMsg) {
            errMsg = errorMessage.errMsg;
        }
        
        
        let info = {};
        info.code = code;
        info.errMsg = errMsg;
        info.msg = msg;
        let appNativeMsg = require('app_native_msg');
        appNativeMsg.reportError(info);      // 上报错误

        // mo.log('-------- errorinfo : ', info)
        if (errMsg == '' && needShowAlert) {
            let alertInfo = {};
            alertInfo.code = code;
            mo.sys.events.dispatch(EventMsg.ShowErrorAlert, alertInfo);
        }
    }
    // return true;

    // alert(msg);
}

// window.addEventListener('error', function(error) {

// });

