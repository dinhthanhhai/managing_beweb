import express from "express";
import homeController from "../controller/homeController";
import apiController, { testApi } from "../controller/apiController";
const router = express.Router();

const initWebRoutes = (app) => {
  router.get("/", homeController.handleHelloWorld);
  router.get("/user", homeController.handleUserPage);
  router.post("/users/create-user", homeController.handleCreateNewUser);
  router.post("/delete-user/:id", homeController.handleDeleteUser);
  router.get("/update-user/:id", homeController.getUpdateUser);
  router.post("/users/update-user", homeController.handleUpdateUser);

  //res api
  router.get("/api/test-api", testApi);

  return app.use("/", router);
};

export default initWebRoutes;
