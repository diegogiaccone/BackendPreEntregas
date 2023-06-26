/* import fs from "fs";
import ProductManager from "./ProductManager.js";

const productAll = new ProductManager

export default class CartManager {
    static id = 0
    constructor(){        
        this.path = `./carts.json`;        
    }

    readCarts = async () => {
        let carts = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    }

    writeCarts = async (cart) => {
        await fs.promises.writeFile(this.path, JSON.stringify(cart));
    }

    exist = async (id) => {
        let carts = await this.readCarts();
        return carts.find(cart => cart.id === id)
    }

 



    addCarts = async () => {        
        let OldCarts = await this.readCarts();   
        CartManager.id++     
        let cartsConcat = [{id:CartManager.id, products : []}, ...OldCarts]
        await this.writeCarts(cartsConcat)
        return "Producto Agregado"
    }

    getCartsById = async (id) => {        
        let cartById = await this.exist(id);
        if(!cartById) return "Carrito no encontrado"
        return cartById
    }

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId);
        if(!cartById) return "Carrito no encontrado"
        let productById = await productAll.exist(productId)
        if(!productById) return "Producto no encontrado"
        let cartsAll = await this.readCarts();
        let cartFilter = cartsAll.filter(cart => cart.id != cartId)
        if(cartById.products.some(prod => prod.id === productId)){
            let productInCart = cartById.products.find(prod => prod.id === productId)
            productInCart.cantidad++
            let cartsConcat = [cartById, ...cartFilter]
            await this.writeCarts(cartsConcat)
            return "Producto Sumado al carrito"
        }
        let cartsConcat = [{id:cartId, products : [{id:productById.id, cantidad: 1}]}, ...cartFilter]
        await this.writeCarts(cartsConcat)
        return "Producto Agregado al carrito"
    }
} */