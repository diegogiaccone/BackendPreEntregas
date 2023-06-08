import { Router } from "express";
import passport from "passport";
import initializePassport from '../config/passport.config.js';

initializePassport();

const sessionRoutes = () => {    
    const router = Router();   

    router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }))

    router.get('/githubcallback', passport.authenticate('github', { scope: ['user:email'], session: false }), async (req, res) => {
        if (req.user === undefined) {            
            res.render('login', { sessionInfo: req.session });
        } else {
            req.session.user = req.sessionStore.user = req.user;
            console.log(req.session.user)
            res.redirect(`/`)
        }
    });      
   
    return router;
}

export default sessionRoutes;