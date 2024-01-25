import mysql from "mysql2/promise";
import bluebird from "bluebird";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);
// connect db

//hash password
const hashUserPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};
//create new user
const createNewUser = (email, password, username) => {
  let hashPassword = hashUserPassword(password);

  connection.query(
    "INSERT INTO users (email,password,username) VALUES (?, ?, ?)",
    [email, hashPassword, username],
    function (err, results, fields) {
      console.log(results);
    }
  );
};
//get list users
const getUserList = async () => {
  let users = [];
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "jwt",
    Promise: bluebird,
  });
  //   return (
  //     connection.query("SELECT * FROM users"),
  //     function (err, results, fields) {
  //       if (err) {
  //         console.log(err);
  //         return users;
  //       }

  //       users = results;
  //       return users;
  //     }
  //   );
  try {
    const [rows, fields] = await connection.execute("SELECT * FROM users");
    // console.log("Check rows: ", rows);
    return rows;
  } catch (error) {
    console.log("Check err: ", error);
  }
};

module.exports = {
  createNewUser,
  getUserList,
};
