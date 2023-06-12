import { Router } from "express";
import Products from "./products.dbclass.js";
import Rol from "../users/isAdmin.dbclass.js";
import userModel from "../users/user.model.js";
import { authentication } from "../config/passport.jwt.js";
import { authorization } from "../config/passport.jwt.js";
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

    router.get('/products_index', [validate, authentication('jwtAuth')] , async (req, res) => {
        const products = await manager.getProducts();
        const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)
        const name = userObjet.name 
        const rol = userObjet.rol[0].name                   
        res.render('products_index', {
            products: products, name: name, rol: rol});
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
    
    router.put('/products_index', [validate, authentication('jwtAuth'), authorization("Admin")], async (req, res) => {
        try {
            const { id, field, data } = req.body;
            await manager.updateProduct(id, field, data);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });
    
    router.delete('/products_index', [validate, authentication('jwtAuth'), authorization("Admin")], async(req, res) => {
        try {
            await manager.deleteProduct(req.body.id);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });

    return router;
}

export default productRoutes;