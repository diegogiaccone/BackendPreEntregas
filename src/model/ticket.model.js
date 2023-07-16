import mongoose , { Schema } from 'mongoose';

mongoose.pluralize(null);

const collection = 'tickets';

const schema = ({    
    purchase: {
        type: [
            {   
                tickets:[{
                    ref: 'products',
                    type: Schema.Types.ObjectId,
                }],            
                code: String,             
                purchaser: String,
                purchase_datetime: Date,
                amount: Number,
                total: Number 
            }
       ],
       default: []
    }   
});

const ticketModel = mongoose.model(collection, schema);

export default ticketModel;


