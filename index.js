var express = require('express');
var socket = require('socket.io');

// Configuración de la App
var app = express();
var server = app.listen(4000, function(){
    console.log('Servidor corriendo en http://localhost:4000');
});

// Servir archivos estáticos
app.use(express.static('public'));

// Configuración de Sockets
var io = socket(server);

io.on('connection', function(socket){
    console.log('Hay una conexion', socket.id);

    // Escuchar evento de chat
    socket.on('chat', function(data){
        io.sockets.emit('chat', data);
    });

    // Escuchar evento de "escribiendo"
    socket.on('typing', function(data){
        socket.broadcast.emit('typing', data);
    });
});