import express from "express";
import viewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
import configViewEngine from "./configs/viewEngine";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

//config view engine
configViewEngine(app);

//init web routes
initWebRoutes(app);

app.listen(PORT, () => {
  console.log(`JWT backend is listening on port ${PORT}`);
});
