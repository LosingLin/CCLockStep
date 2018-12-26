let server = require('http').Server();
let io = require('socket.io')(server);

let g_onlines = {};
let g_joinCount = 0;
let g_maxJoinCount = 2;

io.on('connection', function(socket) {
    console.log('连接 socket id: ', socket.id); 
    socket.emit('connected', {id: socket.id});
    // socket.emit('open', '连接成功');

    // 获取用户名称
    function getPlayerName(socketId) {
        for (let key in g_onlines) {
            if (socketId === g_onlines[key].socket.id) {
                return key;
            }
        }
    }

    socket.on('disconnect', function() {
        //socket.emit('disconnect', {id: socket.id});
        console.log('断开连接 socket id: ', socket.id);
        let playerName = getPlayerName(socket.id);
        // g_onlines[playerName].online = false;  
        g_onlines[playerName] = null;     
    });

    socket.on('joinGame', function(data) {
        console.log('加入房间 data : ', data);
        let name = data.playerName;
        let mapWidth = data.mapWidth;
        let mapHeight = data.mapHeight;
        

        if (g_onlines[name]) {
            g_onlines[name].socket.emit('system', '号被挤了');
            g_onlines[name].socket.disconnect();
        }

        if (g_joinCount == g_maxJoinCount) {
            socket.emit('system', '房间已满');
            socket.disconnect();
            return;
        }

        if (g_joinCount < g_maxJoinCount) {
            let x = Math.random() * mapWidth;
            let y = Math.random() * mapHeight;
            io.sockets.emit('playerJoin', {playerName: name, posX: x, posY: y});

            g_onlines[name] = {socket: socket, online: true};
            g_joinCount ++;
        }

        if (g_joinCount == g_maxJoinCount) {
            io.sockets.emit('startGame');
        }
    });
});

server.listen(3000, function() {
    console.log("服务器启动成功，监听端口3000");
});