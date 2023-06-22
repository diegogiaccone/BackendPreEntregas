import { Router } from "express";
import passport from "passport";
import Products from "../router/products.dbclass.js";
import initializePassport from "../config/passport.config.js";
import { generateToken, authToken } from '../config/jwt.config.js'
import { authentication } from "../config/passport.jwt.js";

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
            console.log(req.session)           
            req.session.userValidated = req.sessionStore.userValidated = true;
            const date = new Date();
            const user = await (req.user).populate(`rol`)
            const token = generateToken({ user: req.user.user, name: req.user.name, apellido: req.user.apellido, rol: req.user.rol})   
            res.cookie('token', token, {
                maxAge: date.setDate(date.getDate() + 1),
                secure: false, // true para operar solo sobre HTTPS
                httpOnly: true
            }) 
            res.redirect(`/`)
        }
    });   

    router.get('/logout', async (req, res) => {
        req.session.userValidated = req.sessionStore.userValidated = false;
        res.clearCookie('connect.sid',{domain:".localhost"});
        res.clearCookie('token', {domain: ".localhost"})
        req.session.destroy((err) => {
            req.sessionStore.destroy(req.sessionID, (err) => {
                if (err) console.log(`Error al destruir sesión (${err})`);
                console.log('Sesión destruída');
                res.redirect(`/`);
            });
        })
    });

    router.get('/current', authentication('jwtAuth', { session: false }), async (req, res) => {
        res.send({ status: 'OK', data: req.user });
    });
   
    return router;
}

export default sessionRoutes;