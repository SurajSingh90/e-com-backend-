import mongoose from "mongoose";
const Productschema = new mongoose.Schema({
  productName: {
    type: String,
  },
  description: {
    type: String,
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "categoryId",
  },
  image: [{
    type: String,
  
  }],
  price: {
    type: Number,
  },

  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brandId",
  },
  quantity: {
    type: String,
  },

  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StoreId",
  },
  store_ownerId: {
    type: String,
  },
});

export default mongoose.model("products",Productschema);
