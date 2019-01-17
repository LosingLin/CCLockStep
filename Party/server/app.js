let server = require('http').Server();
let io = require('socket.io')(server);

let g_stepTime = 0;         // 当前step时间戳
let g_stepInterval = 100;   // 每个step的间隔ms

let g_onlines = {};
let g_joinCount = 0;
let g_maxJoinCount = 2;

let g_commands = [];
let g_commands_history = [];

// 游戏状态
let STATUS = {
    WAIT: 1,
    START: 2
}

let g_gameStatus = STATUS.WAIT;

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
        if (playerName) {
            g_onlines[playerName].online = false;  
            // g_onlines[playerName] = null;    
            g_joinCount --;
            if (g_joinCount <= 0) {
                g_gameStatus = STATUS.WAIT;
                g_stepTime = 0;
                g_onlines = {};
            }
        }
        

    });

    socket.on('joinGame', function(data) {
        console.log('加入房间 data : ', data);
        let name = data.playerName;
        let mapWidth = data.mapWidth;
        let mapHeight = data.mapHeight;
        

    
        if (g_joinCount == g_maxJoinCount) {
            socket.emit('system', '房间已满');
            socket.disconnect();
            return;
        }

        if (g_onlines[name]) {
            g_onlines[name].socket.emit('system', '号被挤了');
            g_onlines[name].socket.disconnect();

            if (g_gameStatus === STATUS.START) {
                // 重连
                g_onlines[name] = {socket: socket, online: true};
                g_joinCount ++;

                // 重连
                socket.emit('startGame', {player: Object.keys(g_onlines), stepInterval: g_stepInterval});
                socket.emit('message', g_commands_history);

                return;
            }
        }

        if (g_joinCount < g_maxJoinCount) {
            let x = (Math.random() - 0.5) * mapWidth * 0.5;
            let y = (Math.random() - 0.5) * mapHeight * 0.5;
            io.sockets.emit('playerJoin', {playerName: name, posX: x, posY: y});

            g_onlines[name] = {socket: socket, online: true};
            g_joinCount ++;
        }

        if (g_joinCount == g_maxJoinCount) {
            g_commands = [];
            g_commands_history = [];
            io.sockets.emit('startGame', {player: Object.keys(g_onlines), stepInterval: g_stepInterval});

            console.log('------ startGame');

            g_gameStatus = STATUS.START;

            for (let key in g_onlines) {
                let x = (Math.random() - 0.5) * mapWidth * 0.5;
                let y = (Math.random() - 0.5) * mapHeight * 0.5;

                let command = {};
                command.id = key;
                let data = {};
                data.msg = 'orgPos';
                data.x = x;
                data.y = y;
                command.data = data;

                g_commands.push(command);
            }

            stepUpdate();
        }
    });

    socket.on('timeSync', function(time) {
        socket.emit('timeSync', {client: time, server:Date.now()});
    });

    socket.on('message', function(json) {
        console.log('-------- message : ', json);
        if (g_gameStatus == STATUS.START) {
            // TODO:过滤过高延迟的包 (json.step)
            json.id = getPlayerName(socket.id);
            if (json.id) {
                g_commands.push(json);
            }
        }
    });

});

// step定时器
function stepUpdate() {
    // 过滤同帧多次指令
    let message = {};
    for (let key in g_onlines) {
        message[key] = {step:g_stepTime, id:key};
    }
    for (let i = 0; i < g_commands.length; ++ i) {
        let command = g_commands[i];
        command.step = g_stepTime;
        message[command.id] = command;
    }

    g_commands = [];

    // 发送指令
    let commands = [];
    for (let key in message) {
        commands.push(message[key]);
    }
    g_commands_history.push(commands);

    for (let key in g_onlines) {
        g_onlines[key].socket.emit('message', [commands]);
    }

    // console.log('------- stepUpdate : ', g_stepTime);
}

// frame定时器
let stepUpdateCounter = 0;
function update(dt) {
    if (g_gameStatus === STATUS.START) {
        stepUpdateCounter += dt;
        if (stepUpdateCounter >= g_stepInterval) {
            g_stepTime ++;
            stepUpdate();
            stepUpdateCounter -= g_stepInterval;
        }
    }
}

// 启动定时器
let lastUpdate = Date.now();
setInterval(function() {
    let now = Date.now();
    let dt = now - lastUpdate;
    lastUpdate = now;
    update(dt);
});

server.listen(3124, function() {
    console.log("服务器启动成功，监听端口3000");
});