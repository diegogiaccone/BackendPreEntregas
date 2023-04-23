import Express from "express";
import ProductManager from "../Manager/ProductManager.js";

const router = Express.Router();
const productosManager = new ProductManager('./products.json')

router.get('/' , async (req,res) => {
    const productos = await productosManager.getProducts()
    const { limit } = req.query;
    res.json(limit ? productos.slice(0, parseInt(limit)) : productos)     
 })

router.get("/:pid", async (req, res) => {    
    let id = parseInt(req.params.pid);     
    const productById = await productosManager.getProductsById(id);
    productById ? res.send(productById) : res.send(`El producto no existe`) 
   }
);

router.post('/', async (req, res) => {  
    const prod = req.body    
    await productosManager.addProduct(prod.title, prod.description, prod.price, prod.thumbnail, prod.code, prod.stock, prod.category, prod.status)
    res.send({ status: 'succes'})
 });

router.delete('/:pid', async (req,res) => {
    let prodId = parseInt(req.params.pid)
    await productosManager.deleteProduct(prodId)
    res.send({ status: 'succes', mensage: 'usuario eliminado'})
});

router.put(`/:pid`, async (req,res) =>{
    let id = parseInt(req.params.pid);
    let actualizarProd = req.body;
    res.send (await productosManager.updateProduct(id, actualizarProd));
});

export default router;



