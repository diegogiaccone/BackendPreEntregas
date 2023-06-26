import { Router } from "express";
import Users from '../users/user.dbclass.js';
import Products from './products.dbclass.js';
import userModel from "../users/user.model.js";

const users = new Users();
const manager = new Products();


const mainRoutes = (io, store, baseUrl, productsPerPage) => {
    const router = Router();
   
    router.get('/', async (req, res) => {
        store.get(req.sessionID, async (err, data) => {
            if (err) console.log(`Error al recuperar datos de sesión (${err})`);

            if (data !== null && (req.session.userValidated || req.sessionStore.userValidated)) {           
                if (req.query.page === undefined) req.query.page = 0;    
                const result = await manager.getProductsPaginated(req.query.page * productsPerPage, productsPerPage);   
    
                const pagesArray = [];
                for (let i = 0; i < result.totalPages; i++) pagesArray.push({ index: i, indexPgBar: i});     
                
                const pagination = {                    
                    baseUrl: baseUrl,
                    limit: result.limit,
                    offset: result.offset,
                    totalPages: result.totalPages,
                    totalDocs: result.totalDocs,
                    page: result.page - 1,
                    nextPageUrl: `${baseUrl}?page=${result.nextPage - 1}`,
                    prevPageUrl: `${baseUrl}?page=${result.prevPage - 1}`,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    pagesArray: pagesArray
                }               
              
                const userObjet = await userModel.findOne({user: req.session.user.user}).populate(`rol`)                
                const name = userObjet.name 
                const rol = userObjet.rol[0].name            
                 
                res.render('products',{ products: result.docs, pagination: pagination, name:name, rol: rol});
            } else {            
                res.render('login', {
                    sessionInfo: req.session.userValidated !== undefined ? req.session : req.sessionStore
                });
            }                    
        }); 
    });
    
    router.get('/logout', async (req, res) => {
        req.session.userValidated = req.sessionStore.userValidated = false;
        res.clearCookie('connect.sid',{domain:".localhost"});
        res.clearCookie('token', {domain: ".localhost"})
        req.session.destroy((err) => {
            req.sessionStore.destroy(req.sessionID, (err) => {
                if (err) console.log(`Error al destruir sesión (${err})`);
                console.log('Sesión destruída');
                res.redirect(baseUrl);
            });
        })
    });
    

    router.post('/login', users.validateUser); 

    return router;
}

export default mainRoutes;