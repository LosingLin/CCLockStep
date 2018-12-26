require('mo_debug_init');

let Http = {
    timeout: 5000,
    sendRequest: function(url, data, handlers, method, headData) {
        method = typeof method !== 'undefined' ? method : 'GET';
        let xhr = cc.loader.getXMLHttpRequest();
        xhr.timeout = this.timeout;

        // 保存请求的数据
        let requestData = {};
        requestData.url = url;
        requestData.data = data;
        requestData.handlers = handlers;
        requestData.method = method;
        requestData.headData = headData;
        xhr.requestData = requestData;

        let requestURL = url;
        let postData = null;
        if (method === 'GET') {
            let str = '?';
            for (let k in data) {
                if (str != '?') {
                    str += '&';
                }
                str += k + '=' + data[k];
            }
            requestURL = url + encodeURI(str);
        }

        mo.log('RequestURl: ' + requestURL);
        xhr.open(method, requestURL, true);

        if (cc.sys.isNative) {
            xhr.setRequestHeader('Accept-Encoding', 'gzip,deflate', 'text/html;charset=UTF-8');
        }
        if (method === 'POST') {
            xhr.setRequestHeader("Content-Type", "application/json");
            postData = JSON.stringify(data);
        } 

        // 头部参数
        if (headData) {
            mo.log('-- headData -- : ', headData);
            for (let k in headData) {
                mo.log(k + ' : ' + headData[k]);
                xhr.setRequestHeader(k, headData[k]);
            }
        }

        let onError = function(e) {
            if (handlers && handlers.onReqError) {
                handlers.onReqError(e, xhr.requestData);
            }
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {                    //请求成功
                    try {
                        let ret = JSON.parse(xhr.responseText);
                        if (handlers && handlers.onReqSuccess) {
                            handlers.onReqSuccess(ret, xhr.requesetData);
                        }
                    } catch (e) {
                        mo.error("http error : " + e);
                        mo.log('xhr.responseText : ', xhr.responseText);
                        onError(e);
                    } finally {
                        
                    }
                } else {                                                    //请求失败
                    if (xhr.status === 0) {
                        mo.log('xhr is unsent of url : ', xhr.requestData.url);
                    } else {
                        mo.log('xhr.responseText : ', xhr.responseText);
                        onError({status: xhr.status});
                    }
                }
                //请求结束的回调
                if (handlers && handlers.onReqEnd){
                    handlers.onReqEnd();

                    // xhr.requestData = null;
                }
            }
        };

        // 超时处理
        xhr.ontimeout = function(e) {
            if (handlers && handlers.onReqTimeout) {
                handlers.onReqTimeout(e, xhr.requestData);
            }
        };
        xhr.onerror = onError;

        // 请求开始的回调
        if (handlers && handlers.onReqStart) {                  
            handlers.onReqStart();
        }

        if (postData) {
            xhr.send(postData);
        } else {
            xhr.send();
        }

        return xhr;
    },
}

module.exports = Http;