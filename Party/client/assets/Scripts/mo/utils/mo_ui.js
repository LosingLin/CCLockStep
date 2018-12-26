require('mo_debug_init');

let UIUtils = {
    getVisibleSize : function() {
        return cc.view.getVisibleSize();
    },

    setColorRec : function(node, color) {
        node.color = color;
        let children = node.children;
        for (let i = 0; i < children.length; i ++) {
            this.setColorRec(children[i], color);
        }
    }, 
};

module.exports = UIUtils;