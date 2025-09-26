// Conexión al socket del servidor
var socket = io.connect('http://localhost:4000');

// Referencias a los elementos del DOM
var persona = document.getElementById('persona');
var appChat = document.getElementById('app-chat');
var panelBienvenida = document.getElementById('panel-bienvenida');
var usuario = document.getElementById('usuario');
var mensaje = document.getElementById('mensaje');
var botonEnviar = document.getElementById('enviar');
var escribiendoMensaje = document.getElementById('escribiendo-mensaje');
var output = document.getElementById('output');

// Función para ingresar al chat
function ingresarAlChat() {
    if (persona.value) {
        panelBienvenida.style.display = "none";
        appChat.style.display = "block";
        var nombreDeUsuario = persona.value;
        usuario.value = nombreDeUsuario;
        usuario.readOnly = true;
    }
}

// Evento para enviar un mensaje
botonEnviar.addEventListener('click', function(){
    if (mensaje.value) {
        socket.emit('chat', {
            mensaje: mensaje.value,
            usuario: usuario.value
        });
        mensaje.value = '';
    }
});

// Evento para notificar que se está escribiendo
mensaje.addEventListener('keyup', function(){
    socket.emit('typing', {
        nombre: usuario.value,
        texto: mensaje.value
    });
});

// Escuchar eventos del servidor
socket.on('chat', function(data){
    escribiendoMensaje.innerHTML = '';
    output.innerHTML += '<p><strong>' + data.usuario + ': </strong>' + data.mensaje + '</p>';
});

socket.on('typing', function(data){
    if (data.texto) {
        escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo un mensaje...</em></p>';
    } else {
        escribiendoMensaje.innerHTML = '';
    }
});