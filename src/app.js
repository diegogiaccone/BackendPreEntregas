import express from 'express';
import MongoSingleton from './services/mongo.dbclass.js';
import productRoutes from './router/products.router.js';
import UserRoutes from './router/user.router.js';
import { __dirname} from './utils.js';
import { engine } from 'express-handlebars';
import Handlebars from 'handlebars';
import { Server } from 'socket.io';
import cartRoutes from './router/Cart.router.js';
import chatRoutes from './router/chat.router.js';
import chatModel from './model/chat.model.js';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mainRoutes from './router/main.router.js';
import createRol from './services/rol.dbclass.js';
import passport from 'passport';
import initializePassport from './auth/passport.config.js'
import sessionRoutes from './router/session.router.js'
import { initPassport } from './auth/passport.jwt.js';
import methodOverride from 'method-override';
import config from './config/config.env.js';
import ticketRoutes from './router/ticket.router.js';



const PORT = config.PORT;
const MONGOOSE_URL = config.MONGOOSE_URL;
const SECRET = config.SECRET;
export const BASE_URL = config.BASE_URL;
export const PRODUCTS_PER_PAGE = config.PRODUCTS_PER_PAGE;
const wspuerto = config.WSPORT;

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

//metodo overRide
app.use(methodOverride('_method'))

//parseo de cookies
app.use(cookieParser());

//manejo de sesiones
export const store = MongoStore.create({ mongoUrl: MONGOOSE_URL, mongoOptions: {}, ttl: 3600});
app.use(session({
    store: store,
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))

//sessiones de passport
initializePassport();
initPassport();
app.use(passport.initialize());
app.use(passport.session());

// end points
app.use('/', mainRoutes(io, store, BASE_URL, PRODUCTS_PER_PAGE));
app.use('/', UserRoutes(io));
app.use('/api', productRoutes(io));
app.use(`/api`, cartRoutes(io));
app.use(`/chat`, chatRoutes(io))
app.use(`/api`, ticketRoutes());
app.use('/', sessionRoutes());

// Plantillas estaticas
app.use('/public', express.static(`${__dirname}/public`));

// Motor de plantillas
app.engine('handlebars', engine({
    handlebars:Handlebars,
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    helpers:{
        math: function(lvalue, operator, rvalue) {
            lvalue = parseFloat(lvalue);
            rvalue = parseFloat(rvalue);
            return {
                "+": lvalue + rvalue,
                "-": lvalue - rvalue,
                "*": lvalue * rvalue,
                "/": lvalue / rvalue,
                "%": lvalue % rvalue
            }[operator];
        }
    }
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
  
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
    }); 

});

io.on('connection', (socket) => { // Escuchamos el evento connection por nuevas conexiones de clientes
    console.log(`Cliente conectado (${socket.id})`);
    
    // Emitimos el evento server_confirm
    socket.emit('server_confirm', 'Conexión recibida');
    
    socket.on('new_product_in_cart', (data) => {        
        io.emit('product_added_to_cart', data);
    });
    
    socket.on("disconnect", (reason) => {
        console.log(`Cliente desconectado (${socket.id}): ${reason}`);
    });
});

//mongodb
try {   
    //MongoSingleton.getInstance()
    app.listen(PORT, () => {
        console.log(`Servidor iniciado en puerto ${PORT}`);
    });
} catch(err) {
    console.log('No se puede conectar con el servidor de bbdd');
}