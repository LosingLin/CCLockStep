
require('mo_init');
require('mo_constants');
require('mo_cfgs');


require('mo_debug_init');
require('mo_utils_init');
require('mo_sys_init');
require('mo_managers_init');


// 开启错误捕获收集
require('mo_error_catch');


let proto = cc.loader.__proto__;
proto.mo_ext_checkCouldRelease = function(releaseKey) {
    // mo.log('------- this._cache : ', this._cache);
    mo.log('------- releaseKey : ', releaseKey);
    if (this._cache[releaseKey]) {
        return false;
    } else {
        return true;
    }
};

