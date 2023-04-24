import mongoose from "mongoose";
const Categoryschema = new mongoose.Schema({
  categoryName: {
    type: String,
    
  },
  userId:{
    type:String
  }
  
});

export default mongoose.model("category", Categoryschema);
