import jwt from "jsonwebtoken";
require("dotenv").config();

const nonSecurePaths = ["/", "/login", "/register"];

//tao access token
const createAccessToken = (user) => {
  let key = process.env.JWT_ACCESS_KEY;
  let access_token = null;
  try {
    const payload = {
      email: user.email,
      username: user.username,
      groupWithRoles: user.groupWithRoles,
    };
    access_token = jwt.sign(payload, key, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });
  } catch (error) {
    console.log(error);
  }

  return access_token;
};

//tao refresh token
const createRefreshToken = (user) => {
  let key = process.env.JWT_REFRESH_KEY;
  let refresh_token = null;
  try {
    const payload = {
      email: user.email,
      username: user.username,
      groupWithRoles: user.groupWithRoles,
    };
    refresh_token = jwt.sign(payload, key, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });
  } catch (error) {
    console.log(error);
  }

  return refresh_token;
};

//verify refresh token
const verifyToken = (token) => {
  let key = process.env.JWT_REFRESH_KEY;
  let decoded = null;

  try {
    decoded = jwt.verify(token, key);
  } catch (error) {
    console.log("xxxx", error);
  }
  return decoded;
};

//kiem tra user da dang nhap
const checkUserJWT = (req, res, next) => {
  if (nonSecurePaths.includes(req.path)) return next();

  let cookies = req.cookies;
  if (cookies && cookies.refresh_token) {
    let token = cookies.refresh_token;
    let decoded = verifyToken(token);
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
      EM: "Not authenticated the user!",
      DT: "",
    });
  }
};

//kiem tra user da dang nhap
const verifyUser = (req, res, next) => {
  // if (nonSecurePaths.includes(req.path)) return next();
  const tokenFromHeader = req.headers.authorization;
  if (tokenFromHeader) {
    const accessToken = tokenFromHeader.split(" ")[1];
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
      if (err) {
        return res.status(403).json("Token is not valid!");
      }
      req.user = user;
      req.refresh_token = accessToken;
      next();
    });
  } else {
    return res.status(401).json("You're not authenticated1232131");
  }
};

//kiem tra quyen user voi cac route
const checkUserPermission = (req, res, next) => {
  if (nonSecurePaths.includes(req.path) || req.path === "/account")
    return next();

  if (req.user) {
    let refresh_token = req.cookies.refresh_token;
    console.log("req.user: ", req.user);
    let roles = req.user.groupWithRoles?.Roles;
    let currentUrl = req.path;
    console.log(currentUrl);
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
  verifyUser,
};
