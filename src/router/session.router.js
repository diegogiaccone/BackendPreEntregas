import { Router } from "express";
import passport from "passport";
import initializePassport from "../auth/passport.config.js";
import { authentication } from "../auth/passport.jwt.js";
import { current, loginGithub, logoutGitHub } from "../controller/session.controller.js";

initializePassport();

const sessionRoutes = () => {    
    const router = Router();   

    router.get('/github', passport.authenticate('github', { scope: ['user:email']}))

    router.get('/githubcallback',passport.authenticate('github', { scope: ['user:email']}), loginGithub);   

    router.get('/logout', logoutGitHub);

    router.get('/current', authentication('jwtAuth', { session: false }), current);
   
    return router;
}

export default sessionRoutes;