import { Router } from "express";
import Products from "./products.dbclass.js";
import productModel from "./products.model.js";


const router = Router();
const manager = new Products();


const productRoutes = (io) => {   

    router.get('/products_index', async (req, res) => {
        const products = await manager.getProducts();
        res.render('products_index', {
            products: products
        });
    });
  

    router.get('/products/:category?', async (req, res) => {
        try {
            const category = req.params.category    
            const page = req.query.page 
            const limit = req.query.limit
            const sort = req.query.sort              
            const products = await productModel.paginate({category: `${category}`}, {limit: limit, page: page, sort : {price: sort}})            
            let validarProd = products.docs.filter(prod => prod.category == category)            
            validarProd ? res.render('products', {products: validarProd}) : console.log("el producto no existe") 
           /*  res.status(200).send({ status: 'Ok', data: products }); */
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });
    

    router.post('/products_index', async (req, res) => {
        try {          
            await manager.addProduct(req.body)  
            io.emit(`new_cards`, (req.body))          
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });
    
    router.put('/products/:id', async (req, res) => {
        try {        
            await manager.updateProduct(req.params.id, req.body);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });
    
    router.delete('/products', async(req, res) => {
        try {
            await manager.deleteProduct(req.params.id);
        
            if (manager.checkStatus() === 1) {
                res.status(200).send({ status: 'OK', msg: manager.showStatusMsg() });
            } else {
                res.status(400).send({ status: 'ERR', error: manager.showStatusMsg() });
            }
        } catch (err) {
            res.status(500).send({ status: 'ERR', error: err });
        }
    });
    
    return router;
}

export default productRoutes