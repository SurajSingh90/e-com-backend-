import Brands from "../model/brand";
import { validationResult } from "express-validator";
import Stores from "../model/store";
import cloudinary from "cloudinary";
import brand from "../model/brand";
import mongoose from "mongoose";
cloudinary.config({
  cloud_name: "dzidawevj",
  api_key: "745231798445212",
  api_secret: "RU_ekzheCagO1QErVCps5P2C038",
});

export const createBrand = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());
  if (!errors.isEmpty()) {
    return res.json({
      message: errors.array()[0].msg,
    });
  } else {
    let Brandobj = {
      brandName: req.body.brandName,
      description: req.body.description,
      logo: req.file.path,
      address: req.body.address,
      status: req.body.status,
      storeId: req.body.storeId,
      store_ownerId: req.id,
    };

    if (req.file) {
      Brandobj.logo = req.file.path;
      console.log("logo path: ", req.file.path);
    }

    try {
      const existBrandname = await Brands.findOne({
        brandName: Brandobj.brandName,
      });
      if (existBrandname) {
        return res.status(403).json({ message: "Brand Name Allready Exist" });
      }

      if (req.file) {
        let imageUrl = await cloudinary.v2.uploader.upload(Brandobj.logo);
        Brandobj.logo = imageUrl.secure_url;
      }
      const OwnerinStore = await Stores.findOne({
        _id: Brandobj.storeId,
        store_ownerId: Brandobj.store_ownerId,
      });

      console.log("Owenerrrrrrrrrrrr", OwnerinStore);
      if (!OwnerinStore) {
        return res.status(401).json({ message: "You Have Not Store" });
      }
      let sid = Brandobj.storeId
      console.log("stttiiii",Brandobj.storeId);
      let validId = mongoose.Types.ObjectId.isValid(sid);
      if (!validId) {
        return res
          .status(404)
          .send({ message: `Invalid storeId: ${Brandobj.storeId}` });
      }
      // if (!mongoose.Types.ObjectId.isValid(Brandobj.storeId)) {
      //   return res.status(404).send({ message: `Invalid storeId: ${Brandobj.storeId}` });
      // }

      // const validStoreId = await Stores.findOne({_id: Brandobj.storeId });
      // if (!validStoreId) {
      //   return res.status(404).send({ message: `StoreId ${Brandobj.storeId} not found` });
      // }


      const result = await Brands.create(Brandobj);
      return res
        .status(200)
        .json({ message: "Your Brand Created Sccessfull", StoreData: result });
    } catch (err) {
      return res.status(500).json({ message: "storeid not valid" });
    }
  }
};

export const brandbynames = async (req, res) => {
  try {
    const name = req.query.name;
    const findbrand = await brand.findOne({ brandName: name });
    if (!findbrand) {
      return res.send({ msg: "Brand not found" });
    }
    res.status(200).send(findbrand);
  } catch (err) {
    console.log("Error is  ", err);
    return res.status(401).send({ msg: "internal error", err });
  }
};

export const updatebrands = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());
  if (!errors.isEmpty()) {
    return res.json({
      message: errors.array()[0].msg,
    });
  }

  try {
    const id = req.params.id;
    const isValidBlogId = mongoose.Types.ObjectId.isValid(id);

    if (!isValidBlogId) {
      return res.status(404).json({ msg: "Invalid brand ID" });
    }
    const updatebranddat = await brand.findById(id);
    
    
    if (!updatebranddat) {
      return res.status(404).send({ message: "Brand Id not Found" });
    }
    
    updatebranddat.brandName = req.body.brandName
      ? req.body.brandName
      : updatebranddat.brandName;
    updatebranddat.description = req.body.description?req.body.description:updatebranddat.description;
    updatebranddat.address = req.body.address?req.body.address:updatebranddat.address;
    updatebranddat.logo = req.body.logo?req.body.logo:updatebranddat.logo;
    updatebranddat.status = req.body.status?req.body.status:updatebranddat.status;
    updatebranddat.storeId = req.body.storeId?req.body.storeId:updatebranddat.storeId
    
    if (req.file) {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path);
      updatebranddat.image = uploadResult.secure_url;
    }
    
    // const isValidStoreId = mongoose.Types.ObjectId.isValid(req.body.storeId);

    // if (isValidStoreId) {
    //   return res.status(404).json({ msg: "Invalid stores ID" });
    // }
    let savebrand = await updatebranddat.save();
    res.status(200).send({
      message: "Brand has been updated successfully",
      savebrand:savebrand
    });
  } catch (err) {
   
    return res.status(500).send({ msg: "StoreId Invalid"});
  }
};



export const deleteBrand = async(req,res)=>{
  const id = req.params.id
  try{
     const result = await brand.findByIdAndDelete({_id:id})
     if(!result){
      return res.status(404).send({message:"brand Id not founded"})
     }
     return res.status(200).send({message:`stores ${id} deleted Scessfull`,DeleteStore:result})
  }
  catch (err) {
    console.log("Error is  ", err);
    return res.status(401).send({ msg: "internal error", err });
  }

}


export const getallBrand = async(req,res)=>{
  let ownerid = req.id
  const { page, limit } = req.query;
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    const skip = (page - 1) * limit;


    
    
  const result = await brand.findOne({store_ownerId:ownerid}).skip(skip).limit(limit);
  res.send(result)
}