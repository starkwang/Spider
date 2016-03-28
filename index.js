var Spider = require('./build/Spider').Spider;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
io.on('connection', function(socket) {
    socket.on('fetch start', function(data) {
        Spider(data.url, socket);
    });
});
server.listen(3001);


app.use(bodyParser());// WARNING
app.use('/js', express.static('./client/build'));
app.use('/css', express.static('./client/build'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.listen(3000,function(){
	console.log('server start at 127.0.0.1:%s',this.address().port)
});
