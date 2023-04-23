import fs from "fs";

export default class ProductManager {
    static id = 0
    constructor (){
        this.path = `./products.json`;  
        this.products = []      
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


    addProduct = async (title, description, price, thumbnail, code, stock, category, status) => {
        let productOld = await this.readProducts();
        ProductManager.id++ 
        let productAll = [...productOld, this.products.push({
            title, 
            description, 
            price, 
            thumbnail, 
            code, 
            stock,                
            category, 
            status:true,
            id:ProductManager.id})]
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));           
    }
    
    getProducts = async ()  => {
        return await this.readProducts();
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

}




