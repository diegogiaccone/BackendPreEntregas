import mongoose from 'mongoose';
import cartModel from '../model/Cart.model.js';
import productModel from '../model/products.model.js';
import userModel from '../model/user.model.js';
import ticketModel from '../model/ticket.model.js';
import { nanoid } from 'nanoid';

export default class TicketManager {
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

    getTickets = async () => {
        try {
            const carts = await ticketModel.find();                  
            this.status = 1;
            this.statusMsg = 'Carritos recuperados';
            return carts;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getCarts: ${err}`;
        }
    }

    getTicketsById = async (req, res) => {        
        const cartById = await ticketModel.findOne(req.body);
        if(!cartById) return "Carrito no encontrado"
        return cartById 
    }
 

    creatTicket = async (req, res) => {
        try {                                        
            const cid = req.body.cid 
            const tid = req.session.user.ticket[0]
            const tickets = await ticketModel.findOne({ '_id': new mongoose.Types.ObjectId(tid)})                                                                        
            const process = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)}).populate(`products.prods`)                                
            if(!process) return "Carrito no encontrado"                      
            if(process.products.length >= 1){           
                process.products.forEach(element => {                 
                    element.prods.forEach(async (e) => {
                        const itemUpdate = await productModel.findById({_id: e._id})
                        if(itemUpdate.stock >= element.quantity){                            
                            await productModel.findOneAndUpdate(                            
                                { _id: e._id },
                                { $set: {stock: itemUpdate.stock - element.quantity}},
                                { new: true }
                                )
                                
                            }else{                               
                                console.log("no se pudo realizar la compra devido a falta de stock en uno de tus productos")
                            }
                        })                       
                    });             
                    const Total = process.products.reduce(function Total(accumulator, item){
                        const toNumber = parseFloat(item.prods[0].price * item.quantity);                                                         
                        return accumulator + toNumber;                             
                      },0);      
                        const date = new Date().toString()                               

                        const newTicket = {
                            tickets: process.products,
                            code: nanoid(),
                            purchase_datetime: date,
                            purchaser:req.session.user.user,
                            total: Total
                        }

                        tickets.purchase.push(newTicket)
                        await ticketModel.findOneAndUpdate({_id: tid},{$set: tickets}, { new: true })                               
                        this.emptyCart(cid);
                    }     
        
        } catch (error) {
            console.error("No se pudo agregar producto al carrito " + error);           
        } 
    }

    ticketsInCart = async (req, res) => {
        
        try {           
                const ticketUser = await (req.session.user.ticket)                                          
                const process = await ticketModel.findOne({ '_id': new mongoose.Types.ObjectId(ticketUser[0])})                                                              
                const products = process.purchase.map(prods => prods.tickets) 
                console.log("esto es products",products)                                        
                const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)                
                const avatar= userObjet.avatar               
                const name = userObjet.name
                const pass = userObjet.pass
                const existPass = pass === undefined ? false : true
                const rol = userObjet.rol[0].name                                    
                                                    
                res.render(`tickets`, {
                    ticket: products,                                                       
                    name:name, 
                    rol: rol, 
                    cart: req.session.user.cart[0],                   
                    avatar: avatar,
                    pass: existPass 
                })
            } catch (err) {
                res.status(500).send({ status: 'ERR', error: err });            
        }}
    
    emptyCart = async (cid) => {
        try {
            const cid2 = await (cid)           
            const process = await cartModel.findOneAndUpdate( 
                { _id: cid2 },               
                { $set: { products: [] }});            
            this.status = 1;
            this.statusMsg = 'Carrito vaciado';
            return process;
        } catch (err) {
            return false;
        }
    }
    

    ticketPurchase = async (req, res) => {   
        try {                       
            const cid = await (req.session.user.cart[0]) 
            const pid = req.body                    
            const process = await cartModel.findOne({ '_id': new mongoose.Types.ObjectId(cid)})           
            if(!process) return "Carrito no encontrado"          
            const validarProd = process.products.find(prod => prod.prods[0]._id == pid.id)                                   
            if (validarProd) {
                const result = await cartModel.findOneAndUpdate(
                    { _id: cid,},
                    { $pull: { products: { prods: new mongoose.Types.ObjectId(pid.id)}}},
                    { new: true }
                )           
                console.log(result)               
            }else{               
                console.log(process)                        
            }                
            
            res.redirect(`/api/carts`)           
            //res.send(this.statusMsg = 'Producto quitado del carrito')                        
            this.status = 1;
            this.statusMsg = 'Producto quitado del carrito';
            return process;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteCartProduct: ${err}`;
        }
    }
    
}
    


