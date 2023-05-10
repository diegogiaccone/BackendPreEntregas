import {} from 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './router/products.routes.js';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { Server } from 'socket.io';

const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;
const wsPuerto = 9090; 

const app = express();
const httpServer = app.listen(wsPuerto, () =>{
    console.log(`Servidor API/Socket.io iniciando en puerto ${wsPuerto}`)
}) 

const io = new Server(httpServer, { cors: { origin: "*", methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"], credentials: false }});

// Parseo correcto de urls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', productRoutes(io));
app.use('/public', express.static(`${__dirname}/public`));
// Motor de plantillas
app.engine('handlebars', engine({
    handlebars:Handlebars
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);


//socket io
io.on('connection', (socket) => { // Escuchamos el evento connection por nuevas conexiones de clientes
    console.log(`Cliente conectado (${socket.id})`); 

    socket.emit('server_confirm', 'Conexión recibida');
    
    socket.on('new_card', (data) => {;
        io.emit('new_card', data); // io.emit realiza un broadcast (redistribución) a TODOS los clientes, incluyendo el que lo generó
    });   

});

//mongodb
try {    
    await mongoose.connect(MONGOOSE_URL);

    app.listen(PORT, () => {
        console.log(`Servidor iniciado en puerto ${PORT}`);
    });
} catch(err) {
    console.log('No se puede conectar con el servidor de bbdd');
}
