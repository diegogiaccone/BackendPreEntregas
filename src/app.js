import Express from 'express';
import Router from './router/Products.router.js';
import cartRouter from './router/Cart.router.js';
import RealTimeRouter from './router/RealTime.router.js';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import path from "path";


const puerto = 8080;
const wsPuerto = 9090; 

const server = Express();
 const httpServer = server.listen(wsPuerto, () =>{
    console.log(`Servidor socket io iniciando en puerto ${wsPuerto}`)
}) 
 
const io = new Server(httpServer, { cors: { origin: "http://localhost:8080" }});

server.use(Express.json());
server.use(Express.urlencoded({ extended: true })); 

//endpoints
server.use(`/realtimeproducts`, RealTimeRouter)
server.use(`/api/products`, Router);
server.use(`/api/carts`, cartRouter);

//contenidos estaticos
server.use(`/public`, Express.static(`${__dirname}/public`))


//Motor de plantillas
server.engine('handlebars', engine());
server.set('view engine', 'handlebars');
server.set('views', path.resolve(__dirname +'/views'));

server.listen(puerto, () => {
    console.log(`Servidor base API iniciado en el puerto ${puerto}`);

});

//eventos socket.io

io.on('connect', (socket) => { 
    console.log(`Cliente conectado (${socket.id})`);    
    
    socket.on('event_cl01', (msg) => {
        console.log(msg);
    }); 
});

    //formulario 

    /* socket.on (`post`, (products)=>{
        io.emit(`post_recived`, products);       
    })  */    

/* server.get(`/`, (req, res) => {
    res.render(`index`, {
        user: users[indiceransom],
        isAdmin: users[indiceRandom].rol === `admin`
    });
}) */

//{{#if isAdmin}} {{/if}}
