require('mo_debug_init');

let mo_object = {
    clone : function (obj) {
        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;
    
        // Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }
    
        // Handle Array
        if (obj instanceof Array) {
            var copy = [];
            for (let i = 0, len = obj.length; i < len; ++i) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }
    
        // Handle Object
        if (obj instanceof Object) {
            let copy = {};
            for (let attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }
    
        throw new Error("Unable to copy obj! Its type isn't supported.");
    },

    obj_clone : function(obj) {
        if (obj instanceof Object) {
            let clone = {};
            for (let key in obj) {
                mo.log()
                clone[key] = this.obj_clone(obj[key]);
            }
            return clone;
        } else {
            return obj;
        }
    }
}

module.exports = mo_object;