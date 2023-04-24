import Owners from "../model/owner_Auth";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../config/database.js";
import store from "../model/store";
import product from "../model/product";
import brand from "../model/brand";
import owner_Auth from "../model/owner_Auth";
export const ownerscreate = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());

  let obj = {
    name: req.body.name,

    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12),
  };

  try {
    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    } else {
      const result = await Owners.create(obj);
      res.status(200).json({
        message: "Your Profile Created Success Full",
        YourData: result,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal error" });
  }
};

export const loginpage = async (req, res) => {
  const finduser = await Owners.findOne({ email: req.body.email });
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    }
    if (!finduser) {
      return res.status(404).send({ message: "email Not Founded" });
    }
    const validpassword = bcrypt.compareSync(
      req.body.password,
      finduser.password
    );

    console.log("userdata===", finduser.password);
    if (!validpassword) {
      res.status(400).send({ msg: "password is wrong" });
      return;
    }
    const token = jwt.sign({ id: finduser._id }, Token.TokenData);
    return res.send({
      id: finduser._id,
      name: finduser.name,
      email: finduser.email,
      acesstoken: token,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// export const getallOwner = async (req, res) => {
//   try {

//     const { page, limit } = req.query;
//     if (!page) {
//       return res.status(404).json({ message: "Page not found" });
//     }
//     const skip = (page - 1) * limit;
    
//     const ownereData = await owner_Auth.find().skip(skip).limit(limit);
//     let StoreOwnerList = [];
//     for (let i = 0; i < ownereData.length; i++) {
//       const owner = ownereData[i];

//       let ownersDatasObj = {
//         ownerName: owner.name,
//         ownerEmail: owner.email,
//         ownerData: [],
//       };
//       const stores = await store.find({ store_ownerId: owner._id });
//       for (let j = 0; j < stores.length; j++) {
//         const storeDetails = stores[j];

//         const products = await product
//           .find({ store_ownerId: owner._id })
//           .count();

//         const brandData = await brand
//           .find({ store_ownerId: owner._id })
//           .count();

//         ownersDatasObj.ownerData.push({
//           storeName: storeDetails.storename,
//           storeCountry: storeDetails.country,
//           totalProducts: products,
//           totalBrands: brandData,
//         });
//       }

//       // return res.send(ownersDatasObj);
//       StoreOwnerList.push(ownersDatasObj);
//     }
//     return res.send({ message: "All Store Owner list", StoreOwnerList });
//   } catch (error) {
//     return res.status(500).json(error);
//   }
// };



export const getallOwner = async (req, res) => {
  try {

    // const { page, limit } = req.query;
    // if (!page) {
    //   return res.status(404).json({ message: "Page not found" });
    // }
    // const skip = (page - 1) * limit;
    
    const StoreOwnerList = await owner_Auth.aggregate([
      // { $skip: skip },
      // { $limit: limit },
      {
        $lookup: {
          from: "stores",
          localField: "_id",
          foreignField: "store_ownerId",
          as: "stores"
        }
      },
      // {
      //   $unwind: {
      //     path: "$stores",
      //     preserveNullAndEmptyArrays: true
      //   }
      // },
      // {
      //   $lookup: {
      //     from: "products",
      //     localField: "_id",
      //     foreignField: "store_ownerId",
      //     as: "products"
      //   }
      // },
      // {
      //   $lookup: {
      //     from: "brands",
      //     localField: "_id",
      //     foreignField: "store_ownerId",
      //     as: "brands"
      //   }
      // },
      // {
      //   $group: {
      //     _id: "$_id",
      //     ownerName: { $first: "$name" },
      //     ownerEmail: { $first: "$email" },
          
      //     ownerData: {
      //       $push: {
      //         storeName: "$stores.storename",
      //         storeCountry: "$stores.country",
      //         totalProducts: { $size: "$products" },
      //         totalBrands: { $size: "$brands" }
      //       }
      //     }
      //   }
      // }
    ]);

    return res.send({ message: "All Store Owner list", StoreOwnerList });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// get all storeowner list by aggreations
// 1>storeownername
// 2>email
// 3>phone 
// 4>storeName 
// 5>totalProducts
// 6>totalbrands