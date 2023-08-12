import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// Create item schema and model
const itemsSchema = new Schema({
    name: {
        type: String,
        required: true
    }
});

const Item = mongoose.model("Item", itemsSchema);

export default Item;