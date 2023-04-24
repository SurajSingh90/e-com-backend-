import mongoose from "mongoose";
const Authschema = new mongoose.Schema({
  name: {
    type: String,
    
  },
  email:{
    type:String
  },
  password:{
    type:String
  }

 
});

export default mongoose.model("Owners", Authschema);
