import Express from 'express';
import Router from './router/Products.router.js';
import cartRouter from './router/Cart.router.js';

const server = Express();
const puerto = 8080;

server.use(Express.json());
server.use(Express.urlencoded({ extended: true })); 
server.use(`/api/products`, Router);
server.use(`/api/carts`, cartRouter);

 
server.listen(puerto, () => {
    console.log(`Servidor iniciado en el puerto ${puerto}`);

});



