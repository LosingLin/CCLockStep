
let fragShader = `
#ifdef GL_ES
    precision lowp float;
#endif

    varying vec4 v_fragColor;
    varying vec2 v_texCoord;

    uniform float u_radians;

    uniform sampler2D u_Texture1;

    const float PI = 3.14159265;

    void main()
    {
        vec2 temp = v_texCoord.xy;

        vec4 c;
        if (temp.x > 0.5) {
            // temp.x = v_texCoord.x - 0.2;

            // if (temp.y > 0.5) {
            //     temp.y = v_texCoord.y - 0.3;
            // } else {
            //     temp.y = v_texCoord.y + 0.3;
            // }
            c = v_fragColor * texture2D(u_Texture1, temp);
        } else {
            c = v_fragColor * texture2D(CC_Texture0, temp);
        }

        if (u_radians <= 0.5 * PI) {
            c = v_fragColor * texture2D(CC_Texture0, temp);
        } else {
            c = v_fragColor * texture2D(u_Texture1, temp);
        }

        gl_FragColor = c;
    }
`;

module.exports = fragShader;