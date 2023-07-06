import { Router } from "express";
import { __dirname } from '../utils.js';
import { authentication } from "../auth/passport.jwt.js";
import { addUser, deleteUser, getRegister, getUserById, updateUser, validate, getUpdate, getAvatarUpdate, updateAvatarUser } from "../controller/user.controller.js";


const router = Router();
const userRoutes = (io) => {
       
    router.get('/users/:id?',getUserById, [validate, authentication('jwtAuth')]);

    router.get(`/updatepass`, getUpdate,[validate, authentication('jwtAuth')])

    router.get(`/updateavatar`, getAvatarUpdate,[validate, authentication('jwtAuth')])

    router.get('/registrar', getRegister);   
    
    router.post(`/updateavatar`, updateAvatarUser,[validate, authentication('jwtAuth')])

    router.post(`/updatepass`, updateUser, [validate, authentication('jwtAuth')])
    
    router.post(`/registrar`, addUser);

    router.put('/users/:id', updateUser, [validate, authentication('jwtAuth')]);
    
    router.delete('/users/:id', deleteUser, [validate, authentication('jwtAuth')]);

    return router;
}

export default userRoutes;

