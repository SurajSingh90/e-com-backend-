import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Token from "../config/database.js";
import admin from "../model/admin.js";

export const admincreate = async (req, res) => {
  const errors = validationResult(req);

  console.log("errors===============", errors.array());

  let obj = {
    name: req.body.name,

    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 12),
    usertype: req.body.usertype,
  };

  try {
    if (!errors.isEmpty()) {
      return res.json({
        message: errors.array()[0].msg,
      });
    } else {
      const emailfind = await admin.findOne({ email: obj.email });
      console.log("emaillllllllllllllllll", emailfind);
      if (emailfind) {
        return res.status(403).send({ message: "Email Allready Exist " });
      }
      const result = await admin.create(obj);
      res.status(200).json({
        message: "Your admin Created Success Full",
        YourData: result,
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "internal error" });
  }
};

export const loginpage = async (req, res) => {
  const finduser = await admin.findOne({ email: req.body.email });
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
