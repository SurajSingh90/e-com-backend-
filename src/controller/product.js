import { validationResult } from "express-validator";
// import Stores from "../model/store";
import cloudinary from "cloudinary";
import product from "../model/product";
import owner_Auth from "../model/owner_Auth";
import store from "../model/store";
import category from "../model/category";
import mongoose from "mongoose";
import brand from "../model/brand";
cloudinary.config({
  cloud_name: "dzidawevj",
  api_key: "745231798445212",
  api_secret: "RU_ekzheCagO1QErVCps5P2C038",
});

export const productBrand = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());
  if (!errors.isEmpty()) {
    return res.json({
      message: errors.array()[0].msg,
    });
  } else {
    let productobj = {
      productName: req.body.productName,
      description: req.body.description,
      categoryId: req.body.categoryId,
      price: req.body.price,
      brandId: req.body.brandId,
      quantity: req.body.quantity,
      storeId: req.body.storeId,
      // image: req.files.path,
      store_ownerId: req.id,
    };

    try {
      const existProductname = await product.findOne({
        productName: productobj.productName,
      });
      if (existProductname) {
        return res.status(403).json({ message: "Product Name Allready Exist" });
      }
      const isValidBlogId = mongoose.Types.ObjectId.isValid(productobj.storeId);

      if (!isValidBlogId) {
        return res.status(404).json({ msg: "StoreId Not found" });
      }
      const storeid = await store.findOne({ _id: productobj.storeId });

      if (!storeid) {
        return res.status(404).json({ msd: "StoreId Not found" });
      }

      const isValidBrandId = mongoose.Types.ObjectId.isValid(
        productobj.brandId
      );

      if (!isValidBrandId) {
        return res.status(404).json({ msg: "BrandId Not found" });
      }

      const brandid = await brand.findOne({ _id: productobj.brandId });

      if (!brandid) {
        return res.status(404).json({ msg: "BrandId Not found" });
      }
      
      const imageUrls = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
      }
      let ownerId = req.id
      const ownerStoreid = await store.findOne({store_ownerId:ownerId, _id: productobj.storeId})
      if(!ownerStoreid){
        return res.status(404).send({msg:"You have not storeID"})
      }
      const ownerbrandid = await brand.findOne({store_ownerId:ownerId, _id: productobj.brandId})
      if(!ownerbrandid){
        return res.status(404).send({msg:"You have not BrandID"})
      }
      productobj.image = imageUrls;
      console.log("iamgessss", productobj.image);

      const result = await product.create(productobj);
      return res
        .status(200)
        .json({ message: "Your Brand Created Sccessfull", StoreData: result });
    } catch (err) {
      return res.status(500).json({ message: "internal errorr", err });
    }
  }
};

export const allproductList = async (req, res) => {
  try {
    const { page, limit } = req.query;
    if (!page || !limit) {
      return res.status(404).json({ message: "Page not found" });
    }
    const skip = (page - 1) * 2;
    const owerData = await owner_Auth.find().skip(skip).limit(limit);

    let productData = [];

    for (let i = 0; i < owerData.length; i++) {
      const owner = owerData[i];

      let ownerData = {
        ownerName: owner.name,
        ownerEmail: owner.email,
        stores: [],
      };

      const stores = await store.find({ store_ownerId: owner._id });

      for (let j = 0; j < stores.length; j++) {
        const storeData = stores[j];

        let storeProducts = [];

        const products = await product.find({ store_ownerId: owner._id });
        console.log("producysssss", products);
        const categoryData = await category.findOne({
          userId: owerData[i]._id,
        });
        for (let k = 0; k < products.length; k++) {
          const productData = products[k];

         

          storeProducts.push({
            productName: productData.productName,
            productImage: productData.image,
            Price: productData.price,
            Quantity: productData.quantity,
            category: categoryData.categoryName,
          });

         
        }

        ownerData.stores.push({
          storeName: storeData.storename,
          storeCountry: storeData.country,
          products: storeProducts,
        });
      }

      productData.push(ownerData);
    }

    return res
      .status(200)
      .json({ Prodctsdata: "All Products List", productData });
  } catch (err) {
    console.log("errrrrrrrr=====", err);
    return res.status(500).json({ message: "internal errorr", err });
  }
};

export const searchprodct = async (req, res) => {
  try {
    const productName = req.query.productName;
    const findname = await product.find({ productName: productName });
    if (!findname) {
      return res.status(404).send(findname);
    }
    res.send(findname);
  } catch (err) {
    console.log("errrrrrrrr=====", err);
    return res.status(500).json({ message: "internal errorr", err });
  }
};

export const updatesprocudt = async (req, res) => {
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
      return res.status(404).json({ msg: "Invalid Products ID" });
    }

    const storedata = await product.findById(id);
    if (!storedata) {
      res.status(404).send({ message: "Products Id not Founded" });
    }

    storedata.productName = req.body.productName
      ? req.body.productName
      : storedata.productName;
    storedata.brandId = req.body.brandId ? req.body.brandId : storedata.brandId;
    storedata.description = req.body.description
      ? req.body.description
      : storedata.description;
    storedata.categoryId = req.body.categoryId
      ? req.body.categoryId
      : storedata.categoryId;
    // storedata.image = req.files.path ? req.files.path : storedata.image;
    storedata.quantity = req.body.quantity
      ? req.body.quantity
      : storedata.quantity;
    storedata.price = req.body.price ? req.body.price : storedata.price;

    if (req.id != storedata.store_ownerId) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    const imageUrls = [];
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }

    storedata.image = imageUrls;

    const isValidStorId = mongoose.Types.ObjectId.isValid(req.body.storeId);

    if (!isValidStorId) {
      return res.status(404).json({ msg: "StoreId Not found" });
    }
    const storeid = await store.findOne({ _id: req.body.storeId });

    if (!storeid) {
      return res.status(404).json({ msd: "StoreId Not found" });
    }

    const isValidBrandId = mongoose.Types.ObjectId.isValid(req.body.brandId);

    if (!isValidBrandId) {
      return res.status(404).json({ msg: "BrandId Not found" });
    }

    const brandid = await brand.findOne({ _id: req.body.brandId });

    if (!brandid) {
      return res.status(404).json({ msd: "brandId Not found" });
    }

    const isValidcategorey = mongoose.Types.ObjectId.isValid(
      req.body.categoryId
    );

    if (!isValidcategorey) {
      return res.status(404).json({ msg: "CategoreyId Not found" });
    }
    const cid = await category.findOne({ _id: req.body.categoryId });

    if (!cid) {
      return res.status(404).send("CategoryId Not found");
    }

    const updtaesprodcuts = await storedata.save();
    return res.status(200).json({
      message: "Products Update Sccessfull",
      ProductsData: updtaesprodcuts,
    });
  } catch (err) {
    return res.status(500).json({ message: "internal errorr", err });
  }
};

export const deletedProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await product.findByIdAndDelete({ _id: id });
    if (!result) {
      return res.status(404).send({ message: "Products Id not founded" });
    }
    return res.status(200).send({
      message: `Products ${id} deleted Scessfull`,
      DeleteProducts: result,
    });
  } catch (err) {
    console.log("Error is  ", err);
    return res.status(401).send({ msg: "internal error", err });
  }
};

export const getAllprodctss = async (req, res) => {
  const { page, limit } = req.query;
  if (!page) {
    return res.status(404).json({ message: "Page not found" });
  }
  const skip = (page - 1) * limit;
  const result = await product.find().skip(skip).limit(limit);
  if (!result) {
    return res.status(404).sen({ msg: "Products Not Foundedd" });
  }
  res.status(200).send({ message: "All Products List", ProductList: result });
};
