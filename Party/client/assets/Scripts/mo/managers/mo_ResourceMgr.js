require('mo_debug_init');

let ErrorCode = require('ErrorCode');

let resourceMgr = {
    resourceCountMap : {},

    logTextureCache: function() {
        // let textures = cc.textureCache.getAllTextures();
        // textures.forEach(element => {
        //     mo.log('cached : ' + element.url);
        // });
    },

    _isUrlRes: function(resPath) {
        if (resPath.match('http:') || resPath.match('https:')) {
            return true;
        }
        return false;
    },

    couldRelease: function(key) {
        return cc.loader.mo_ext_checkCouldRelease(key);
    },

    // --- 这个同时支持 加载本地和远程资源
    //  加载本地资源时，如果加载单独的图片，需传入type，走浅层管理；如果是加载prefab，则不传入type，走深层管理
    //  加载网络资源时，如果拉的是图片，需传入type，会转换成cc.SpriteFrame输出，保持和本地资源一致的输出，走深层管理
    // TODO：这套资源管理方案还要一步一步完善。
    loadRes: function(resPath, type, callback) {
        let self = this;
        
        let needRecyrsively = false;
        if (callback === undefined) {
            callback = type;
            type = undefined;

            needRecyrsively = true;
        } 

        
        if (this._isUrlRes(resPath)) {
            // if (!self.resourceCountMap[resPath]) {
            //     self.resourceCountMap[resPath] = 0;
            // }
            // self.resourceCountMap[resPath] ++;
            needRecyrsively = true;
            cc.loader.load(resPath, function(err, obj){
                if (err) {
                    let errorInfo = {};
                    errorInfo.msg = resPath + ' load error!';
                    errorInfo.code = ErrorCode.UrlLoadError;
                    window.onerror(errorInfo);
                    return;
                }
                if (needRecyrsively) {
                    let deps = cc.loader.getDependsRecursively(resPath);
                    // mo.log('loaded ' + resPath);
                    deps.forEach(element => {
                        if (!self.resourceCountMap[element]) {
                            self.resourceCountMap[element] = 0;
                        }
                        self.resourceCountMap[element] ++;
    
                        // mo.log('load : ' + element + ' count ' + self.resourceCountMap[element]);
                    });
                }
                if (type == cc.SpriteFrame) {
                    obj = new cc.SpriteFrame(obj);
                }
                callback(err, obj);
            });

        } else {
            if (!needRecyrsively) {
                // mo.log('loaded ' + resPath);
    
                if (!self.resourceCountMap[resPath]) {
                    self.resourceCountMap[resPath] = 0;
                }
                self.resourceCountMap[resPath] ++;
            }

            cc.loader.loadRes(resPath, type, function(err, obj) {
                if (err) {
                    let errorInfo = {};
                    errorInfo.msg = resPath + ' load error!';
                    errorInfo.code = ErrorCode.ResLoadError;
                    window.onerror(errorInfo);
                    return;
                }
                if (needRecyrsively) {
                    let deps = cc.loader.getDependsRecursively(resPath);
                    // mo.log('loaded ' + resPath);
                    deps.forEach(element => {
                        if (!self.resourceCountMap[element]) {
                            self.resourceCountMap[element] = 0;
                        }
                        self.resourceCountMap[element] ++;
    
                        // mo.log('load : ' + element + ' count ' + self.resourceCountMap[element]);
                    });
                }
                
                callback(err, obj);
            });
        }
        
    },
    // ignoreCount 表示是否忽略计数 为ture时，直接释放资源，并将计数清零。默认为false
    releaseRes: function(resPath, type, ignoreCount) {
        let self = this;
        // mo.log('---- releaseRes : ', resPath);
        if (ignoreCount == undefined || ignoreCount == null) {
            ignoreCount = false;
        }
        if (type != undefined && type != null && !this._isUrlRes(resPath)) {
            if (!self.resourceCountMap[resPath]) {
                mo.warn('there is no resourceCount with ' + resPath);

                // let deps = cc.loader.getDependsRecursively(resPath);
                // deps.forEach(element => {
                //     // if (self.couldRelease(element)) {
                //         cc.loader.releaseRes(element, type);      //先移除一下引用，防止release导致的资源不可用
                //         cc.loader.release(element, type);
                //     // }
                // });

                // // 这里直接释放
                cc.loader.releaseRes(resPath, type);
                // cc.loader.release(resPath, type);
            }
            
            self.resourceCountMap[resPath] --;
            if (ignoreCount) {
                self.resourceCountMap[resPath] = 0;
            }
            if (self.resourceCountMap[resPath] <= 0) {
                // mo.log('release : ' + resPath);

                let deps = cc.loader.getDependsRecursively(resPath);
                deps.forEach(element => {
                    if (self.couldRelease(element)) {
                        // cc.loader.releaseRes(element, type);      //先移除一下引用，防止release导致的资源不可用
                        cc.loader.release(element, type);
                    }
                });
                // if (self.couldRelease(resPath)) {
                    cc.loader.releaseRes(resPath, type);      //先移除一下引用，防止release导致的资源不可用
                //     cc.loader.release(resPath, type);
                // }
            }
        } else {
            let deps = cc.loader.getDependsRecursively(resPath);
            // mo.log('release ' + resPath);

            deps.forEach(element => {
                if (!self.resourceCountMap[element]) {
                    mo.warn('there is no resourceCount with ' + element);

                    // cc.loader.release(element);
                }
                
                self.resourceCountMap[element] --;
                if (ignoreCount) {
                    self.resourceCountMap[element] = 0;
                }
                // mo.log('releaseRes : ' + element + ' count ' + self.resourceCountMap[element]);
                if (self.resourceCountMap[element] <= 0) {
                    // mo.log('RELEASE : ' + element);
                    // if (self.couldRelease(resPath)) {
                        // cc.loader.releaseRes(element);
                        cc.loader.release(element);
                    // }
                }
            });
        }
    },
};

module.exports = resourceMgr;