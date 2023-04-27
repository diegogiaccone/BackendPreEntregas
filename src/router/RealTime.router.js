import Express from "express";
import ProductManager from "../Manager/ProductManager.js";


const RealTimeRouter = Express.Router();
const productosManager = new ProductManager('./products.json')

RealTimeRouter.get(`/`, async (req,res) =>{
    let allproducts = await productosManager.getProducts()
    res.render(`RealtimeProducts`, {
        title:`Desafio handlebars`,
        products: allproducts
    })
})

RealTimeRouter.post('/', async (req, res) => {  
    const prod = {
        title: req.body.title, 
        thumbnail: req.body.thumbnail,
        description: req.body.description, 
        price: req.body.price, 
        stock: req.body.stock, 
        category: req.body.category}     
    res.send(await productosManager.addProduct(prod))
 });


export default RealTimeRouter