import Express from "express";
import CartManager from "./Cart.dbclass.js";
import productModel from "./products.model.js";
import cartModel from './Cart.model.js';

const CartRouter = Express.Router();
const carts = new CartManager

CartRouter.post("/", async (req, res) => {    
    res.send(await carts.addCarts())
})

CartRouter.get(`/`, async (req, res) => {
    res.send(await carts.readCarts())
})

CartRouter.get("/:cid", async (req, res) => {    
    let id = parseInt(req.params.cid);     
    const productById = await carts.getCartsById(id);
    productById ? res.send(productById) : res.send(`El producto no existe`) 
});


CartRouter.post(`/:cid/products/:pid`, carts.addProductInCart)
 


export default CartRouter