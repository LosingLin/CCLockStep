require('mo_cfgs')

let mo_console = {
    log: function() {
        if (mo.run_mod == mo.const.run_mod.debug) {
            let args = Array.prototype.slice.call(arguments);
            // let info = "";
            // args.forEach(element => {
            //     console.log(element + ' type is ' + typeof element);
            //     if (element == null) {
            //         info += "null";
            //     } else if ((typeof element) == "object") {
            //         for (let i in element) {
            //             info += i + " : " + element[i] + "\n";
            //         }
            //     } else {
            //         info += element;
            //     }
            //     info += "\n";
            // });
            // console.log(info);
            console.log.apply(null, args);
            
        }
    },
    warn: function() {
        if (mo.run_mod == mo.const.run_mod.debug) {
            console.warn.apply(null, arguments);
        }
    },
    error: function() {
        if (mo.run_mod == mo.const.run_mod.debug) {
            console.error.apply(null, arguments);
        }
    },
    assert: function() {
        if (mo.run_mod == mo.const.run_mod.debug) {
            console.assert.apply(null, arguments);
        }
    },
    alert: function() {
        if (mo.run_mod == mo.const.run_mod.debug) {
            alert.apply(null, arguments);
        }
    },
};

module.exports = mo_console;
