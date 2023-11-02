const express = require("express");
const connectDB = require("./src/config/dbconnect");
const initRoutes = require("./src/routes");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 8000;
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

initRoutes(app);

app.listen(port, () => {
  console.log("server on ", port);
});
