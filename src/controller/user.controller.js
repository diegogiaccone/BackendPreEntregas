import Users from "../services/user.dbclass.js";
import userModel from "../model/user.model.js";
import { __dirname, generateUser } from '../utils.js';

const manager = new Users();
    
export const validate = async (req, res, next) => {
        if (req.session.userValidated) {
            next();
        } else {
            res.status(401).send({ status: 'ERR', error: 'No tiene autorización para realizar esta solicitud' });
        }
    }

export const getUsers = async () => {
    const users = await manager.getUsers()
    console.log(users)
    }

export const getUpdate = async (req, res) => {                  
        const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)      
        const name = userObjet.name
        const pass = userObjet.pass
        const existPass = pass === undefined ? false : true 
        const rol = userObjet.rol[0].name        
        const isAdmin = rol === "Admin" ? true : false; 
        const avatar = userObjet.avatar                               
        res.render('updatepass', {
            name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass});
    }

export const getAvatarUpdate = async (req, res) => {                  
        const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)      
        const name = userObjet.name 
        const pass = userObjet.pass
        const existPass = pass === undefined ? false : true
        const rol = userObjet.rol[0].name        
        const isAdmin = rol === "Admin" ? true : false; 
        const avatar = userObjet.avatar                               
        res.render('updateavatar', {
            name: name, rol: rol, isAdmin: isAdmin, avatar: avatar, pass: existPass});
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

export const fakeUser = async (req, res) => {
    const users = [];
    for (let i= 0; i < 10; i++){users.push(generateUser())}
    res.send({status: "OK", payload: users })
    }

export const getRegister = async (req, res) => {        
    res.render('registrar');
    };   
    
export const addUser = manager.addUser

export const updateUser = async (uid, res) => {
    try {            
        await manager.updateUser(uid);
        
        if (manager.checkStatus() === 1) {
            console.log({ status: 'OK', msg: manager.showStatusMsg() });
            res.redirect(`/logout`)
        } else {
            res.send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        console.log({ status: 'ERR', error: err });
    }
    };

export const updateAvatarUser = async (uid, res) => {
    try {            
        await manager.updateAvatarUser(uid);
        
        if (manager.checkStatus() === 1) {
            console.log({ status: 'OK', msg: manager.showStatusMsg() });
            res.redirect(`/`)
        } else {
            res.send({ status: 'ERR', error: manager.showStatusMsg() });
        }
    } catch (err) {
        console.log({ status: 'ERR', error: err });
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



