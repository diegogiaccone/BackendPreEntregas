import { Router } from "express";
import Rol from "../services/isAdmin.dbclass.js";
import { authentication } from "../auth/passport.jwt.js";
import { authorization } from "../auth/passport.jwt.js";
import { addProduct, deleteProduct, getProducts, getProductsIndex, getUpdate, updateProduct, validate } from "../controller/products.controller.js";

const router = Router();
const rol = new Rol();

const productRoutes = (io) => {    

    router.get(`/update`, getUpdate, [validate, authentication('jwtAuth'), rol.isAdmin ])

    router.get('/products_index', getProductsIndex, [validate, authentication('jwtAuth')]);

    router.get('/products', getProducts, [validate, authentication('jwtAuth'), rol.isAdmin]);
    
    router.post('/products_index', addProduct, [validate, authentication('jwtAuth'), rol.isAdmin, rol.isPremium]);
    
    router.put('/products_index:pid', updateProduct, [validate, authentication('jwtAuth'), authorization("Admin")]);
    
    router.delete('/products_index:id', deleteProduct, [validate, authentication('jwtAuth'), rol.isAdmin, rol.isPremium]);

    return router;
}

export default productRoutes;