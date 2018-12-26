
let errorCode = {
    GameError: 1000,                   //游戏其他错误
    
    UrlLoadError: 2000,                //Url加载失败
    ResLoadError: 3000,                //resources加载失败

    HttpError: 4000,            //Http请求错误
    HttpTimeout: 4001,          //Http请求超时

    UserInfoError: 5000,        //用户信息错误

    SysError : 8000,            //系统级错误，需要刷新页面
};

module.exports = errorCode;