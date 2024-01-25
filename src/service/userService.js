import mysql from "mysql2/promise";
import bluebird from "bluebird";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

//hash password
const hashUserPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};
//create new user
const createNewUser = async (email, password, username) => {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });

  let hashPassword = hashUserPassword(password);

  try {
    const [rows, fields] = await connection.execute(
      "INSERT INTO users (email,password,username) VALUES (?, ?, ?)",
      [email, hashPassword, username]
    );
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
  } catch (error) {
    console.log("Check err: ", error);
  }
};

module.exports = {
  createNewUser,
  getUserList,
  deleteUser,
};
