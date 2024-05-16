import jwt from "jsonwebtoken";
require("dotenv").config();

const nonSecurePaths = ["/", "/login", "/register", "/logout"];

const createAccessToken = async (payload) => {
  let key = process.env.JWT_ACCESS_KEY;
  let access_token = null;
  try {
    delete payload.exp;
    access_token = await jwt.sign(payload, key, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
  } catch (error) {
    console.log(error);
  }

  return access_token;
};
const createRefreshToken = async (payload) => {
  let key = process.env.JWT_REFRESH_KEY;
  let refresh_token = null;
  try {
    delete payload.exp;
    refresh_token = await jwt.sign(payload, key, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
  } catch (error) {
    console.log(error);
  }

  return refresh_token;
};

const verifyToken = async (token) => {
  let key = process.env.JWT_REFRESH_KEY;
  let decoded = null;

  try {
    decoded = await jwt.verify(token, key);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

// const extractToken = (req) => {
//   if (
//     req.headers.authorization &&
//     req.headers.authorization.split(" ")[0] === "Bearer"
//   ) {
//     // console.log(req.headers.authorization.split(" ")[1]);
//     return req.headers.authorization.split(" ")[1];
//   }
//   return null;
// };

const checkUserJWT = async (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();

  let cookies = req.cookies;
  // const tokenFromHeader = extractToken(req);

  if (cookies && cookies.refresh_token) {
    let token = cookies.refresh_token;
    let decoded = await verifyToken(token);
    if (decoded) {
      req.user = decoded;
      req.token = token;
      next();
    } else {
      return res.status(401).json({
        EC: -1,
        EM: "Not authenticated the user!",
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      EM: "Not authenticated the user1!",
      DT: "",
    });
  }
};

const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/account")
    return next();

  if (req.user) {
    console.log("req.user: ", req.user);
    let roles = req.user.groupWithRoles?.Roles;
    let currentUrl = req.path;
    if (!roles || roles.length === 0) {
      return res.status(403).json({
        EC: -1,
        EM: `You dont have the permission to access this resource...`,
        DT: "",
      });
    }
    let canAccess = roles.some((item) => item.url == currentUrl);
    if (canAccess === true) {
      next();
    } else {
      return res.status(403).json({
        EC: -1,
        EM: `You dont have the permission to access this resource...`,
        DT: "",
      });
    }
  } else {
    return res.status(401).json({
      EC: -1,
      EM: "Not authenticated the user!",
      DT: "",
    });
  }
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyToken,
  checkUserJWT,
  checkUserPermission,
};
