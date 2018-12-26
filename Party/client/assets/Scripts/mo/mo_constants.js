
require('mo_init');

mo.const = {
    //运行模式
    run_mod : {
        debug : 1,
        release : 2
    },
    env : {
        app : 1,
        web : 2
    },
    server : {
        build : 1,          //构建
        test : 2,           //测试
        online : 3          //线上
    }
};

