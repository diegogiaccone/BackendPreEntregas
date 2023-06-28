import { Router } from "express";
import { addProductInCart, deleteCartProduct, emptyCart, getCartPopulated, productsInCart, updateCart, updateProductQty } from "../controller/Cart.controller.js";

const CartRouter = Router();

const cartRoutes = (io) => {

    CartRouter.get('/carts', productsInCart); 

    CartRouter.get('/carts/:id', getCartPopulated)
   
    CartRouter.post('/carts/:cid/products/:pid', addProductInCart)

    CartRouter.delete('/carts/:cid/products/:pid', deleteCartProduct);
 
    CartRouter.delete('/carts/:cid', emptyCart);

    CartRouter.put('/carts/:id', updateCart)

    CartRouter.put('/carts/:cid/products/:pid/:qty', updateProductQty)

return CartRouter

}

export default cartRoutes