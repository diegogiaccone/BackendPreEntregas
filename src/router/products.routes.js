import { Router } from "express";
import Products from "./products.dbclass.js";
import Rol from "../users/isAdmin.dbclass.js";
import userModel from "../users/user.model.js";
import { authentication } from "../Passport.config/passport.jwt.js";
import { authorization } from "../Passport.config/passport.jwt.js";
import {} from 'dotenv/config'


const router = Router();
const manager = new Products();
const rol = new Rol();


const productRoutes = (io) => {
    const validate = async (req, res, next) => {
        if (req.session.userValidated) {
            next();
        } else {
            res.status(401).send({ status: 'ERR', error: 'No tiene autorización para realizar esta solicitud' });
        }
    }

    router.get(`/update`, [validate, authentication('jwtAuth'), rol.isAdmin ], async (req, res) => {
        const prod = req.body        
        const products = await manager.getProductById(prod.id);        
        const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)
        const name = userObjet.name 
        const rol = userObjet.rol[0].name
        const isAdmin = rol === "Admin" ? true : false;                                
        res.render('update', {
            products: products, name: name, rol: rol, isAdmin: isAdmin});
    })

    router.get('/products_index', [validate, authentication('jwtAuth')] , async (req, res) => {
        const products = await manager.getProducts();
        const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)
        const name = userObjet.name 
        const rol = userObjet.rol[0].name
        const isAdmin = rol === "Admin" ? true : false;                           
        res.render('products_index', {
            products: products, name: name, rol: rol, isAdmin: isAdmin});
    });

    router.get('/products', [validate, authentication('jwtAuth')], async (req, res) => {        
        try {
            const products = await manager.getProducts();
            res.status(200).send({ status: 'OK', data: products });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });
    
    router.post('/products_index', [validate, authentication('jwtAuth'), rol.isAdmin ], async (req, res) => {
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
    });
    
    router.put('/products_index:pid', [validate, authentication('jwtAuth'), authorization("Admin")], async (pid, res) => {
        try {            
            await manager.updateProduct(pid);
            res.redirect(`/`)
        
            if (manager.checkStatus() === 1) {
                console.log({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                console.log({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            console.log({ status: 'ERR', error: err });
        }
    });
    
    router.delete('/products_index:id', [validate, authentication('jwtAuth'), rol.isAdmin], async(id, res) => {
        try {
            await manager.deleteProduct(id); 
            res.redirect(`/api/products_index`)
        } catch (err) {
            console.log({ status: 'ERR', error: err });
        }
    });

    return router;
}

export default productRoutes;