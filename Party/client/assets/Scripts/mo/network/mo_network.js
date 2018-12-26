require('mo_init');
require('mo_debug_init');

mo.network = {};
mo.network.Http = require('mo_Http');
mo.network.SocketIO = require('mo_Socket_io');

//mo.log('mo.network.SocketIO : ', mo.network.SocketIO);