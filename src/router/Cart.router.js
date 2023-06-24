import { Router } from "express";
import CartManager from "./Cart.dbclass.js";
import cartModel from "./Cart.model.js";
import mongoose from "mongoose";
import productModel from "./products.model.js";



const cartRoutes = (io) => {
const CartRouter = Router();
const manager = new CartManager();

//CartRouter.get('/carts', async);    


CartRouter.get('/carts', manager.productsInCart);   

CartRouter.get('/carts/:id', async (req, res) => {
    try {
        const carts = await manager.getCartPopulated(req.params.id);
        res.status(200).send({ status: 'OK', data: carts });
    } catch (err) {
        res.status(500).send({ status: 'err', error: err.message });
    }
})

   
CartRouter.post('/carts/:cid/products/:pid', async (cid, pid) => {
    try {
        await manager.addProductInCart(cid, pid);        
    } catch (err) {
       console.log(err)
    }})


CartRouter.post('/carts', async (req, res) => {
    try {        
        // Verificar que se reciba en el body un array con al menos un producto,
        // recién ahí llamar al método addCart
        const products_array = req.body;
        if (!Array.isArray(products_array.products)) {
            res.status(400).send({ status: 'ERR', message: 'El body debe contener un array products con al menos un producto' });
        } else {
            const process = await manager.addCart(products_array);
            res.status(200).send({ status: 'OK', data: process });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
});

CartRouter.delete('/carts/:cid/products/:pid', async (cid, pid) => {
    try {        
        await manager.deleteCartProduct(cid, pid)

        if (manager.checkStatus() === 1) {
            console.log({ status: 'OK', msg: 'Producto quitado del carrito' });
        } else {
            console.log({ status: 'ERR', error: 'No se pudo quitar el producto en el carrito.' });
        }
    } catch (err) {
        console.log({ status: 'ERR', error: err.message });
    }
});

 
CartRouter.delete('/carts/:cid', async (cid) => {
    try {
        await manager.emptyCart(cid);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Carrito Vaciado' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo vaciar el carrito.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
});


CartRouter.put('/carts/:id', async (req, res) => {
    try {
        // tiene que pasarse un id y un body con el objeto del nuevo producto, verificar eso
        const product = req.body;
        await manager.updateCart(req.params.id, product);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Producto agregado al carrito' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo agregar el producto al carrito.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
})

CartRouter.put('/carts/:cid/products/:pid/:qty', async (req, res) => {
    try {
        await manager.updateProductQty(req.params.cid, req.params.pid, req.params.qty);

        if (manager.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Cantidad de producto actualizada' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo actualizar cantidad de producto.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
    
    
    try {
        const updateProductQty = await manager.updateProductQty(req.params.cid, req.params.pid, req.body)
        res.status(200).send(updateProductQty)


    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err })
    }
})

return CartRouter

}

export default cartRoutes