import mongoose from "mongoose";
const Adminschema = new mongoose.Schema({
  adminname: {
    type: String,
    
  },
  email:{
    type:String
  },
  password:{
    type:String
  },
  usertype:{
    type:String,
    default:"admin"
  }

 
});

export default mongoose.model("admins", Adminschema);
