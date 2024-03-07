import db from "../models/index";

//Lay danh sach user
const getAllUser = async () => {
  let data = {
    EM: "",
    EC: "",
    DT: "",
  };
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

const createNewUser = async (data) => {
  try {
    await db.User.create({});
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllUser,
  createNewUser,
  updateUser,
  deleteUser,
};
