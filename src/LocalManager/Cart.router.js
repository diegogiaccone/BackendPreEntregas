/* import Express from "express";
import CartManager from "../router/Cart.dbclass.js";

const CartRouter = Express.Router();
const carts = new CartManager

CartRouter.post("/", async (req, res) => {    
    res.send(await carts.addCarts())
})

CartRouter.get(`/`, async (req, res) => {
    let carts = await carts.readCarts()
    res.send(carts)
})

CartRouter.get("/:cid", async (req, res) => {    
    let id = req.params.cid;     
    const cartById = await carts.getCartsById(id);
    cartById ? res.send(cartById) : res.send(`El producto no existe`) 
});

CartRouter.post (`/`), async (req, res) =>{
    await carts.createCart(req.body);
}


CartRouter.post(`/:cid/products/:pid`, async (req, res) => {
    let cartId = req.params.cid
    let productId = req.params.pid
    res.send(await carts.addProductInCart(cartId, productId))
})
 


export default CartRouter */