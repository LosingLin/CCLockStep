require('mo');
require('app_init');

app.network = {};
app.network.http = require('app_http');
app.network.socketio = require('app_socketio');