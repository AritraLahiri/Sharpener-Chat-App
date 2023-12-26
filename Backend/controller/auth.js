const User = require("../models/user");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
const secret = process.env.SECRET;
// const { v4: uuidv4 } = require("uuid");

exports.signUpUser = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err);
      res.json(err.message);
    }
    await User.create({
      email,
      name,
      phone,
      password: hash,
    })
      .then((response) => {
        if (!response) res.json(response);
        res.json({ success: true, createdUser: true });
      })
      .catch((e) => res.json({ success: false, message: e.message }));
  });
};
exports.logInUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ where: { email } })
    .then((user) => {
      if (!user) {
        res.json({ message: "User not found", success: false });
      }
      bcrypt.compare(password, user.password, async (err, success) => {
        if (err) res.json({ message: "Password didn't match", success: false });
        await res.json({
          message: "Login success",
          success: true,
          token: generateAccessToken(user.id),
        });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.json(err);
    });
};
function generateAccessToken(id) {
  return jwt.sign({ userId: id }, secret);
}
exports.getAllUsers = (req, res) => {
  console.log(req.user.id);
  User.findAll({ where: { id: { [Op.not]: req.user.id } } })
    .then((data) => {
      if (!data)
        res.json({
          success: false,
          message: "User list not fetched in API",
        });
      else
        res.status(200).json({
          success: true,
          data,
        });
    })
    .catch((e) => res.json(e.message));
};
