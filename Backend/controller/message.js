const Message = require("../models/message");
const User = require("../models/user");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.sendMessage = (req, res, next) => {
  const message = req.body.message;
  const to = req.body.to;
  Message.create({
    message,
    userId: req.user.id,
    to,
  })
    .then((data) => {
      if (!data) res.json(response);
      res.json({ success: true, messageSent: true });
    })
    .catch((e) => res.json({ success: false, message: e.message }));
};
exports.getMessages = (req, res) => {
  const userId = req.user.id;
  const receiveMessageId = req.params.userId;
  const lastMessageId = req.params.lastMesageId;
  if (!userId || !receiveMessageId)
    res.json({
      success: false,
      message: "Id not provided",
    });
  else {
    Message.findAll({
      where: {
        id: {
          [Op.gt]: lastMessageId,
        },
        [Op.or]: [
          {
            userId,
          },
          {
            to: userId,
          },
        ],
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
  }
};
