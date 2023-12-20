const Message = require("../models/message");
const User = require("../models/user");
const Sequelize = require("sequelize");

exports.sendMessage = (req, res, next) => {
  const message = req.body.message;
  const from = req.body.from;
  const to = req.body.to;
  Message.create({
    message,
    userId: req.user.id,
  })
    .then((data) => {
      if (!data) res.json(response);
      res.json({ success: true, messageSent: true });
    })
    .catch((e) => res.json({ success: false, message: e.message }));
};
exports.getMessages = (req, res) => {
  const userId = req.user.id;
  Message.findAll({
    where: {
      userId,
    },
    include: User,
  })
    .then((data) => {
      if (!data)
        res.json({
          success: false,
          message: "Message list not received from API",
        });
      res.status(200).json({
        success: true,
        data,
      });
    })
    .catch((e) => res.json(e.message));
};
