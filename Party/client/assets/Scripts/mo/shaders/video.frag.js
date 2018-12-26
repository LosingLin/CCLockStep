
let fragShader = `
    #ifdef GL_ES
    precision lowp float;
    #endif

    varying vec4 v_fragColor;
    varying vec2 v_texCoord;

    void main()
    {
        vec4 c = texture2D(CC_Texture0, v_texCoord);

        // gl_FragColor.xyz = vec3(0.2126*c.r + 0.7152*c.g + 0.0722*c.b);
        if (c.g >0.5&&c.b<0.5&&c.r<0.5) {
            c.a = 0.0;
        } 
        gl_FragColor = c;
        
    }
`;

module.exports = fragShader;