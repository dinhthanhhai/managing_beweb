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
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });

  try {
    const [rows, fields] = await connection.execute("SELECT * FROM users");
    return rows;
  } catch (error) {
    console.log("Check err: ", error);
  }
};

//delete user
const deleteUser = async (id) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });

  try {
    const [rows, fields] = await connection.execute(
      "DELETE FROM users WHERE id = ?",
      [id]
    );
    return rows;
  } catch (error) {
    console.log("Check err: ", error);
  }
};

const getUserById = async (id) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });

  try {
    const [rows, fields] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows;
  } catch (error) {
    console.log("Check err: ", error);
  }
};

const updateUserInfo = async (email, username, id) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });

  try {
    const [rows, fields] = await connection.execute(
      "UPDATE users SET email = ?, username = ? WHERE id = ?",
      [email, username, id]
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
