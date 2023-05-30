import mongoose from 'mongoose';
import userModel from './user.model.js';
import crypto from 'crypto';
import jwt  from "jsonwebtoken";
import rolModel from './rol.model.js';


class Users {
    constructor() {
        this.users = [];
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    static requiredFields = ['firstName', 'lastName', 'userName', 'password'];

    static #verifyRequiredFields = (obj) => {
        return Users.requiredFields.every(field => Object.prototype.hasOwnProperty.call(obj, field) && obj[field] !== null);
    }

    static #generarSha256 = (pass) => {
        return crypto.createHash('sha256').update(pass).digest('hex');
    }

    static #objEmpty (obj) {
        return Object.keys(obj).length === 0;
    }

    checkStatus = () => {
        return this.status;
    }

    showStatusMsg = () => {
        return this.statusMsg;
    }


    addUser = async (req, res) => {
        try{
            const name = req.body.name
            const apellido = req.body.apellido
            const user = req.body.user
            const pass = req.body.pass                                 
            let passHash = Users.#generarSha256(pass)
            const rol = await rolModel.findOne({name: "Usuario"})
            const verify = await userModel.findOne({user: user})
            if(!verify){
                userModel.create({name: name, apellido: apellido, user: user, pass: passHash, rol: rol})     
                res.redirect('/')      
            }else{                 
                res.send(`El usuario ya existe Por favor intente con otro nombre de usuario`)
            }
        } catch (error) {
            console.log(error)
        }       
    }

    getUsers = async () => {
        try {
            const users = await userModel.find();
            
            this.status = 1;
            this.statusMsg = 'Usuarios recuperados';
            return users;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getUsers: ${err}`;
        }
    }

    getUserById = async (id) => {
        try {
            this.status = 1;
            const user = userModel.findById(id);
            return user;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getUserById: ${err}`;
        }
    }

    updateUser = async (id, data) => {
        try {
            if (data === undefined || Object.keys(data).length === 0) {
                this.status = -1;
                this.statusMsg = "Se requiere body con data";
            } else {
                // Con mongoose.Types.ObjectId realizamos el casting para que el motor reciba el id en el formato correcto
                const process = await userModel.updateOne({ '_id': new mongoose.Types.ObjectId(id) }, data);
                this.status = 1;
                process.modifiedCount === 0 ? this.statusMsg = "El ID no existe o no hay cambios por realizar": this.statusMsg = "Usuario actualizado";
            }
        } catch (err) {
            this.status = -1;
            this.statusMsg = `updateUser: ${err}`;
        }
    }

    deleteUser = async (id) => {
        try {
            const process = await userModel.deleteOne({ '_id': new mongoose.Types.ObjectId(id) });
            this.status = 1;
            process.deletedCount === 0 ? this.statusMsg = "El ID no existe": this.statusMsg = "Usuario borrado";
        } catch (err) {
            this.status = -1;
            this.statusMsg = `deleteUser: ${err}`;
        }
    }

    validateUser = async (req, res, next) => {
        const { user, pass } = req.body; // Desestructuramos el req.body
        const logUser = await userModel.findOne({ user: user, pass: crypto.createHash('sha256').update(pass).digest('hex')}).populate(`rol`);
        console.log(logUser)       

        if (logUser === null) { // Datos no válidos
            req.session.userValidated = req.sessionStore.userValidated = false;
            req.session.errorMessage = req.sessionStore.errorMessage = 'Usuario o clave no válidos';
        } else {
            req.session.userValidated = req.sessionStore.userValidated = true;
            req.session.errorMessage = req.sessionStore.errorMessage = '';
        }

        // Se recarga la página base en el browser
        res.redirect(`http://localhost:3030`);
    }
}

export default Users;



