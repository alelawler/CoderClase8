import mongoose, { Schema, model } from "mongoose";

const cartSchema = new Schema({
    products: { type: [
        {
            product:{
                type: mongoose.Schema.Types.ObjectId,
                ref:"products"
            },
            quantity: { type: Number, required: true}
        }
    ],
    default:[],
}
});

cartSchema.pre('find',function(){
    this.populate("products.product")
})

export const cartModel = model("carts", cartSchema);