require('mo_debug_init');

let sceneMgr = {
    plugins:{},
    //注册场景管理器插件
    registerPlugin: function(type, plugin){
        //如果已经存在插件则提出错误
        if (this.plugins[type]) {
            mo.error('plugin is exist! type: ', type);
        }
        this.plugins[type] = plugin;
    },
    //注销场景管理器插件
    unregisterPlugin: function(type){
        let plugin = this.plugins[type];
        if (plugin) {
            this.plugins[type] = null;
        } else {
            mo.warn('there is no plugin with type: ', type);
        }
    },
    //获取插件
    getPlugin: function(type) {
        let plugin = this.plugins[type];
        //如果不存在插件则提出错误
        if (plugin == null) {
            mo.warn('there is no plugin with type: ', type);
        }
        return plugin
    },

    loadScene: function(sceneName, onLaunched){
        let curScene = cc.director.getScene();
        mo.log('current scene is : ', curScene._name);

        let plugin = this.getPlugin(sceneName)
        if (plugin) {
            if(plugin.beforeRun) {
                plugin.beforeRun()
            }
        }

        let onLaunchedFunc = onLaunched ? onLaunched : plugin ? plugin.onLaunched : function(){};

        cc.director.loadScene(sceneName, onLaunchedFunc);

        if (plugin) {
            if(plugin.afterRun) {
                plugin.afterRun()
            }
        }
    },
};

module.exports = sceneMgr