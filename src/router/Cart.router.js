import Express from "express";
import CartManager from "../Manager/CartManager.js";

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

CartRouter.post(`/:cid/products/:pid`, async (req, res) => {
    let cartId = parseInt(req.params.cid)
    let productId = parseInt(req.params.pid)
    res.send(await carts.addProductInCart(cartId, productId))
})
 


export default CartRouter