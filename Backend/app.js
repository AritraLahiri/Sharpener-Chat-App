const path = require("path");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sequelize = require("./util/database");
const authRoute = require("./routes/auth");
const messageRoute = require("./routes/message");
const inviteRoute = require("./routes/invite");
const groupRoute = require("./routes/group");
const Message = require("./models/message");
const User = require("./models/user");
const Group = require("../Backend/models/group");
const Request = require("../Backend/models/request");
const GroupMessage = require("../Backend/models/groupMessage");
const UserToGroup = require("../Backend/models/userToGroup");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/auth", authRoute);
app.use("/message", messageRoute);
app.use("/message", messageRoute);
app.use("/invite", inviteRoute);
app.use("/group", groupRoute);
app.use(express.static(path.join(__dirname, "public")));
User.hasMany(Message);
Message.belongsTo(User);

// User.hasMany(UserToGroup);
// UserToGroup.belongsTo(User);
Group.hasMany(UserToGroup);
UserToGroup.belongsTo(Group);
User.hasMany(UserToGroup);
UserToGroup.belongsTo(User);

User.hasMany(Request);
Request.belongsTo(User);
Group.hasMany(Request);
Request.belongsTo(Group);
User.hasMany(GroupMessage);
GroupMessage.belongsTo(User);
Group.hasMany(GroupMessage);
GroupMessage.belongsTo(Group);
sequelize
  .sync()
  .then((res) => {})
  .catch((err) => console.log(err));

app.listen(3000);
