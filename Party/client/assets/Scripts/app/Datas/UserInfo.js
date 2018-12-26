require('mo');
require('app');

let UserInfo = cc.Class({
    properties: {

    },
    ctor () {
        this.uid = null;
        this.token = null;
        this.appVersion = null;
    },
    clear () {
        this.uid = null;
        this.token = null;
        this.appVersion = null;
    },

    loadData (jsonData) {
        this.uid = jsonData.uid;
        this.token = jsonData.token;
        this.appVersion = jsonData.app_version;
        if (jsonData.env) {
            mo.server = jsonData.env;
        } else {
            mo.server = mo.const.server.online;
        }
    }

});

module.exports = UserInfo;