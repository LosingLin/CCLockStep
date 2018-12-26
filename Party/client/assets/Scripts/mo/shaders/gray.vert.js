
let vertShader = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    attribute vec4 a_color;

    varying vec4 v_fragColor;
    varying vec2 v_texCoord;

    void main()
    {

        gl_Position = CC_PMatrix * a_position;
        v_fragColor = a_color;
        v_texCoord = a_texCoord;

    }
`;

module.exports = vertShader;