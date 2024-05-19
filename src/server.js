require("dotenv").config();
import express from "express";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import configViewEngine from "./config/viewEngine";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import configCors from "./config/cors";
// import configCors from "./config/configCors";

const app = express();

const PORT = process.env.PORT || 8080;

//config cors
configCors(app);

//config view engine
configViewEngine(app);

//config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//configcookies parser
app.use(cookieParser());

//init web routes
initWebRoutes(app);
initApiRoutes(app);

app.use((req, res) => {
  return res.send("404 not found");
});

app.listen(PORT, () => {
  console.log(`JWT backend is listening on port ${PORT}`);
});
