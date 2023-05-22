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



const PORT = parseInt(process.env.PORT) || 3000;
const MONGOOSE_URL = process.env.MONGOOSE_URL;

const wspuerto = 9090;

const app = express();

const httpServer = app.listen(wspuerto, () =>{
    console.log(`Servidor API/Socket.io iniciando en puerto ${wspuerto}`)
}) 

/* let users = []; */
const io = new Server(httpServer, { cors: { origin: "*", methods: ["PUT", "GET", "POST", "DELETE", "OPTIONS"], credentials: false }});

// Parseo correcto de urls
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// end points
app.use('/', UserRoutes(io));
app.use('/api', productRoutes(io));
app.use(`/api/carts`, CartRouter);
app.use(`/chat`, chatRoutes(io))

app.use('/public', express.static(`${__dirname}/public`));

// Motor de plantillas
app.engine('handlebars', engine({
    handlebars:Handlebars
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