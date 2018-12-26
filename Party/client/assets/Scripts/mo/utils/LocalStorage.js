require('mo_utils_init');

let LocalStorage = {
    save: function(key, value) {
        cc.sys.localStorage.setItem(key, value);
    },
    get: function(key, defaultValue) {
        let result = cc.sys.localStorage.getItem(key);
        if (!result) {
            result = defaultValue;
        }
        return result;
    }
};

module.exports = LocalStorage;