import mongoose, { Schema } from 'mongoose';

mongoose.pluralize(null);

const collection = 'users';

const schema = new mongoose.Schema({        
    name: String,
    apellido: String,
    user: {type: String, unique: true},
    pass: String,
    avatar: String, 
    rol: [{
        ref:"rol",
        type: Schema.Types.ObjectId
    }],
    cart: [{
        ref:"carts",
        type: Schema.Types.ObjectId
    }] 
});

const userModel = mongoose.model(collection, schema);

export default userModel;