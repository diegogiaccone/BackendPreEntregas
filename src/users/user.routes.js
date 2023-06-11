import { Router } from "express";
import Users from "./user.dbclass.js";
import { __dirname } from '../utils.js';


const userRoutes = (io) => {
    const router = Router();
    const manager = new Users();
    // const manager = new Users(`${__dirname}/data/users.json`);

    const validate = async (req, res, next) => {
        if (req.session.userValidated) {
            next();
        } else {
            res.status(401).send({ status: 'ERR', error: 'No tiene autorización para realizar esta solicitud' });
        }
    }
       
    router.get('/users/:id?', validate, async (req, res) => { // ? indica que el parámetro es opcional
        try {
            if (req.params.id === undefined) {
                const users = await manager.getUsers();
                res.status(200).send({ status: 'OK', data: users });
            } else {
                const user = await manager.getUserById(req.params.id);
                res.status(200).send({ status: 'OK', data: user });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: 'No se encuentra el usuario' });
        }
    });

    router.get('/registrar', async (req, res) => {        
        res.render('registrar');
    });   
    
    router.post(`/registrar`, manager.addUser)

    router.put('/users/:id', validate, async (req, res) => {
        try {
            await manager.updateUser(req.params.id, req.body);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: 'No se puede actualizar el usuario' });
        }
    });
    
    router.delete('/users/:id', validate, async(req, res) => {
        try {
            await manager.deleteUser(req.params.id);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });

    return router;
}

export default userRoutes;

