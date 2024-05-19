require("dotenv").config();
const cors = require("cors");

const configCors = (app) => {
  const corsOptions = {
    origin: process.env.REACT_URL,
    methods: "GET,POST,PUT,PATCH,DELETE",
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
  };

  app.use(cors(corsOptions));

  // Ensure that preflight requests are handled
  app.options("*", cors(corsOptions));
};

export default configCors;
