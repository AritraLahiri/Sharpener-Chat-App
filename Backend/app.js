const path = require("path");
const jwt = require("jsonwebtoken");
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
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
global.io = io;
app.use(cors());

//Sockets for receiving messages will be handle here
io.on("connection", (client) => {
  const userId = jwt.verify(
    client.handshake.query["userId"],
    process.env.SECRET
  ).userId;
  const to = client.handshake.query["to"];
  console.log(userId + " " + to);
  Message.findAll({
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            {
              userId: userId,
            },
            {
              to: to,
            },
          ],
        },
        {
          [Op.and]: [
            {
              userId: to,
            },
            {
              to: userId,
            },
          ],
        },
      ],
      // [Op.and]: [
      //   {
      //     userId: userId,
      //   },
      //   {
      //     to: to,
      //   },
      // ],
      // [Op.and]: [
      //   {
      //     userId: to,
      //   },
      //   {
      //     to: userId,
      //   },
      // ],
    },
    include: User,
  })
    .then((data) => {
      if (!data) console.log(data);
      if (data.length > 0) {
        io.emit("message", data);
      }
    })
    .catch((e) => console.log(e));
  console.log(`A new user has connected`);
});
//Sockets for sending messages will be handle here
io.on("connection", (client) => {
  client.on("message", (data) => {
    const userId = jwt.verify(data.userId, process.env.SECRET).userId;
    const to = data.to;
    Message.create({
      message: data.message,
      userId,
      to,
    });
  });
  console.log(`A new user has connected`);
});

//Send Group Message to People
io.on("connection", (client) => {
  client.on("messageGroup", (data) => {
    console.log(data);
    const userId = jwt.verify(data.userId, process.env.SECRET).userId;
    const message = data.message;
    const groupId = data.groupId;
    GroupMessage.create({
      message,
      userId,
      groupId,
    });
  });
  console.log(`A new user has connected`);
});
//Receive Group Message
io.on("connection", (client) => {
  const groupId = client.handshake.query["groupId"];
  GroupMessage.findAll({
    where: {
      groupId,
    },
    include: User,
  })
    .then((data) => {
      if (!data) console.log(data);
      if (data.length > 0) {
        io.emit("messageGroup", data);
      }
    })
    .catch((e) => console.log(e));
  console.log(`A new user has connected`);
});

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
