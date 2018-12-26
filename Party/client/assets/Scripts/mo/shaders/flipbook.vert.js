
let vertShader = `
#ifdef GL_ES
    precision lowp float;
#endif
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    attribute vec4 a_color;

    uniform vec4 u_LBPos;
    uniform vec4 u_LTPos;
    uniform vec4 u_RBPos;
    uniform vec4 u_RTPos;

    uniform float u_radians;

    varying vec4 v_fragColor;
    varying vec2 v_texCoord;

    const float PI = 3.14159265;

    void main()
    {
        
        vec4 tempColor = a_color;

        vec4 temp = a_position.xyzw;

        if (temp.x == u_RBPos.x) {
            // tempColor = vec4(1.0, 1.0, 0.0, 1.0);

            if (temp.y == u_RTPos.y) {
                temp.y += sin(u_radians) * 100.0;
            } else {
                temp.y -= sin(u_radians) * 100.0;
            }

            temp.x = u_LBPos.x - (u_LBPos.x - u_RBPos.x) * (cos(u_radians));
        }

        // gl_Position = CC_PMatrix * a_position;
        
        vec4 resultPosition = CC_PMatrix * temp;
        // resultPosition.x += 0.2;
        // resultPosition.y += 0.2;

        // if (resultPosition.x > 0.0) {
        //     if (resultPosition.y > 0.0) {
        //         resultPosition.y += 0.2;
        //     } else {
        //         resultPosition.y -= 0.2;
        //     }
        // }

        gl_Position = resultPosition;
        v_fragColor = tempColor;
        v_texCoord = a_texCoord;

    }
`;

module.exports = vertShader;