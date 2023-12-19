const Message = require("../models/message");
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
