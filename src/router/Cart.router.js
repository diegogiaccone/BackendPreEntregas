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

CartRouter.delete(`api/carts/:cid `, async (req,res) =>{
    const cid = req.params
    let cart = await cartModel.findById(cid).populate('products_prods')
    let itemRemove = await cart.products.find(prod => prod.prods == cid)
    await cart.products.pull(itemRemove)
    await cart.save()
})

CartRouter.delete(`/:cid/products/:pid`, async (req, res) =>{
    try {
    const {cid, pid} = req.params

    let cart = await cartModel.findById(cid).populate('products_prods')
    console.log(cart.products);

    let itemRemove = await cart.products.find(prod => prod.prods == pid)
    console.log(itemRemove);
    
    await cart.products.pull(itemRemove)
    await cart.save()

    res.send(cart)
    } catch (error) {
        console.error("No se pudo borrar el producto deseado " + error);
        res.status(500).send({error: "No se pudo borrar el producto", message: error});
    }    
})

CartRouter.put(`:cid`, async (req, res) => {
    try {        
        await carts.updateCart(req.params.cid, req.body);
    
        if (carts.checkStatus() === 1) {
            res.status(200).send({ status: 'OK', msg: carts.showStatusMsg() });
        } else {
            res.status(400).send({ status: 'ERR', error: carts.showStatusMsg() });
        }
    } catch (err) {
        res.status(500).send({ status: 'ERR', error: err });
    }
})
 
CartRouter.put(`:cid/products/:pid`, carts.updateProductInCart)



export default CartRouter