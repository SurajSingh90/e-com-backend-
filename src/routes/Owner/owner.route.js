import express from "express";
import * as userCtrl from "../../controller/owner";
import { constants as VALIDATION } from "../../constant/validation";
import { uservalidation } from "../../validation/user.validation";
import * as MiidlewareUser from "../../midlleware/auth";
const routes = express.Router();

const PATH = {
  SINGUP: "/singup",
  LOGIN:'/login',
  StoreOwner:'/ownerlist',
  // getowner:'/getowner'
};

routes.post(
  PATH.SINGUP,
  uservalidation(VALIDATION.SINGUP),
  MiidlewareUser.EmailMiddle,
  userCtrl.ownerscreate
);

routes.post(PATH.LOGIN, uservalidation(VALIDATION.LOGIN_USER), userCtrl.loginpage);
routes.get(PATH.StoreOwner, userCtrl.getallOwner)

export default routes;
