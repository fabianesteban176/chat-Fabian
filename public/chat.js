// Conexión al socket del servidor
var socket = io.connect();;

// Referencias a los elementos del DOM
var persona = document.getElementById('persona');
var appChat = document.getElementById('app-chat');
var panelBienvenida = document.getElementById('panel-bienvenida');
var usuario = document.getElementById('usuario');
var mensaje = document.getElementById('mensaje');
var botonEnviar = document.getElementById('enviar');
var escribiendoMensaje = document.getElementById('escribiendo-mensaje');
var output = document.getElementById('output');

// Cargar sonidos


// Mejor beep: usa un contexto global y asegura reproducción confiable
let globalAudioCtx = null;
function beep(frequency = 600, duration = 200, volume = 0.3) {
    try {
        if (!globalAudioCtx || globalAudioCtx.state === 'closed') {
            globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        const ctx = globalAudioCtx;
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = 'square';
        oscillator.frequency.value = frequency;
        gain.gain.value = volume;
        oscillator.connect(gain);
        gain.connect(ctx.destination);
        oscillator.start();
        setTimeout(() => {
            oscillator.stop();
            oscillator.disconnect();
            gain.disconnect();
        }, duration);
    } catch (e) {
        // Fallback: no beep
    }
}

// Función para ingresar al chat
function ingresarAlChat() {
    var nombre = persona.value.trim();
    if (nombre) {
        usuario.value = nombre;
        panelBienvenida.style.display = 'none';
        appChat.style.display = '';
        mensaje.focus();
    } else {
        alert('Por favor, ingresa tu nombre.');
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
        beep(900, 200, 0.4); // Beep agudo al enviar
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
    // Reproducir beep siempre al recibir mensaje de otro usuario
    if (data.usuario !== usuario.value) {
        beep(400, 300, 0.5); // Beep grave y más notorio al recibir
    }
});

socket.on('typing', function(data){
    if (data.texto) {
        escribiendoMensaje.innerHTML = '<p><em>' + data.nombre + ' está escribiendo un mensaje...</em></p>';
    } else {
        escribiendoMensaje.innerHTML = '';
    }
});
