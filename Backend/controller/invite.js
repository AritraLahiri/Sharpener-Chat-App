const Request = require("../models/request");
const User = require("../models/user");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.createInvite = (req, res, next) => {
  const userId = req.params.userId;
  const groupId = req.params.groupId;
  Request.create({
    groupId,
    userId,
    pending: true,
    requestFrom: req.user.id,
    to,
  })
    .then((data) => {
      if (!data) res.json(response);
      res.json({ success: true, message: "Invitation sent to user" });
    })
    .catch((e) => res.json({ success: false, message: e.message }));
};
exports.getInvites = (req, res) => {
  Request.findAll({
    where: {
      userId: req.user.id,
      pending: true,
    },
    include: User,
  })
    .then((data) => {
      if (!data)
        res.json({
          success: false,
          message: "Collected all invites from API",
        });
      res.status(200).json({
        success: true,
        data,
      });
    })
    .catch((e) => res.json(e.message));
};

exports.processInvite = (req, res) => {
  const userId = req.user.id;
  const accept = req.params.value;
  if (accept) {
    User.findByPk(req.user.id).then((data) => {
      if (!data)
        res
          .status(404)
          .json({ success: false, message: "User group iD not UPDATED" });
      User.update({ groupId: data.id }, { where: { userId: req.user.id } });
    });
  }
  Request.findByPk(userId).then((data) => {
    if (!data)
      res.status(404).json({ success: false, message: "Request not found" });
    Request.update({ pending: false }, { where: { userId } })
      .then(() => {
        // res.redirect(
        //   `http://127.0.0.1:5500/Frontend/Auth/ResetPassword/index.html?id=${data.userId}`
        // );
      })
      .catch((err) => console.log(err));
  });
  //   if (accept) {
  //   }
};
