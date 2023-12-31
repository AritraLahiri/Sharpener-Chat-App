const path = require("path");
const http = require("http");
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
const server = http.createServer(app);
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

User.hasMany(UserToGroup);
UserToGroup.belongsTo(User);
Group.hasMany(UserToGroup);
UserToGroup.belongsTo(Group);

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

server.listen(3000, console.log(`Server ready and running`));

// const { Server } = require("socket.io");
// const io = new Server(server);
// global.io = io;
// //Sockets will be handle here
// io.on("connection", (client) => {
//   client.on("message", (message) => {
//     console.log(message);
//     io.emit("message", message);
//   });
//   console.log(`A new user has connected`);
// });
