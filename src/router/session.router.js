import { Router } from "express";
import passport from "passport";
import initializePassport from "../auth/passport.config.js";
import { authentication } from "../auth/passport.jwt.js";
import { current, login, logout } from "../controller/session.controller.js";

initializePassport();

const sessionRoutes = () => {    
    const router = Router();   

    router.get('/github', passport.authenticate('github', { scope: ['user:email']}))

    router.get('/githubcallback',passport.authenticate('github', { scope: ['user:email']}), login);   

    router.get('/google', passport.authenticate('google', { scope: ['profile']}))

    router.get('/auth/google/callback',passport.authenticate('google', { scope: ['profile']}), login);   

    router.get('/facebook', passport.authenticate('facebook'))

    router.get('/auth/facebook/callback',passport.authenticate('facebook'), login);   

    router.get('/logout', logout);

    router.get('/current', authentication('jwtAuth', { session: false }), current);
   
    return router;
}

export default sessionRoutes;