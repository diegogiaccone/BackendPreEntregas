import mongoose from 'mongoose';
import userModel from './user.model.js';
import bcrypt from 'bcryptjs';
import jwt  from "jsonwebtoken";


class Users {
    constructor() {      
        this.status = 0;
        this.statusMsg = "inicializado";
    } 

    addUser = async (req, res) => {
        try{
            const name = req.body.name
            const apellido = req.body.apellido
            const user = req.body.user
            const pass = req.body.pass                                 
            let passHash = await bcrypt.hash(pass.toString(), 8)   
            userModel.create({name: name, apellido: apellido, user: user, pass: passHash})     
            res.redirect('/login')         
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

    getUsersById = async (id) => {
        try {
            this.status = 1;
            const products = userModel.findById(id)
            return products;
        } catch (err) {
            this.status = -1;
            this.statusMsg = `getProductById: ${err}`;
        }
    }

    logUser = async (req, res) => {        
            const user = req.body.user
            const pass = req.body.pass
            const check = await userModel.findOne({user: user});   
            if(!check) {
                res.render(`login`, {
                    alert:true               
                })
                return
            }            
            const isValid = await bcrypt.compare(pass, check.pass)
            if (!isValid){
                res.render(`login`,{
                    alert:true
                })
                return
            }
            
            if(check && isValid){
                res.render(`login`,{
                    alert2: true,                    
                })    
            }
            
            const id = check.id
            const token = jwt.sign({id:id}, process.env.SECRET, {
                expiresIn: process.env.JWT_TIEMPO_EXPIRA
            })
            console.log("TOKEN: "+ token + "para el usuario: "+ user)

            const cookieOptions = {
                expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES *24 *60 * 60 * 1000),
                httpOnly: true
            }
            res.cookie(`jwt`, token, cookieOptions)            
            
        }    
/* 
    validateToken = async (req, res, next) => {   
        const token = req.headers[`token`];           
        if(!token){
            return res.status(401).json({
                message: `usuario no autenticado`
            })
        }
        const decode = jwt.verify(token, process.env.SECRET);
        console.log(decode)
    } */

    logOutUser = async (req, res) =>{       
        res.clearCookie(`jwt`)
        res.redirect(`/login`)
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
}

export default Users;