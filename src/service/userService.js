import mysql from "mysql2";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "jwt",
});

const hashUserPassword = (password) => {
  let hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

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

const getUserList = () => {
  let users = [];
  (users = connection.query("SELECT * FROM users")),
    function (err, results, fields) {
      console.log(results);
    };
};

module.exports = {
  createNewUser,
  getUserList,
};
