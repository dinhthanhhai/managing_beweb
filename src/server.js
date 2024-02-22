import express from "express";
import initWebRoutes from "./routes/web";
import configViewEngine from "./config/viewEngine";
require("dotenv").config();
import bodyParser from "body-parser";
import connection from "./config/connectDB";

const app = express();

const PORT = process.env.PORT || 8080;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Content-Type",
    "Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

//config view engine
configViewEngine(app);

//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//test connection db
connection();

//init web routes
initWebRoutes(app);

app.listen(PORT, () => {
  console.log(`JWT backend is listening on port ${PORT}`);
});
