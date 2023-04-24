import owners from "../model/owner_Auth";
import jsw from "jsonwebtoken";
import Token from "../config/database.js";
import admin from "../model/admin";
import Stores from '../model/store';

export const verfiytoken = async (req, res, next) => {
  let token = req.headers["authorization"];

  try {
    if (!token) {
      return res.status(404).send({ message: "TOken is missing" });
    }
    token = token.split("Bearer ")[1];
    jsw.verify(token, Token.TokenData, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Unauthorized!" });
      } else {
        req.id = decode.id;
        next();
      }
    });
  } catch (err) {
    console.log("the Error is ", err);
    return res.status(500).send({ message: " internal error ", err });
  }
};
export const EmailMiddle = async (req, res, next) => {
  const { email } = req.body;

  try {
    const existingemail = await owners.findOne({ email });
    if (existingemail) {
      return res.status(400).send({ message: "email already in use" });
    }

    next();
  } catch (err) {
    console.error("error iss", err);
    return res.status(500).json({ error: "Internal server error", err });
  }
};


export const IsAdmin = async (req, res, next) => {
  const Usersfind = await admin.findOne({ _id: req.id });
  if (Usersfind && Usersfind.usertype == "admin") {
    next();
  } else {
    res.status(403).send({
      message: "Require Admin Role!",
    });
  }
};



export const checkOwners =  async(req,res,next)=>{
  try{
    let ownerId = req.id
    const dublictOwners = await Stores.findOne({store_ownerId:ownerId})
    if(dublictOwners){
      return res.status(400).send({message:"You can  Create Only One StoreID "})
    }
    else{
      next()
    }
  }
  
  catch (err) {
    console.error("error iss", err);
    return res.status(500).json({ error: "Internal server error", err });
  }
} 