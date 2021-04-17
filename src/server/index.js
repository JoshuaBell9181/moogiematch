var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('socket.io-redis');
io.adapter(redis({ host: process.env.REDIS_ENDPOINT, port: 6379 }));

const movies = require('./db/movies');

// start express server on port 5000
var port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.get('/movies', (req, res) => {
  res.json(movies.getMovies())
});


io.on('connection', function(socket) {
  console.log('a user connected');

  // convenience function to log server messages on the client
  function log() {
      var array = ['Message from server:'];
      array.push.apply(array, arguments);
      socket.emit('log', array);
  }

  socket.on('message', function(message, room) {
      log('Client liked: ', message);
      socket.to(room).emit('message', message);
  });

  socket.on('continue', function(room) {
    log("continue clicked")
    io.in(room).emit('setContinue');
  });

  socket.on('create or join', function(room) {
      log('Received request to create or join room ' + room);
  
      // TODO override number of clients in room function
      var clientsInRoom = async ()=> {
        const sockets = await io.in(room).fetchSockets()
        const numClients = sockets.length
        log('Room ' + room + ' now has ' + numClients + ' client(s)');
        
        if (numClients === 0) {
          socket.join(room.toString());
          log('Client ID ' + socket.id + ' created room ' + room);
          socket.emit('created', room, socket.id);
    
        } else if (numClients <= 6) {
          log('Client ID ' + socket.id + ' joined room ' + room);
          io.in(room).emit('join', room);
          socket.join(room);
          io.in(room).emit('joined', numClients + 1);
          log(`number of client ${numClients}`)
          // socket.emit('joined', room, socket.id);
          io.in(room).emit('ready');
        } else { // max two clients
          socket.emit('full', room);
        }
      };
      clientsInRoom();
    });
});