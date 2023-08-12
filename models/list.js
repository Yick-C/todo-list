import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create list schema and model
const listSchema = new Schema({
    name: String,
    items: [{ 
        type: Schema.Types.ObjectId, 
        ref: "Item" 
    }]
});

const List = mongoose.model("List", listSchema);

export default List;