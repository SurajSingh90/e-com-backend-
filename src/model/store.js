import mongoose from "mongoose";
const Storeschema = new mongoose.Schema({
  storename: {
    type: String,
  },
  description: {
    type: String,
  },
  phone: {
    type: Number,
  },
  address: {
    type: String,
  },
  image: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  country: {
    type: String,
  },
  store_ownerId: {
    type: String,
  },
});

export default mongoose.model("Stores", Storeschema);
