import { Router } from "express";
import { __dirname } from '../utils.js';
import { authentication } from "../auth/passport.jwt.js";
import { addUser, deleteUser, getRegister, getUserById, updateUser, validate, getUpdate, getAvatarUpdate, updateAvatarUser, getUsers, fakeUser, getRecovery, getRecoveryPass, mailPassRecovery, passRecovery, getRol, updateRol, getMessages, getErrMessages } from "../controller/user.controller.js";
import Rol from "../services/isAdmin.dbclass.js";

const rol = new Rol();
const router = Router();
const userRoutes = (io) => {
       
    router.get('/users/:id?',getUserById, [validate, authentication('jwtAuth')]);

    router.get(`/updatepass`, getUpdate,[validate, authentication('jwtAuth')])

    router.get(`/messages`, getMessages)

    router.get(`/errmessages`, getErrMessages)

    router.get(`/recovery`, getRecovery) 

    router.get('/recoverypass/:token', getRecoveryPass)

    router.get(`/users`, getUsers,[validate, authentication('jwtAuth')])

    router.get(`/fakeuser`, fakeUser, [validate, authentication('jwtAuth')])

    router.get(`/updateavatar`, getAvatarUpdate,[validate, authentication('jwtAuth')])

    router.get('/registrar', getRegister); 
    
    router.get('/rol', getRol, [validate, authentication('jwtAuth')], rol.isAdmin);

    router.post('/recovery', mailPassRecovery)

    router.post('/rol', updateRol, [validate, authentication('jwtAuth')], rol.isAdmin);
    
    router.post('/recoverypass/:token', passRecovery )
    
    router.post(`/updateavatar`, updateAvatarUser,[validate, authentication('jwtAuth')])

    router.post(`/updatepass`, updateUser, [validate, authentication('jwtAuth')])
    
    router.post(`/registrar`, addUser);

    router.put('/users/:id', updateUser, [validate, authentication('jwtAuth')]);
    
    router.delete('/users/:id', deleteUser, [validate, authentication('jwtAuth')]);

    return router;
}

export default userRoutes;

