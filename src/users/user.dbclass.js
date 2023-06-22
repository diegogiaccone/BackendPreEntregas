import mongoose, { isValidObjectId } from 'mongoose';
import userModel from './user.model.js';
import rolModel from './rol.model.js';
import bcrypt from 'bcryptjs'
import { generateToken, authToken } from '../config/jwt.config.js'
import cartModel from '../router/Cart.model.js';

class Users {
    constructor() {
        this.users = [];
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    static requiredFields = ['firstName', 'lastName', 'userName', 'password'];


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
            let passHash = await bcrypt.hash(pass, 8)
            const rol = await rolModel.findOne({name: "Usuario"})
            const cart = await cartModel.create({
                name: "cart",
                products: []
            })
            const verify = await userModel.findOne({user: user})
            if(!verify){
                userModel.create({name: name, apellido: apellido, user: user, pass: passHash, rol: rol, cart: cart})     
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
        const findUser = await userModel.findOne({user:user}).populate(`rol`)       
        if (!findUser) {
            req.sessionStore.errorMessage = 'No se encuentra el usuario';
            res.redirect('http://localhost:3030');           
        }else{
            const passHash = await bcrypt.compareSync(pass, findUser.pass)    
            if (passHash === false) {                
                    req.sessionStore.errorMessage = 'Clave incorrecta'; 
                    res.redirect('http://localhost:3030');  
                } else{
                    req.session.userValidated = req.sessionStore.userValidated = true;
                    req.session.errorMessage = req.sessionStore.errorMessage = '';
                    req.session.user = req.sessionStore.user = {user: user, name: findUser.name, apellido: findUser.apellido, rol: findUser.rol, cart: findUser.cart};                    
                    const date = new Date();                
                    const token = generateToken({ user: user, name : findUser.name, apellido: findUser.apellido, rol: findUser.rol, cart: findUser.cart})        
                    res.cookie('token', token, {
                        maxAge: date.setDate(date.getDate() + 1),
                        secure: false, // true para operar solo sobre HTTPS
                        httpOnly: true
                    })                    
                    res.redirect('http://localhost:3030') 
                }      
            }
        } 
    }        



export default Users;



