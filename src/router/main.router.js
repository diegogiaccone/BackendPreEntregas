import { Router } from "express";
import { getProductsPaginated, login, logout } from "../controller/main.controller.js";

const mainRoutes = (io) => {
    const router = Router();
   
    router.get('/', getProductsPaginated);
    
    router.get('/logout', logout);    

    router.post('/login', login); 

    return router;
}

export default mainRoutes;