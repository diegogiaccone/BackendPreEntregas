import Users from '../services/user.dbclass.js';
import userModel from "../model/user.model.js";
import { store, BASE_URL, PRODUCTS_PER_PAGE } from "../app.js";
import factoryProduct from '../services/factory.js';

const users = new Users();
const manager = new factoryProduct(); 
   
export const getProductsPaginated = async (req, res) => {
    store.get(req.sessionID, async (err, data) => {
        if (err) console.log(`Error al recuperar datos de sesión (${err})`);
        if (data !== null && (req.session.userValidated || req.sessionStore.userValidated)) {           
            if (req.query.page === undefined) req.query.page = 0;    
            const result = await manager.getProductsPaginated(req.query.page * PRODUCTS_PER_PAGE, PRODUCTS_PER_PAGE);                                   
            const pagesArray = [];
            for (let i = 0; i < result.totalPages; i++) pagesArray.push({ index: i, indexPgBar: i});                
            const pagination = {                    
                baseUrl: BASE_URL,
                limit: result.limit,
                offset: result.offset,
                totalPages: result.totalPages,
                totalDocs: result.totalDocs,
                page: result.page - 1,
                nextPageUrl: `${BASE_URL}?page=${result.nextPage - 1}`,
                prevPageUrl: `${BASE_URL}?page=${result.prevPage - 1}`,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                pagesArray: pagesArray
            }     
              
            const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)                
            const name = userObjet.name 
            const rol = userObjet.rol[0].name
            const isAdmin = rol === "Admin" ? true : false
            const avatar = userObjet.avatar            
                 
            res.render('products',{ products: result.docs, pagination: pagination, name:name, rol: rol, isAdmin: isAdmin, avatar: avatar});
        } else {            
            res.render('login', {
                sessionInfo: req.session.userValidated !== undefined ? req.session : req.sessionStore,
                baseUrl: BASE_URL
            });
        }                    
    }); 
};
    
export const logout = async (req, res) => {
    req.session.userValidated = req.sessionStore.userValidated = false;
    res.clearCookie('connect.sid',{domain:".localhost"});
    res.clearCookie('token', {domain: ".localhost"}) 
    req.session.destroy((err) => {
        req.sessionStore.destroy(req.sessionID, (err) => {
            if (err) console.log(`Error al destruir sesión (${err})`);
            console.log('Sesión destruída');
            res.redirect(BASE_URL);
        });
    })
};
    
export const login = users.validateUser; 


