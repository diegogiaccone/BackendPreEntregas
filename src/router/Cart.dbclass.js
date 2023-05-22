import mongoose from 'mongoose';
import cartModel from './Cart.model.js';
import Products from './products.dbclass.js';
import productModel from './products.model.js';


const productAll = new Products
const ObjectId = new mongoose.Types.ObjectId() 

export default class CartManager {
    static id = 0
    constructor(){       
        this.status = 0;
        this.statusMsg = "inicializado";
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
}

