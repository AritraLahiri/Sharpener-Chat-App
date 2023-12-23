const Group = require("../models/group");
const Message = require("../models/groupMessage");
const User = require("../models/user");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.sendMessage = (req, res, next) => {
  const message = req.body.message;
  const groupId = req.params.id;
  Message.create({
    message,
    userId: req.user.id,
    groupId,
  })
    .then((data) => {
      if (!data) res.json(response);
      res.json({ success: true, messageSent: true });
    })
    .catch((e) => res.json({ success: false, message: e.message }));
};
exports.getMessages = (req, res) => {
  const groupId = req.params.id;
  Message.findAll({
    where: {
      groupId,
    },
    include: User,
  })
    .then((data) => {
      if (!data)
        res.json({
          success: false,
          message: "Messages list not received from API",
        });
      res.status(200).json({
        success: true,
        data,
      });
    })
    .catch((e) => res.json(e.message));
};

exports.createGroup = (req, res) => {
  const name = req.body.name;
  Group.create({
    isAdmin: true,
    name,
    userId: req.user.id,
    to,
  })
    .then((data) => {
      if (!data) res.json(response);
      else {
        User.findByPk(req.user.id).then((data) => {
          if (!data)
            res
              .status(404)
              .json({ success: false, message: "User group iD not UPDATED" });
          return User.update(
            { groupId: data.id },
            { where: { userId: req.user.id } }
          )
            .then(() => {
              // res.redirect(
              //   `http://127.0.0.1:5500/Frontend/Auth/ResetPassword/index.html?id=${data.userId}`
              // );
              res.json({ success: true, message: " Group creation success" });
            })
            .catch((err) => console.log(err));
        });
      }
    })
    .catch((e) => res.json({ success: false, message: e.message }));
};
