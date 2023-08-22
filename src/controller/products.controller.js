import userModel from "../model/user.model.js";
import factoryProduct from "../services/factory.js";

const manager = new factoryProduct();

export const validate = async (req, res, next) => {
    if (req.session.userValidated) {
        next();
    } else {
        res.status(401).send({ status: 'ERR', error: 'No tiene autorización para realizar esta solicitud' });
    }
    }

export const getUpdate = async (req, res) => {
        const prod = req.body               
        const products = await manager.getProductById(prod.id);              
        const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)
        const name = userObjet.name 
        const pass = userObjet.pass
        const rol = userObjet.rol[0].name
        const isAdmin = rol === "Admin" ? true : false; 
        const isPremium = rol === "Premium" ? true : false;
        const avatar = userObjet.avatar   
        const existPass = pass === undefined ? false : true                            
        res.render('update', {
            products: products, name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass, isPremium: isPremium, user: userObjet});
    }

export const getProductsIndex = async (req, res) => {
        const products = await manager.getProducts();
        const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)
        const user = req.session.user.user
        const name = userObjet.name 
        const pass = userObjet.pass        
        const rol = userObjet.rol[0].name
        const isAdmin = rol === "Admin" ? true : false; 
        const isPremium = rol === "Premium" ? true : false;
        const avatar = userObjet.avatar
        const existPass = pass === undefined ? false : true                          
        res.render('products_index', {
            products: products, name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass, user: user, isPremium: isPremium});
    };

export const getProducts = async (req, res) => {          
        try {                 
            const products = await manager.getProducts(); 
            res.status(200).send({ status: 'OK', payload: products });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    };
    
export const addProduct = async (req, res) => {
        try {
            await manager.addProduct(req.body);                
            if (manager.checkStatus() === 1) {
                res.redirect(`products_index`);
               
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    };
    
export const updateProduct = manager.updateProduct

export const deleteProduct = manager.deleteProduct



