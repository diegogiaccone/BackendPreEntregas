import { Router } from "express";
import { __dirname } from '../utils.js';
import { authentication } from "../auth/passport.jwt.js";
import { addUser, deleteUser, getRegister, getUserById, updateUser, validate } from "../controller/user.controller.js";

const router = Router();
const userRoutes = (io) => {
       
    router.get('/users/:id?',getUserById, [validate, authentication('jwtAuth')]);

    router.get('/registrar', getRegister);   
    
    router.post(`/registrar`, addUser);

    router.put('/users/:id', updateUser, [validate, authentication('jwtAuth')]);
    
    router.delete('/users/:id', deleteUser, [validate, authentication('jwtAuth')]);

    return router;
}

export default userRoutes;

