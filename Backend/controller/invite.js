const Request = require("../models/request");
const User = require("../models/user");
const Sequelize = require("sequelize");
const UserToGroup = require("../models/userToGroup");
const Group = require("../models/group");

exports.createInvite = (req, res, next) => {
  const userId = req.params.userId;
  const groupId = req.params.groupId;
  Request.create({
    groupId,
    userId,
    pending: true,
    requestFrom: req.user.id,
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
    include: [User, Group],
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
  Request.findByPk(userId).then((data) => {
    if (!data)
      res.status(404).json({ success: false, message: "Request not found" });
    Request.update({ pending: false }, { where: { userId } })
      .then((data) => {
        res.status(200).json({ success: true, message: "Success" });
      })
      .catch((err) => console.log(err));
  });
};

exports.joinGroup = (req, res) => {
  const userId = req.user.id;
  const groupId = req.body.groupId;
  UserToGroup.create({ userId, groupId })
    .then((data) => {
      if (!data)
        res.status(404).json({ success: false, message: "Group not joined" });
      res.status(200).json({ success: true, message: "User has joined Group" });
    })
    .catch((err) => res.json(err));

  // Request.findByPk(userId).then((data) => {
  //   if (!data)
  //     res.status(404).json({ success: false, message: "Request not found" });
  //   Request.update({ pending: false }, { where: { userId } })
  //     .then((data) => {
  //       if (!data)
  //         res
  //           .status(404)
  //           .json({ success: false, message: "Request not updated" });
  //       return Group.findByPk(id);
  //     })
  //     .then((data) => {
  //       if (!data)
  //         res.status(404).json({ success: false, message: "Group not found" });
  //       return Group.findByPk(id);
  //     })
  //     .then((data) => {
  //       if (!data)
  //         res.status(404).json({ success: false, message: "Group not joined" });
  //       return Group.update(
  //         { userIds: data.userIds.push(req.user.id) },
  //         { where: { id } }
  //       );
  //     })
  //     .then((data) => {
  //       if (!data)
  //         res.status(404).json({ success: false, message: "Group not joined" });
  //       re.status(200).json({
  //         success: true,
  //         message: "Group has been  joined",
  //       });
  //     })
  //     .catch((err) => console.log(err));
  // });
};
