import { Router } from "express";
import Users from "./user.dbclass.js";
import { __dirname } from '../utils.js';



// Exportamos todo el paquete de endpoints como función (userRoutes) que toma un argumento (io)
// de esta manera al importarlo en server, podremos "inyectar" io para emitir eventos desde aquí
const userRoutes = (io) => {
    const router = Router();
    const manager = new Users();     

    
    router.get(`/`, manager.logUser, (req, res) =>{
        res.render(`api/products_index`, {user: req.user})
    })

    router.get('/login', async (req, res) => {        
        res.render('login', {alert:false            
        });
    });   

    router.get('/', async (req, res) => {
        try {
            const users = await manager.getUsers();
            res.status(200).send({ status: 'OK', data: users });
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });

    router.get('/registrar', async (req, res) => {        
        res.render('registrar', {            
        });
    });   
 
    router.post('/registrar', manager.addUser);  

    router.post('/login', manager.logUser); 
    
    router.get(`/logout`, manager.logOutUser);

    
    
  

    return router;
}

export default userRoutes;