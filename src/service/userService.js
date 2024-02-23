import mysql from "mysql2/promise";
import bluebird from "bluebird";
import bcrypt from "bcryptjs";
import db from "../models//index";

const salt = bcrypt.genSaltSync(10);

//hash password
const hashUserPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};
//create new user
const createNewUser = async (email, password, username) => {
  let hashPassword = hashUserPassword(password);

  try {
    await db.User.create({
      username: username,
      email: email,
      password: hashPassword,
    });
  } catch (error) {
    console.log("Check err: ", error);
  }
};
//get list users
const getUserList = async () => {
  //test association
  try {
    let arrs = await db.User.findAll();
    // console.log("check new user: ", newUser);
    // let arr = [];
    // arr = [...arr, newUser];
    return arrs;
  } catch (error) {
    console.log("Check err: ", error);
  }
};

//delete user
const deleteUser = async (userId) => {
  try {
    await db.User.destroy({
      where: { id: userId },
    });
  } catch (error) {
    console.log("Check err: ", error);
  }
};

//get user
const getUserById = async (id) => {
  let user = {};
  user = await db.User.findOne({ where: { id: id } });
  return user;
};

//update user info
const updateUserInfo = async (email, username, id) => {
  try {
    await db.User.update(
      { email: email, username: username },
      { where: { id: id } }
    );
  } catch (error) {
    console.log("Check err: ", error);
  }
};

module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
  getUserById,
  updateUserInfo,
};
