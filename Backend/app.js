const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const authRoute = require("./routes/auth");
const messageRoute = require("./routes/message");
const Message = require("./models/message");
const User = require("./models/user");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/auth", authRoute);
app.use("/message", messageRoute);
app.use(express.static(path.join(__dirname, "public")));
User.hasMany(Message);
Message.belongsTo(User);
sequelize
  .sync()
  .then((res) => {})
  .catch((err) => console.log(err));

app.listen(3000);
