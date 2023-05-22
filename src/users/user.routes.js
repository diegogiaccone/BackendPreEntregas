import { Router } from "express";
import Users from "./user.dbclass.js";
import { __dirname } from '../utils.js';


const userRoutes = (io) => {
    const router = Router();
    const manager = new Users();     

    
    router.get(`/`,  (req, res) =>{
        res.redirect(`login`)
    })

    router.get('/login', async (req, res) => {        
        res.render('login', {alert:false            
        });
    });   

    router.get('/users', async (req, res) => {
        try {
            const users = await manager.getUsers();
            res.status(200).send({ status: 'OK', data: users });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });

    router.get('/registrar', async (req, res) => {        
        res.render('registrar');
    });   
 
    router.post('/registrar', manager.addUser);  

    router.post('/login', manager.logUser); 

    
   /*  router.post(`/logout`, manager.logOutUser); */

    
    
  

    return router;
}

export default userRoutes;