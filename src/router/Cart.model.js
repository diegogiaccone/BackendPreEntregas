import mongoose from 'mongoose';
import { URL } from 'url';
import productModel from './products.model.js';

mongoose.pluralize(null); // Importante! para no tener problemas con Mongoose

const collection = 'carts';

const schema = ({
    nombre: String,
    products: {
        type: [
            {
                prods:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products'
                },
                quantity: {
                type: Number,
                default: 1
                }
            }
        ],
        default: []
    }
});

/* schema.pre('findOne', function() {
    this.populate({ path: 'product', model: productModel });
}); */

const cartModel = mongoose.model(collection, schema);

export default cartModel;