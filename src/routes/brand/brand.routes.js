import express from "express";
import * as BrandCtrl from "../../controller/brand";
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
}).single("logo");
const PATH = {
  Brand: "/create",
  Searchbyname: "/searchname",
  updatesbrand: "/updates/:id",
  Delete: "/delete/:id",
  GetBrand: "/getbrand"
};

routes.post(
  PATH.Brand,

  MiidlewareUser.verfiytoken,
  uploads,
  uservalidation(VALIDATION.Brand),

  BrandCtrl.createBrand
);
routes.get(
  PATH.Searchbyname,
  MiidlewareUser.verfiytoken,
  BrandCtrl.brandbynames
);
// routes.post(PATH.LOGIN, uservalidation(VALIDATION.LOGIN_USER), userCtrl.loginpage);
routes.put(
  PATH.updatesbrand,
  MiidlewareUser.verfiytoken,
  uploads,
  uservalidation(VALIDATION.Brand),
  BrandCtrl.updatebrands
);

routes.get(PATH.GetBrand , MiidlewareUser.verfiytoken, BrandCtrl.getallBrand)
routes.delete(PATH.Delete, MiidlewareUser.verfiytoken, BrandCtrl.deleteBrand);
export default routes;
