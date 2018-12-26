require('mo_debug_init');

let ShaderUtils = {
    shaderPrograms: {},
    setShader: function(sprite, shaderName) {
        let glProgram = this.shaderPrograms[shaderName];
        if (!glProgram) {
            glProgram = new cc.GLProgram();
            let vertShader = require(shaderName + '.vert');
            let fragShader = require(shaderName + '.frag');
            glProgram.initWithString(vertShader, fragShader);

            if (!cc.sys.isNative) {
                glProgram.initWithVertexShaderByteArray(vertShader, fragShader);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);  
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);  
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS); 
            }

            glProgram.link();
            glProgram.updateUniforms();
            this.shaderPrograms[shaderName] = glProgram;
        }

        sprite._sgNode.setShaderProgram(glProgram);
        return glProgram;
    },
    
};  

module.exports = ShaderUtils;