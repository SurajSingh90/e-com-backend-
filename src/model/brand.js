import mongoose from "mongoose";
const Brandschema = new mongoose.Schema({
  brandName: {
    type: String,
  },
  description: {
    type: String,
  },

  address: {
    type: String,
  },
  logo: {
    type: String,
  },
  status: {
    type: String,
  },

  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:"StoreId"
  },
  store_ownerId: {
    type: String,
  },
});

export default mongoose.model("Brands", Brandschema);
