import { Router } from "express";
import passport from "passport";
import Products from "../router/products.dbclass.js";
import userModel from "../users/user.model.js";
import initializePassport from "../config/passport.config.js";

initializePassport();

const manager = new Products();

const sessionRoutes = () => {    
    const router = Router();   

    router.get('/github', passport.authenticate('github', { scope: ['user:email']}))

    router.get('/githubcallback', passport.authenticate('github', { scope: ['user:email']}), async (req, res) => {
        if (req.user === undefined) {            
            res.render('login', { sessionInfo: req.session });
        } else {
            req.session.user = req.sessionStore.user = req.user
            console.log(req.user)
            req.session.userValidated = req.sessionStore.userValidated = true; 
            res.redirect(`/`)
        }
    });   

    router.get('/logout', async (req, res) => {
        req.session.userValidated = req.sessionStore.userValidated = false;
        res.clearCookie('connect.sid', {domain:".localhost"});
        req.session.destroy((err) => {
            req.sessionStore.destroy(req.sessionID, (err) => {
                if (err) console.log(`Error al destruir sesión (${err})`);
                console.log('Sesión destruída');
                res.redirect(`/`);
            });
        })
    });
   
    return router;
}

export default sessionRoutes;