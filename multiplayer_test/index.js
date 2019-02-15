const socketIO        = require('socket.io');
const express         = require('express');
const http            = require('http');
const UUID            = require('node-uuid');
const verbose         = false;
const port            = 9000;
const app             = express();
const server          = http.Server(app);
const io              = socketIO(server);

/* Express server set up. */

//The express server handles passing our content to the browser,
//As well as routing users where they need to go. This example is bare bones
//and will serve any file the user requests from the root of your web server (where you launch the script from)
//so keep this in mind - this is not a production script but a development teaching tool.

    //Tell the server to listen for incoming connections
server.listen( port );

    //Log something so we know that it succeeded.
console.log('\t :: Express :: Listening on port ' + port );

    //By default, we forward the / path to index.html automatically.
app.get( '/', function( req, res ){
    res.sendfile( __dirname + '/index.html' );
});

io.on("connection", (socket)=>{
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('chat message', (msg)=>{
    console.log(msg);
    io.emit('chat message', msg);
  });
});
