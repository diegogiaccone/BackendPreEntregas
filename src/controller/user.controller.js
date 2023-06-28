import Users from "../services/user.dbclass.js";
import { __dirname } from '../utils.js';

const manager = new Users();
    
export const validate = async (req, res, next) => {
        if (req.session.userValidated) {
            next();
        } else {
            res.status(401).send({ status: 'ERR', error: 'No tiene autorización para realizar esta solicitud' });
        }
    }
       
export const getUserById = async (req, res) => { // ? indica que el parámetro es opcional
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
};

export const getRegister = async (req, res) => {        
    res.render('registrar');
};   
    
export const addUser = manager.addUser

export const updateUser = async (req, res) => {
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
};
    
export const deleteUser = async(req, res) => {
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
};



