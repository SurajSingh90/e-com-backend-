import express from "express";
import * as productCtrl from "../../controller/product";
import { constants as VALIDATION } from "../../constant/validation";
import { uservalidation } from "../../validation/user.validation";
import * as MiidlewareUser from "../../midlleware/auth";
import multer from "multer";
const routes = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({
  storage: storage,
});
const PATH = {
  Brand: "/create",
  AllPrd: "/allprd",
  SearchPrd: "/searchprd",
  updatesPrd: "/updatesprd/:id",
  DeletPrd:'/DeletPrd/:id',
  list:"/Prdlust"
};

routes.post(
  PATH.Brand,

  MiidlewareUser.verfiytoken,
  uploads.array("image", 12),
  uservalidation(VALIDATION.Product),

  productCtrl.productBrand
);

routes.get(
  PATH.AllPrd,
  MiidlewareUser.verfiytoken,
  MiidlewareUser.IsAdmin,
  productCtrl.allproductList
);
routes.get(
  PATH.SearchPrd,
  MiidlewareUser.verfiytoken,
  productCtrl.searchprodct
);
routes.put(
  PATH.updatesPrd,
  MiidlewareUser.verfiytoken,
  uploads.array("image", 12),
  uservalidation(VALIDATION.Product),
  
  productCtrl.updatesprocudt
);

routes.delete(PATH.DeletPrd,  MiidlewareUser.verfiytoken, productCtrl.deletedProduct)
routes.get(PATH.list, MiidlewareUser.verfiytoken ,productCtrl.getAllprodctss )
export default routes;
