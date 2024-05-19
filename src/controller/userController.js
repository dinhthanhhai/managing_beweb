import userApiService from "../service/userApiService";
import jwt from "jsonwebtoken";
import { createAccessToken, createRefreshToken } from "../middleware/JWTAction";

const readFunc = async (req, res) => {
  try {
    if (req.query.page && req.query.limit) {
      let page = req.query.page;
      let limit = req.query.limit;

      let data = await userApiService.getUserWithPagination(+page, +limit);
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });

      console.log(">>check data: page = ", page, " limit = ", limit);
    } else {
      let data = await userApiService.getAllUser();
      return res.status(200).json({
        EM: data.EM,
        EC: data.EC,
        DT: data.DT,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error  from server",
      EC: "-1",
      DT: "",
    });
  }
};

const createFunc = async (req, res) => {
  try {
    //validate
    let data = await userApiService.createNewUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  }
};

const updateFunc = async (req, res) => {
  try {
    let data = await userApiService.updateUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error  from server",
      EC: "-1",
      DT: "",
    });
  }
};

const deleteFunc = async (req, res) => {
  try {
    let data = await userApiService.deleteUser(req.body.id);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "error  from server",
      EC: "-1",
      DT: "",
    });
  }
};

const getUserAccount = async (req, res) => {
  return res.status(200).json({
    EM: "ok",
    EC: 0,
    DT: {
      access_token: req.token,
      groupWithRoles: req.user.groupWithRoles,
      email: req.user.email,
      username: req.user.username,
    },
  });
};
//refresh token
const requestRefreshToken = (req, res) => {
  let refresh_token = req.cookies.refresh_token;
  const tokenFromHeader = req.headers.authorization;
  if (!refresh_token) return res.status(401).json("You're not authenticated!");
  jwt.verify(refresh_token, process.env.JWT_REFRESH_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json("Invalid refresh token");
    } else {
      const user = decoded;
      const newAccessToken = createAccessToken(user);
      const newRefreshToken = createRefreshToken(user);
      res.cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "None",
      });
      return res.status(200).json({ access_token: newAccessToken });
    }
  });
};
//logout
const logoutUser = async (req, res) => {
  res.clearCookie("refresh_token");
  return res.status(200).json({
    EM: "Logged out",
    EC: 0,
    DT: "",
  });
};

module.exports = {
  readFunc,
  createFunc,
  updateFunc,
  deleteFunc,
  getUserAccount,
  requestRefreshToken,
  logoutUser,
};
