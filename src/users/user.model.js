import mongoose from 'mongoose';

const collection = 'users';

const schema = new mongoose.Schema({        
    name: String,
    apellido: String,
    user: String,
    pass: String,  
});

const userModel = mongoose.model(collection, schema);

export default userModel;