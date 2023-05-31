import mongoose from 'mongoose';
import cartModel from './Cart.model.js';
import productModel from './products.model.js';


export default class CartManager {
    static id = 0
    constructor(){       
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    checkStatus = () => {
        return this.status;
    }

    showStatusMsg = () => {
        return this.statusMsg;
    }

    readCarts = async () => {
        const carts = await cartModel.find();
        return carts;
    }

    writeCarts = async (cart) => {
        await cartModel.create(cart);
    }

    exist = async (id) => {
        let carts = await this.readCarts(id);
        return carts.find(cart => cart.id === id)
    }

    createCart = async (req,res) => {
        let newCart = await cartModel.create(req.body)
        return console.log(newCart)
    }

    addCarts = async () => {        
        let OldCarts = await cartModel.find();             
        let cartsConcat = [{id:CartManager.id, products : []}, ...OldCarts]
        await cartModel.create(cartsConcat)
        return "Producto Agregado"
    }

    getCarts = async () => {
        try {
            const carts = await cartModel.find();
            this.status = 1;
            this.statusMsg = 'Carritos recuperados';
            return carts;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getCarts: ${err}`;
        }
    }

    getCartsById = async (req, res) => {        
        const cartById = await cartModel.findOne(req.body);
        if(!cartById) return "Carrito no encontrado"
        return cartById 
    }

    addProductInCart = async (req, res) => {
        try {
            let cid = req.params.cid
            let pid = req.params.pid                                            
            let process = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)})/* .populate('products.prods');   */    
            if(!process) return "Carrito no encontrado"            
            let product = await productModel.findOne({'_id': new mongoose.Types.ObjectId(pid)});        
            if(!product) return "Producto no encontrado"
            let validarProd = process.products.find(prod => prod.prods == pid)
                          
        
            if (validarProd) {
                validarProd.quantity +=1               
            }else{                
                process.products.push({prods: product})}

                console.log(JSON.stringify(process, null, '\t'));            
                 
            let result = await cartModel.updateOne(process)
            console.log('resultado del carrito');
            console.log(JSON.stringify(process, null, '\t'));
        
            res.send(result)
        
        } catch (error) {
            console.error("No se pudo agregar producto al carrito " + error);
            res.status(500).send({error: "No se pudo agregar producto al carrito", message: error});
        } 
    }

    updateProductQty = async (id, pid, new_product_quantity) => {
        try {
            const carts = await cartModel.findOneAndUpdate(
                { _id: id, 'products.pid': pid },
                { $set: { 'products.$.qty': new_product_quantity }},
                { new: true }
            );

            this.status = 1;
            this.statusMsg = 'Cantidad de producto actualizada en carrito';
            return process;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateProductQty: ${err}`;
        }
    }

    updateCart = async (id, new_product) => {
        try {
            const cart_updated = await cartModel.findOneAndUpdate(
                { _id: id },
                { $push: { products: new_product }},
                { new: true }
            );
            
            this.status = 1;
            this.statusMsg = 'Carrito actualizado';
            return cart_updated;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateCart: ${err}`;
        }
    }


    getCartPopulated = async (id) => {
        try {
            // Se realiza el populate del array products en el carrito, en base al productModel
            // Atención, recordar importar el productModel arriba!
            const cart = await cartModel.find({ _id: new mongoose.Types.ObjectId(id) }).populate({ path: 'products.prods', model: productModel });
            // Alternativamente se puede mantener acá la consulta base y utilizar el middleware pre en el archivo carts.model.js
            // const cart = await cartModel.find({ _id: new mongoose.Types.ObjectId(id) });
            this.status = 1;
            this.statusMsg = 'Carrito recuperado';
            return cart;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getCarts: ${err}`;
        }
    }

    emptyCart = async (id) => {
        try {
            // Simplemente seteamos el array products a vacío []
            const process = await cartModel.findOneAndUpdate(
                new mongoose.Types.ObjectId(id),
                { $set: { products: [] }
            });

            // Agregar lógica para verificar process y chequear si realmente hubo rows afectados
            this.status = 1;
            this.statusMsg = 'Carrito vaciado';
            return process;
        } catch (err) {
            return false;
        }
    }

    deleteCartProduct = async (id, pid) => {
        try {
            const process = await cartModel.findByIdAndUpdate(
                new mongoose.Types.ObjectId(id),
                { $pull: { products: { pid: new mongoose.Types.ObjectId(pid) }}},
                { new: true }
            )

            // Agregar lógica para verificar process y chequear si realmente hubo rows afectados
            console.log(process);
            this.status = 1;
            this.statusMsg = 'Producto quitado del carrito';
            return process;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteCartProduct: ${err}`;
        }
    }
}
    


