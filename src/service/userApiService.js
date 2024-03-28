import db from "../models/index";
import loginRegisterService from "./loginRegisterService";

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
      attributes: ["id", "username", "email", "phone", "sex"],
      include: { model: db.Group, attributes: ["name", "description"] },
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
    await db.User.create(data);
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
    let user = await data.User.findOne({
      where: { id: data.id },
    });
    if (user) {
      //update
      await db.User.update(
        { email: email, username: username },
        { where: { id: id } }
      );
    } else {
      //not found user
    }
  } catch (error) {
    console.log(error);
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
