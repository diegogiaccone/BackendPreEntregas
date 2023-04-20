import fs from "fs";

export default class ProductManager {
    static id = 0
    constructor (){
        this.path = `./products.json`;        
    }

    addProduct = async (title, description, price, thumbnail, code, stock, category, status) => {
        try{
            ProductManager.id++ 
            this.products.push({
                title, 
                description, 
                price, 
                thumbnail, 
                code, 
                stock,                
                category, 
                status:true,
                id:ProductManager.id});        
            } catch(err) {
                console.log(err);        
            }
            await fs.promises.writeFile(this.path, JSON.stringify(this.products));            
    }
    
    getProducts = async ()  => {
        try{
            const productos = await fs.promises.readFile(this.path, `utf-8`);                  
            return JSON.parse(productos);        
        }catch (err){            
            console.log(err);
        }
    }

    getProductsById = async (id) => {
        let productos = await this.getProducts();
        try{
            const objeto = productos.find(producto => producto.id == id);
            return objeto;
        }catch (err){
            console.log(err);
        }                
    }
    
    deleteProduct = async (id) => {
        let borrarProductoid = await this.getProducts();
        let productFilter = borrarProductoid.filter(products => products.id !== id)
        await fs.promises.writeFile(this.path, JSON.stringify(productFilter));
    }

             
    updateProduct = async (id, products) => {
        let productById = await this.getProducts(id);
        if(!productById) return "Not found product"
        else await this.deleteProduct(id);
        let actualizacion = [
            {...products, id : id}, ...productById
        ];
        await fs.promises.writeFile(this.path, JSON.stringify(actualizacion));
    }

}




