require('app_init');
require('app_utils_init');
require('app_network');
require('app_external_init');
require('app_managers_init');
require('app_native_init');

!
function(){
    mo.log('----- init  app');

    // // 注册IPSData回调
    // let IPSDataHandler = {};
    // IPSDataHandler.getPushIPSData = function (json) {
    //     mo.log('------ getPushIPSData : ', json);
    //     if (json) {
    //         let jsonData = JSON.parse(json);
    //         app.DataMgr.setIPSData(jsonData);
    //         app.native.msg.unregisterGetIPSData();
    //     } 
    // };
    // app.native.msg.registerGetIPSData(IPSDataHandler.getPushIPSData, IPSDataHandler);

    // window.addEventListener('resize', function() {
    //     console.log('----------------------window resize');
    // });

    // cc.director.setClearColor(new cc.Color(0,0,0, 0));

    cc.game.setFrameRate(60);
}();

cc.macro.ENABLE_TRANSPARENT_CANVAS = true;
// cc.macro.ENABLE_WEBGL_ANTIALIAS = true;
mo.log('--------------init app');