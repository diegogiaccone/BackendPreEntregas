/* import mongoose from 'mongoose';
import userModel from './user.model.js';
import rolModel from './rol.model.js';
import Users from './user.dbclass.js';

const user = new Users()

class Rol {
    constructor() {       
        this.status = 0;
        this.statusMsg = "inicializado";
    }

    isAdmin = async (req, res, next) => {        
        const userAd = await user.validateUser(req.body) 
        console.log("este es user")
        console.log(userAd)
        const rol = await rolModel.find({_id: {$in: user.rol}})
        console.log("esto es rol")
        console.log(rol)
        for (let i = 0; i < rol.length; i++) {
            if(rol[i].name === "Admin"){
                next()
            }
            return;       
        }
        return res.status(403).json({message: "Necesita ser Admin para ejecutar esta acción"})
    }
}

export default Rol; */
