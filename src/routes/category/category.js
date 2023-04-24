import express from "express";
import * as CategoryCtrl from "../../controller/category";
import { constants as VALIDATION } from "../../constant/validation";
import { uservalidation } from "../../validation/user.validation";
import * as MiidlewareUser from "../../midlleware/auth";
const routes = express.Router();

const PATH = {
  CATEGOREY: "/create",
//   Getcategorey: "/getcategorey",
  UpdateCategorey: "/update/:id",
   gerC: "/getcat",
  Delete: "/delete/:id",
};
routes.post(
  PATH.CATEGOREY,
  MiidlewareUser.verfiytoken,

  uservalidation(VALIDATION.CATEGORY),
  CategoryCtrl.Categorycreate
);

routes.put(
  PATH.UpdateCategorey,
  MiidlewareUser.verfiytoken,
 
  uservalidation(VALIDATION.CATEGORY),
  CategoryCtrl.updateCategory
);

routes.get(
  PATH.gerC,
  MiidlewareUser.verfiytoken,
 
  CategoryCtrl.getAllCategorey
);
routes.delete(
  PATH.Delete,
  MiidlewareUser.verfiytoken,
  
  CategoryCtrl.deletedProduct
);

export default routes;
