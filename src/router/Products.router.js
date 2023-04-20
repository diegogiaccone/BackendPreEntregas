import Express from "express";
import ProductManager from "../Manager/ProductManager.js";

const router = Express.Router();
const productosManager = new ProductManager('./products.json')
const readProducts = productosManager.getProducts();

router.get('/' , async (req,res) => {
    const productos = await productosManager.getProducts()
    const { limit } = req.query;
    res.json(limit ? productos.slice(0, parseInt(limit)) : productos)     
 })

router.get("/:pid", async (req, res) => {    
    let id = parseInt (req.params.pid);
    const allProducts = await readProducts;
    const productById = allProducts.find(product => product.id === id);
    productById ? res.send(productById) : res.send(`El producto no existe`)
   }
);

router.post('/', async (req, res) => {  
    const prod = req.body    
    await productosManager.addProduct(prod.title, prod.description, prod.price, prod.thumbnail, prod.code, prod.stock, prod.category, prod.status)
    res.send({ status: 'succes'})
 });

router.delete('/delete/:pid', async (req,res) => {
    let prodId = parseInt(req.params.pid)
    await productosManager.deleteProduct(prodId)
    res.send({ status: 'succes', mensage: 'usuario eliminado'})
});

router.put(`/:pid`, async (req,res) =>{
    let id = parseInt(req.params.pid);
    let actualizarProd = req.body;
    await productosManager.updateProduct(id, actualizarProd);
    res.send({ status: 'Exitoso', mensage: 'Producto Actualizado'})
});

export default router;



