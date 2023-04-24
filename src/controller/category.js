import Category from "../model/category";
import { validationResult } from "express-validator";

import mongoose from "mongoose";
import category from "../model/category";


export const Categorycreate = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());

  let obj = {
    categoryName: req.body.categoryName,
    userId: req.id,
  };

  try {
    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    } else {
      const find = await Category.findOne({categoryName:obj.categoryName})
      if(find){
        return res.status(403).json({message:"Category Name already exist"})
      }
      const result = await Category.create(obj);
      res.status(200).json({
        message: "Your Category Created Success Full",
        Category_id: result._id,
        Category_name: result.categoryName,
        userId: result.userId,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal error" });
  }
};



export const updateCategory = async (req, res) => {
 

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
      return res.status(404).json({ msg: "Invalid Categorey ID" });
    }

    const storedata = await Category.findById(id);
    if (!storedata) {
      return res.status(404).json({ message: `Categorey ${id} Not Found` });
    }
    storedata.categoryName = req.body.categoryName
      ? req.body.categoryName
      : storedata.categoryName;
   
    const savedata = await storedata.save();
    res
      .status(200)
      .json({ message: "Categorey Update Sccessfull", StoreData: savedata });
  } catch (err) {
    console.log("errrrrrrrr", err);
    return res.status(500).json({ message: "internal errorr", err });
  }
};


export const getAllCategorey = async (req, res) => {
  const result = await category.find();
  res.status(200).send({ message: "All Category List", Category: result });
};



export const deletedProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await category.findByIdAndDelete({ _id: id });
    if (!result) {
      return res.status(404).send({ message: "categorey Id not founded" });
    }
    return res
      .status(200)
      .send({
        message: `categorey ${id} deleted Scessfull`,
        DeleteProducts: result,
      });
  } catch (err) {
    console.log("Error is  ", err);
    return res.status(401).send({ msg: "internal error", err });
  }
};