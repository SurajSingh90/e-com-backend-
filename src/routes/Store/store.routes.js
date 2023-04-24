import express from "express";
import * as StoreCtrl from "../../controller/store";
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
}).single("image");
const PATH = {
  Store: "/create",
  getowner: "/getowner",
  searchname: "/searchname",
  updateStore: "/updateStore/:id",
  DeletdStore: "/deleted/:id",
  AllStore: '/getall'
};

routes.post(
  PATH.Store,
  MiidlewareUser.verfiytoken,
  MiidlewareUser.checkOwners,
  uploads,
  uservalidation(VALIDATION.STORE),

  StoreCtrl.createStore
);

routes.get(PATH.getowner, MiidlewareUser.verfiytoken, StoreCtrl.getowners);
routes.get(PATH.searchname, MiidlewareUser.verfiytoken, StoreCtrl.storebynames);
routes.put(
  PATH.updateStore,
  uploads,
  uservalidation(VALIDATION.STORE),
  MiidlewareUser.verfiytoken,
  StoreCtrl.updateStore
);
routes.delete(PATH.DeletdStore,MiidlewareUser.verfiytoken,StoreCtrl.deleteStore )
// routes.get(PATH.AllStore,MiidlewareUser.verfiytoken,StoreCtrl.getallStore )
export default routes;
