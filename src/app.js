import {} from 'dotenv/config'
import express from 'express';
import mongoose from 'mongoose';
import productRoutes from './router/products.routes.js';
import UserRoutes from './users/user.routes.js';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { Server } from 'socket.io';
import CartRouter from './router/Cart.router.js';
import chatRoutes from './chat/chat.routes.js';
import chatModel from './chat/chat.model.js';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mainRoutes from './public/js/main.routes.js';
import createRol from './users/rol.dbclass.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js'
import sessionRoutes from './github/session.router.js'


const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;
const SECRET = process.env.SECRET;
const BASE_URL = `http://localhost:${PORT}`;
const PRODUCTS_PER_PAGE = 4;

const wspuerto = 9090;

const app = express();
createRol();

const httpServer = app.listen(wspuerto, () =>{
    console.log(`Servidor API/Socket.io iniciando en puerto ${wspuerto}`)
}) 

/* let users = []; */
const io = new Server(httpServer, { cors: { origin: "*", methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"], credentials: false }});

// Parseo correcto de urls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//parseo de cookies

app.use(cookieParser());

//manejo de sesiones
const store = MongoStore.create({ mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl: 3600});
app.use(session({
    store: store,
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))

//sessiones de passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// end points
app.use('/', mainRoutes(io, store, BASE_URL, PRODUCTS_PER_PAGE));
app.use('/', UserRoutes(io));
app.use('/api', productRoutes(io));
app.use(`/api/carts`, CartRouter);
app.use(`/chat`, chatRoutes(io))
app.use('/', sessionRoutes());


app.use('/public', express.static(`${__dirname}/public`));

// Motor de plantillas
app.engine('handlebars', engine({
    handlebars:Handlebars,
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/views`);


//socket io
// Abrimos el canal de comunicacion

io.on('connection', (socket) => {
   const emitNotes = async () =>{
       const notes = await chatModel.find()  
       io.emit(`loadnotes`, notes)     
    }   
    emitNotes()

    socket.on(`newnote`, async data =>{
        const newNote = new chatModel(data)
        const saveNote = await newNote.save()
        socket.emit(`serverNewnote`, saveNote)
    })

    socket.emit('server_confirm', 'Conexión recibida');

    socket.on('new_product_in_cart', (data) => {;
        // io.emit realiza un broadcast (redistribución) a TODOS los clientes, incluyendo el que lo generó
        io.emit('product_added_to_cart', data);
    });
    
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
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