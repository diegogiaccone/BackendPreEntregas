import Express from "express";
import CartManager from "../Manager/CartManager.js";

const CartRouter = Express.Router();
const carts = new CartManager

CartRouter.post("/", async (req, res) => {
    res.send(await carts.addCarts())
})

CartRouter.get(`/`, async (req, res) => {
    res.send(await carts.readProducts())
})

CartRouter.get(`/:cid`, async (req, res) => {
    res.send(await carts.getCartsById(req.params.cid))
})

CartRouter.post(`/:cid/products/:pid`, async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    res.send(await carts.addProductInCart(cartId, productId))
})



export default CartRouter