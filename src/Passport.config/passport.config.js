import passport from "passport";
import {} from 'dotenv/config'
import GithubStrategy from 'passport-github2';
import userModel from '../users/user.model.js';
import rolModel from "../users/rol.model.js";
import cartModel from "../router/Cart.model.js";

const initializePassport = () => {
    // Estrategia Github
    passport.use('github', new GithubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.GITHUB_SECRET,
        callbackUrl: 'http://localhost:3030/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
        try{
            let users = await userModel.findOne({user: profile._json.email})
            if(!users){
                const rol = await rolModel.findOne({name: "Usuario"})
                const cart = await cartModel.create({
                    name: "cart",
                    products: []
                })
                let newUser = {
                    name: profile._json.name,
                    user: profile._json.email,
                    rol: rol,
                    cart: cart
                }                
                let result = await userModel.create(newUser)
                done(null, result)
            }else{
                done(null, users)
            }
        }catch (error){
            return done(error)
        }
    }));
      

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err.message);
        }
    });
}

export default initializePassport;