require('mo_debug_init');

let EventSys = {
    handlers : {},
    _reHandler : function(handler, target, event) {
        return function(data) {
            if (target) {
                handler.call(target, data);
            } else {
                handler(data);
            }
        };
    },
    addEventListener : function(event, handler, target) {
        mo.assert(event != null && typeof(event) == 'string', 'event should be string');
        mo.assert(handler != null && typeof(handler) == 'function', 'handler should be function');
        mo.assert(target != null, 'target can not be null');
        if (this.handlers[event] == null) {
            this.handlers[event] = new Array();
        }
        let reHandler = this._reHandler(handler, target, event);

        let item = {};
        item.target = target;
        item.handler = reHandler;
        this.handlers[event].push(item);
    },
    removeEventListener : function(event, target) {
        mo.assert(event != null && typeof(event) == 'string', 'event should be string');
        mo.assert(target != null, 'target can not be null');
        if (this.handlers[event] == null) {
            mo.warn('there is no listenr at event : ' + event);
            return;
        }
        let newArr = new Array();
        // let offArr = new Array();
        this.handlers[event].forEach(element => {
            if (element.target == target) {
                // offArr.push(element);
            } else {
                newArr.push(element);
            }
        });
        this.handlers[event] = newArr;     //重新赋值
        if (newArr.length == 0) {
            this.handlers[event] = null;
        }
    },
    dispatch : function(event, data) {
        mo.assert(event != null && typeof(event) == 'string', 'event should be string');
        if (this.handlers[event] == null) {
            mo.warn('there is no listenr at event : ' + event);
            return;
        }
        this.handlers[event].forEach(element => {
            element.handler(data);
        });
    },
    printHandlers : function() {
        mo.log('EventSys Handlers :', this.handlers);
    },
};

module.exports = EventSys;