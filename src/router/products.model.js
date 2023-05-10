import mongoose from 'mongoose';
import { URL } from 'url';

const collection = 'products';

const schema = new mongoose.Schema({
    title: String,  
    description: String,
    price: Number, 
    thumbnail: String,
    code: String,    
    stock: Number, 
    category: String
});

const productModel = mongoose.model(collection, schema);

export default productModel;