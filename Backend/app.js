const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const authRoute = require("./routes/auth");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(authRoute);
// app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

sequelize
  .sync()
  .then((res) => {})
  .catch((err) => console.log(err));

app.listen(3000);
