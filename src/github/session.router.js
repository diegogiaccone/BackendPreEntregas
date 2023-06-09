import { Router } from "express";
import passport from "passport";
import Products from "../router/products.dbclass.js";
import userModel from "../users/user.model.js";


const manager = new Products();

const sessionRoutes = () => {    
    const router = Router();   

    router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }))

    router.get('/githubcallback', passport.authenticate('github', { scope: ['user:email'], session: false }), async (req, res) => {
        if (req.user === undefined) {            
            res.render('login', { sessionInfo: req.session });
        } else {
            req.session.user = req.sessionStore.user = req.user         
            console.log(req.session.user)
            const products = await manager.getProducts();
            const user = await userModel.findOne({user: req.session.user.user}).populate(`rol`)                                        
            const name = user.name 
            const rol = user.rol[0].name                           
            res.render('products_index', {
            products: products,  name: name,  rol: rol});       
            }
    });      
   
    return router;
}

export default sessionRoutes;