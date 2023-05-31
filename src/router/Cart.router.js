import Express from "express";
import CartManager from "./Cart.dbclass.js";
import productModel from "./products.model.js";
import cartModel from './Cart.model.js';

const CartRouter = Express.Router();
const carts = new CartManager


CartRouter.get('/carts', async (req, res) => {
    try {
        const carts = await carts.getCarts();
        res.status(200).send({ status: 'OK', data: carts });
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
});

CartRouter.get('/carts/:id', async (req, res) => {
    try {
        const carts = await carts.getCartPopulated(req.params.id);
        res.status(200).send({ status: 'OK', data: carts });
    } catch (err) {
        res.status(500).send({ status: 'err', error: err.message });
    }
})

CartRouter.post('/carts', async (req, res) => {
    try {
        // Verificar que se reciba en el body un array con al menos un producto,
        // recién ahí llamar al método addCart
        const products_array = req.body;
        if (!Array.isArray(products_array.products)) {
            res.status(400).send({ status: 'ERR', message: 'El body debe contener un array products con al menos un producto' });
        } else {
            const process = await carts.addCart(products_array);
            res.status(200).send({ status: 'OK', data: process });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
});

CartRouter.delete('/carts/:id/products/:pid', async (req, res) => {
    try {
        await carts.deleteCartProduct(req.params.id, req.params.pid);

        if (carts.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Producto quitado del carrito' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo quitar el producto en el carrito.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
});

CartRouter.delete('/carts/:id', async (req, res) => {
    try {
        await carts.emptyCart(req.params.id);

        if (carts.checkStatus() === 1) {
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
        await carts.updateCart(req.params.id, product);

        if (carts.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Producto agregado al carrito' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo agregar el producto al carrito.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
})

CartRouter.put('/carts/:id/products/:pid/:qty', async (req, res) => {
    try {
        await carts.updateProductQty(req.params.id, req.params.pid, req.params.qty);

        if (carts.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: 'Cantidad de producto actualizada' });
        } else {
            res.status(400).send({ status: 'ERR', error: 'No se pudo actualizar cantidad de producto.' });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err.message });
    }
    
    
    try {
        const updateProductQty = await carts.updateProductQty(req.params.cid, req.params.pid, req.body)
        res.status(200).send(updateProductQty)


    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err })
    }
})



export default CartRouter