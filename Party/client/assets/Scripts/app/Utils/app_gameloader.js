require('mo');

let gameloader = {
    loaderMap : {},
    registerGameLoader : function(key, loader) {
        this.loaderMap[key] = loader;
    },
    unregisterGameLoader : function(key) {
        this.loaderMap[key] = null;
    },
    getGameLoader : function(key) {
        return this.loaderMap[key];
    },

    loadGame : function(gameData, callback) {
        let key = gameData.getType();
        mo.log('--- key ', key);
        this.getGameLoader(key).loadGame(gameData, callback);
    },
    releaseGame : function(gameData) {
        let key = gameData.getType();
        this.getGameLoader(key).releaseGame(gameData);
    },
};

module.exports = gameloader;