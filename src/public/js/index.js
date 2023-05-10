const socket = io('ws://localhost:9090');

socket.on('connect', () => { // Escuchamos el evento connect para detectar cuándo logramos conectar al servidor
    // Escuchamos por el evento server_confirm desde el servidor
    socket.on('server_confirm', (data) => {
        console.log("El servidor ha confirmado la conexión");
        console.log(data);
    });

    // Este evento llega desde el endpoint POST 
    socket.on('new_card', (data) => {
        socket.emit(`new_card`, (data));
    });
})
