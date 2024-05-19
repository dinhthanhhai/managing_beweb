require("dotenv").config();
import db from "../models/index";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import { getGroupWithRoles } from "./JWTservice";
import { createAccessToken, createRefreshToken } from "../middleware/JWTAction";
require("dotenv").config();

const salt = bcrypt.genSaltSync(10);

//Hash pw
const hashUserPassword = (userPassword) => {
  return bcrypt.hashSync(userPassword, salt);
};

//Kiem tra email da ton tai
const checkEmailExist = async (userEmail) => {
  let user = await db.User.findOne({
    where: { email: userEmail },
  });

  if (user) {
    return true;
  }
  return false;
};

//Kiem tra phone number da ton tai
const checkPhoneExist = async (userPhone) => {
  let user = await db.User.findOne({
    where: { phone: userPhone },
  });

  if (user) {
    return true;
  }
  return false;
};

//Tao user
const registerNewUser = async (rawUserData) => {
  try {
    //check email/phonenumber are exist
    let isEmailExist = await checkEmailExist(rawUserData.email);
    if (isEmailExist === true) {
      return {
        EM: "Email is already exist",
        EC: 1,
      };
    }
    let isPhoneExist = await checkPhoneExist(rawUserData.phone);
    if (isPhoneExist === true) {
      return {
        EM: "Phone number is already exist",
        EC: 1,
      };
    }
    //hash password
    let hashPassword = hashUserPassword(rawUserData.password);
    //create new user
    await db.User.create({
      email: rawUserData.email,
      phone: rawUserData.phone,
      username: rawUserData.username,
      password: hashPassword,
      groupId: 5,
    });

    return {
      EM: "A user is created!",
      EC: 0,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "Something wrongs in service...",
      EC: 1,
    };
  }
};

//Check password
const checkPassword = (inputPassword, hashPassword) => {
  return bcrypt.compareSync(inputPassword, hashPassword);
};

//Login
const handleUserLogin = async (rawData, res) => {
  try {
    let user = await db.User.findOne({
      where: {
        [Op.or]: [{ email: rawData.valueLogin }, { phone: rawData.valueLogin }],
      },
    });
    if (user) {
      let isCorrectPassword = checkPassword(rawData.password, user.password);
      if (isCorrectPassword === true) {
        //test role
        let groupWithRoles = await getGroupWithRoles(user);
        let payload = {
          email: user.email,
          username: user.username,
          groupWithRoles,
        };
        //tao token
        let access_token = await createAccessToken(payload);
        let refresh_token = await createRefreshToken(payload);
        //gan refresh_token vao cookie
        res.cookie("refresh_token", refresh_token, {
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });

        return {
          EM: "OK",
          EC: 0,
          DT: {
            access_token: access_token,
            groupWithRoles,
            email: user.email,
            username: user.username,
          },
        };
      }
    } else {
      return {
        EM: "Your email or phone number is incorrect!",
        EC: 1,
        DT: "",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs in service...",
      EC: 1,
      DT: "",
    };
  }
};

module.exports = {
  registerNewUser,
  handleUserLogin,
  hashUserPassword,
  checkEmailExist,
  checkPhoneExist,
  hashUserPassword,
};
