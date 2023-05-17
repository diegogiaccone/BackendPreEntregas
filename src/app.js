import {} from 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './router/products.routes.js';
import UserRoutes from './users/user.routes.js';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;

const wspuerto = 9090;

const app = express();

const httpServer = app.listen(wspuerto, () =>{
    console.log(`Servidor API/Socket.io iniciando en puerto ${wspuerto}`)
}) 

let users = [];
const io = new Server(httpServer, { cors: { origin: "*", methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"], credentials: false }});

// Parseo correcto de urls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* app.use(`/`, userRoutes) */
app.use('/', UserRoutes(io));
app.use('/api', productRoutes(io));
app.use (cookieParser())
app.use (function(req, res, next){
    if(!req.user)
    res.header(`Cache-Control`, `private`, `no-cache`,`no-store`, `must-revalidate`);
    next();
})

app.use('/public', express.static(`${__dirname}/public`));

// Motor de plantillas
app.engine('handlebars', engine({
    handlebars:Handlebars
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);


//socket io
io.on('connection', (socket) => {
    console.log(`Cliente conectado (${socket.id})`);

    //al recibir el msj recojemos los datos
    socket.on(`enviar mensaje`, (datos) =>{
        //console.log(datos)
        io.emit(`nuevo mensaje`, {
            msg:datos,
            usuario: socket.nickName
        })
    })

    socket.on(`nuevo usuario`, (datos, cback) =>{
        if (users.indexOf(datos) != -1){
            cback(false);
        }else{
            cback(true)
            socket.nickName = datos;
            users.push(socket.nickName)
            io.emit(`nombre usuario`, users);
        }        
    })

    socket.on(`disconnect`, (datos) =>{
        if(!socket.nickName){
            return;
        }else{
            users.splice(users.indexOf(socket.nickName), 1);
            io.emit(`nombre usuario`, users)
        }
    })
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
