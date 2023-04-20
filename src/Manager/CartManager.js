import fs from "fs";
import ProductManager from "./ProductManager.js";

const productAll = new ProductManager

export default class CartManager {
    static id = 0
    constructor(){        
        this.path = `./carts.json`;        
    }

    readProducts = async () => {
        let carts = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(carts);
    }

    writeProducts = async (cart) => {
        await fs.promises.writeFile(this.path, JSON.stringify(cart));
    }

    exist = async (id) => {
        let carts = await this.readProducts();
        return carts.find(cart => cart.id === id)
    }

    addCarts = async () => {        
        let OldCarts = await this.readProducts();   
        CartManager.id++     
        let cartsConcat = [{id:CartManager.id, products : []}, ...OldCarts]
        await this.writeProducts(cartsConcat)
        return "Producto Agregado"
    }

    getCartsById = async (id) => {
        let productos = await this.readProducts();
        try{
            const objeto = productos.find(producto => producto.id === id);
            return objeto;
        }catch (err){
            console.log(err);
        }   
    }

    addProductInCart = async (cartId, productId) => {
        let cartById = await this.exist(cartId)
        if(!cartById) return "Carrito not found"
        let productById = await productAll.exist(productId)
        if(!productById) return "not found"
        let cartsAll = await this.readProducts()
        let cartFilter = cartsAll.filter (cart => cart.id != cartId)
        if (cartById.products.some(prod => prod.id === productId)){
            let productInCart = cartById.products.find(prod => prod.id === productId)
            productInCart.cantidad++
            let cartsConcat = [productInCart, ...cartFilter]
            await this.writeProducts(cartsConcat)
            return "Producto agregado al carrito"
        }
        cartById.products.push({id: productById.id, cantidad : 1})
        let cartsConcat = [cartById, ...cartFilter]
        await this.writeProducts(cartsConcat)
        return "Producto cargado"
    }


}