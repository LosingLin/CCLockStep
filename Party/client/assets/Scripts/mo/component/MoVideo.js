require('mo');

cc.Class({
    extends: cc.Component,

    properties: {
        url: '',
        // preload: false,
        muted: false,
        loop: false,
        autoplay: false,
        displayer: {
            default: null,
            type: cc.Sprite,    
        },
    },

    // LIFE-CYCLE CALLBACKS:

    ctor () {
        this.b_isMetaDataLoaded = false;

    },

    onDestroy () {
        if (this.video) {
            this.video = null;   //创建的element，没有加到document tree上，则需要等待gc释放
        }
    },

    onLoad () {
        this.initVideo();
    },

    start () {

    },

    update (dt) {
        if (this.b_isMetaDataLoaded) {

            let videoShaderProgram = this.displayer._sgNode.getShaderProgram();
            videoShaderProgram.use();

            let spriteFrame = this.displayer.spriteFrame;
            let texture = spriteFrame.getTexture();
            
            // let gl = texture._gl;
            gl.activeTexture(gl.TEXTURE0);
            // mo.log('--- texture._glID : ', texture._glID);

            gl.bindTexture(gl.TEXTURE_2D, texture._glID);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video);

            cc.gl.bindTexture2DN(1, this.displayer.spriteFrame.getTexture());
            // let CC_Texture0_Loc = videoShaderProgram.getUniformLocationForName("CC_Texture0");
            // videoShaderProgram.setUniformLocationWith1i(CC_Texture0_Loc, 0);

            // this.videoSp.spriteFrame.setTexture(texture);

            // mo.log('-------- update');
            // gl.bindTexture(gl.TEXTURE_2D, null);
        }
    },

    initVideo () {

        // this.url = 'https://courses.abctime.com/webgl/green.mp4';
        this.video = document.createElement('video');
        this.video.muted = this.muted;
        this.video.loop = this.loop;
        this.video.autoplay = this.autoplay;
        // this.video.preload = this.preload;  none:不预载 metadata:预载资源信息 auto
        this.video.crossOrigin = "";
        this.video.src = this.url;
        this.video.style.display = "none";
        this.video.setAttribute("playsinline",true);
        this.video.setAttribute("webkit-playinline",true);
        this.video.setAttribute("x5-playinline",true);

        this.video.onloadedmetadata = (event) => {
            this.b_isMetaDataLoaded = true;

            mo.log('video ----- onloadedmetadata duration : ', this.video.duration);
            mo.log('video ----- onloadedmetadata width : ', this.video.videoWidth);
            mo.log('video ----- onloadedmetadata height : ', this.video.videoHeight);

            // this.video.play();

            // this.pause();
        }

        this.video.onplay = () => {
            // this.render(texture,u_Sampler,video);
            mo.log('video ----- onplay');
            
        } 
        this.video.onplaying = () => {
            // this.render(texture,u_Sampler,video);
            mo.log('video ----- onplaying');
        }

        // let spriteFrame = this.displayer.spriteFrame;
        // if (!spriteFrame) {
        //     spriteFrame = new cc.SpriteFrame();
        //     let texture = new cc.Texture2D();
        //     texture.width = this.node.width;
        //     texture.height = this.node.height;
        //     spriteFrame.setTexture(texture);
        // }
        mo.utils.Shader.setShader(this.displayer, 'video');
    },

    play () {
        if (this.b_isMetaDataLoaded) {
            this.video.play();
        }
    },
    pause () {
        this.video.pause();
    },
});
