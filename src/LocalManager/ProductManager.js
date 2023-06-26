/*import fs from "fs";
import { nanoid } from "nanoid";
import userMdodel from "../router/products.model.js";

export default class ProductManager {          
    constructor (){
        this.path = `./products.json`;            
    }

    readProducts = async () => {
        let products = await fs.promises.readFile(this.path, "utf-8");
        return JSON.parse(products);
    }

    writeProducts = async (products) => {
        await fs.promises.writeFile(this.path, JSON.stringify(products));
    }

    exist = async (id) => {
        let products = await this.readProducts();
        return products.find(prod => prod.id === id)
    }


    addProduct = async (products) => {
        let productOld = await this.readProducts();
        products.status = true         
        products.id = nanoid(5) 
        let productAll = [...productOld, products];
        await this.writeProducts(productAll) 
        return console.log(`producto agregado`)          
    }
    
    getProducts = async ()  => {
        return await this.readProducts(); 
        return await userMdodel.find();
    }

    getProductsById = async (id) => {        
        let productById = await this.exist(id)
        if(!productById) return "Producto No encontrado"
        return productById
    }
    
    deleteProduct = async (id) => {
        let products = await this.readProducts();
        let existProducts = products.filter(prod => prod.id === id)
        if(existProducts) {
            let filterProducts = products.filter(prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "producto eliminado"
        }
        return "el producto no existe"        
    }

             
    updateProduct = async (id, products) => {
        let productById = await this.exist(id);
        if(!productById) return "Not found product"
        await this.deleteProduct(id);
        let productOld = await this.readProducts();
        let actualizacion = [{...products, id : id}, ...productOld
        ];
        await this.writeProducts(actualizacion);
        return "Producto Actualizado"
    }

}*/




