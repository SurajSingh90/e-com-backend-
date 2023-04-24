import { body } from "express-validator";
import { constants as VALIDATOR } from "../constant/validation";

export const uservalidation = (method) => {
  let error = [];
  switch (method) {
    case VALIDATOR.SINGUP: {
      error = [
        body("name", "Please enter your first name").not().isEmpty(),

        body("password", "Please enter your password").not().isEmpty(),

        body("email", "Please enter your email").isEmail().not().isEmpty(),
      ];
      break;
    }
    case VALIDATOR.LOGIN_USER: {
      error = [
        body("password", "Please Enter Passwords").trim().notEmpty(),
        body("email", "Please enter email").isEmail(),
      ];
      break;
    }

    case VALIDATOR.STORE: {
      error = [
        body("storename", "Please enter your storename").not().isEmpty(),
        body("description", "Please enter your description").not().isEmpty(),
        body("phone").custom((value) => {
          if (!value || value.length !== 10 || isNaN(value)) {
            throw new Error("Phone number must be exactly 10 digits");
          }
          return true;
        }),

        body("address", "Please enter address").not().isEmpty(),
        body("city", "Please enter your city").not().isEmpty(),
        body("state", "Please enter your  state").not().isEmpty(),
        body("country", "Please enter your  country").not().isEmpty(),

        body("image").custom((value, { req }) => {
          if (!req.file) {
            throw new Error("Please upload Image");
          }
          if (!req.file.mimetype.startsWith("image/")) {
            throw new Error("File must be an image");
          }
          return true;
        }),
      ];
      break;
    }
    case VALIDATOR.Brand: {
      error = [
        body("brandName", "Please enter your brandName").not().isEmpty(),
        body("description", "Please enter your description").not().isEmpty(),

        body("address", "Please enter address").not().isEmpty(),
        body("status", "Please enter  status").not().isEmpty(),
        body("storeId", "Please enter your storeId").not().isEmpty(),

        body("logo").custom((value, { req }) => {
          if (!req.file) {
            throw new Error("Please upload logo");
          }
          if (!req.file.mimetype.startsWith("image/")) {
            throw new Error("File must be an image");
          }
          return true;
        }),
      ];
      break;
    }
    case VALIDATOR.CATEGORY: {
      error = [
        body("categoryName", "Please Enter category Name ").trim().notEmpty(),
      ];
      break;
    }

    case VALIDATOR.Product: {
      error = [
        body("productName", "Please enter your productName").not().isEmpty(),
        body("description", "Please enter your description").not().isEmpty(),

        body("categoryId", "Please enter categoryId").not().isEmpty(),
        body("price", "Please enter  price").not().isEmpty(),
        body("brandId", "Please enter brandId").not().isEmpty(),
        body("quantity", "Please enter  quantity").not().isEmpty(),
        body("storeId", "Please enter your storeId").not().isEmpty(),

        body("image").custom((value, { req }) => {
          if (!req.files || req.files.length === 0) {
            throw new Error("Please upload at least one image");
          }
          for (const file of req.files) {
            if (!file.mimetype.startsWith("image/")) {
              throw new Error("All files must be images");
            }
          }
          return true;
        }),
        
      ];
      break;
    }
  }
  return error;
};
