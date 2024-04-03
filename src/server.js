import express from "express";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import configViewEngine from "./config/viewEngine";
require("dotenv").config();
import bodyParser from "body-parser";
// import connection from "./config/connectDB";
import configCors from "./config/cors";
import { cretateJWT, verifyToken } from "./middleware/JWTAction";

const app = express();

const PORT = process.env.PORT || 8080;

//config cors
configCors(app);

//config view engine
configViewEngine(app);

//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//test connection db
// connection();

//test jwt
cretateJWT();
let decodedData = verifyToken(
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiaGFpIiwiYWRkcmVzcyI6ImJhYyBuaW5oIiwiaWF0IjoxNzEyMTU2ODY3fQ.3HEoRBNEylR3wX0KZHkY2v3JlKfXn19TiWvLgElBZB4"
);
console.log(decodedData);

//init web routes
initWebRoutes(app);
initApiRoutes(app);

app.listen(PORT, () => {
  console.log(`JWT backend is listening on port ${PORT}`);
});
