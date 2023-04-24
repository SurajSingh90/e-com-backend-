import Stores from "../model/store";
import { validationResult } from "express-validator";
import cloudinary from "cloudinary";
import store from "../model/store";
import mongoose from "mongoose";
cloudinary.config({
  cloud_name: "dzidawevj",
  api_key: "745231798445212",
  api_secret: "RU_ekzheCagO1QErVCps5P2C038",
});

export const createStore = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());
  if (!errors.isEmpty()) {
    return res.json({
      message: errors.array()[0].msg,
    });
  } else {
    let storeobj = {
      storename: req.body.storename,
      description: req.body.description,
      phone: req.body.phone,
      address: req.body.address,
      image: req.file.path,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      store_ownerId: req.id,
    };
    try {
      let imageUrl = await cloudinary.v2.uploader.upload(storeobj.image);
      storeobj.image = imageUrl.secure_url;
      const existstorename = await Stores.findOne({
        storename: storeobj.storename,
      });
      if (existstorename) {
        return res.status(403).json({ message: "Store Name Allready Exist" });
      }


      const result = await Stores.create(storeobj);
      return res
        .status(200)
        .json({ message: "Your Store Created Sccessfull", StoreData: result });
    } catch (err) {
      console.log("errrrrrrrr", err);
      return res.status(500).json({ message: "internal errorr", err });
    }
  }
};

export const updateStore = async (req, res) => {
 

  const errors = validationResult(req);

    console.log("errors===============", errors.array());
    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    }
  try {
    let id = req.params.id;

    const isValidBlogId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidBlogId) {
      return res.status(404).json({ msg: "Invalid Blog ID" });
    }

    const storedata = await Stores.findById(id);
    if (!storedata) {
      return res.status(404).json({ message: `StoreId ${id} Not Found` });
    }
    storedata.storename = req.body.storename
      ? req.body.storename
      : storedata.storename;
    storedata.description = req.body.description
      ? req.body.description
      : storedata.description;
    storedata.phone = req.body.phone ? req.body.phone : storedata.phone;
    storedata.address = req.body.address ? req.body.address : storedata.address;
    storedata.city = req.body.city ? req.body.city : storedata.city;
    storedata.country = req.body.country ? req.body.country : storedata.country;
    storedata.state = req.body.state ? req.body.state : storedata.state;
    storedata.image = req.body.image ? req.body.image : storedata.image;
    if (req.file) {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path);
      storedata.image = uploadResult.secure_url;
    }
    const savedata = await storedata.save();
    res
      .status(200)
      .json({ message: "Store Update Sccessfull", StoreData: savedata });
  } catch (err) {
    console.log("errrrrrrrr", err);
    return res.status(500).json({ message: "internal errorr", err });
  }
};

export const getowners = async (req, res) => {
  try {
    let ownerId = req.id
    
    // const { page, limit } = req.query;
   
    // const skip = (page - 1) * limit;
    // const name = req.query.name;
    // const findstore = await store.findOne({ storename: name });
    const ownerlist =  await store.findOne({store_ownerId:ownerId })
    if (!ownerlist) {
      return res.status(404).json({ message: "Store list not found" });
    }
    res.status(200).json({ ownerlist });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const storebynames = async (req, res) => {
  try {
    const name = req.query.name;
    const findstore = await store.findOne({ storename: name });
    if (!findstore) {
      return res.send({ msg: "stores not found" });
    }
    res.status(200).send(findstore);
  } catch (err) {
    console.log("Error is  ", err);
    return res.status(401).send({ msg: "internal error", err });
  }
};


export const deleteStore = async(req,res)=>{
  const id = req.params.id
  try{
     const result = await store.findByIdAndDelete({_id:id})
     if(!result){
      return res.status(404).send({message:"Stores Id not founded"})
     }
     return res.status(200).send({message:`stores ${id} deleted Scessfull`,DeleteStore:result})
  }
  catch (err) {
    console.log("Error is  ", err);
    return res.status(401).send({ msg: "internal error", err });
  }

}


// export const getallStore = async(req,res)=>{
//   try{
//     let ownerId = req.id
//   const result = await store.findOne({store_ownerId:ownerId})
//   res.send(result)
//   }
//   catch (err) {
//     console.log("Error is  ", err);
//     return res.status(401).send({ msg: "internal error", err });
//   }

  
// }