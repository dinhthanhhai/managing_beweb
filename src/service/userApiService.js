import db from "../models/index";
import {
  checkEmailExist,
  checkPhoneExist,
  hashUserPassword,
} from "./loginRegisterService";

//Lay danh sach user
const getAllUser = async () => {
  try {
    let users = await db.User.findAll({
      attributes: ["id", "username", "email", "phone", "sex"],
      include: { model: db.Group, attributes: ["name", "description"] },
    });
    if (users) {
      return {
        EM: "Get data success!",
        EC: 0,
        DT: users,
      };
    } else {
      return {
        EM: "Something wrongs with service!",
        EC: 1,
        DT: [],
      };
    }
  } catch (error) {
    console.log(error);
  }
};

//Phan trang
const getUserWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    let { count, rows } = await db.User.findAndCountAll({
      offset: offset,
      limit: limit,
      attributes: ["id", "username", "email", "phone", "sex", "address"],
      include: { model: db.Group, attributes: ["name", "description", "id"] },
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      users: rows,
    };

    return {
      EM: "Get data success!",
      EC: 0,
      DT: data,
    };

    console.log(">>check data: ", data);
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs with service!",
      EC: 1,
      DT: [],
    };
  }
};

const createNewUser = async (data) => {
  try {
    //check email, phone + hash pw
    let isEmailExist = await checkEmailExist(data.email);
    if (isEmailExist === true) {
      return {
        EM: "Email is already exist",
        EC: 1,
        DT: "email",
      };
    }
    let isPhoneExist = await checkPhoneExist(data.phone);
    if (isPhoneExist === true) {
      return {
        EM: "Phone number is already exist",
        EC: 1,
        DT: "phone",
      };
    }
    //hash password
    let hashPassword = hashUserPassword(data.password);

    await db.User.create({ ...data, password: hashPassword });
    return {
      EM: "Create success!",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs with service!",
      EC: 1,
      DT: [],
    };
  }
};

const updateUser = async (data) => {
  try {
    console.log("check res data up: ", data);
    let user = await db.User.findOne({
      where: { email: data.email },
    });
    if (user) {
      console.log("check user data up: ", user);
      //update
      if (!data.groupId) {
        return {
          EM: "Error with empty group id!",
          EC: 1,
          DT: "group",
        };
      }
      await db.User.update(
        {
          username: data.username,
          address: data.address,
          sex: data.sex,
          groupId: data.groupId,
        },
        { where: { email: data.email } }
      );
      return {
        EM: "Update user success!",
        EC: 0,
        DT: "",
      };
    } else {
      return {
        EM: "User not found!",
        EC: 2,
        DT: "",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs with service!",
      EC: 1,
      DT: "",
    };
  }
};

const deleteUser = async (id) => {
  try {
    await db.User.destroy({
      where: { id: id },
    });
    return {
      EM: "Delete successed!",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log(error);
    return {
      EM: "Something wrongs with service!",
      EC: 1,
      DT: [],
    };
  }
};

module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
  getUserWithPagination,
};
