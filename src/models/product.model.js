import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 150 },
    price: { type: Number, required: true, max: 50 },
    thumbnail: { type: String, required: false, max: 250 },
    code: { type: String, required: true, max: 100 },
    status: { type: Boolean, required: true, max: 100 },
    stock: { type: Number, required: true},
    category: { type: String, required: true, max: 100 }
});

export const productModel = model("products", productSchema);