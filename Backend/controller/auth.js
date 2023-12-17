const User = require("../models/user");
const Sequelize = require("sequelize");
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
// exports.forgotPassword = (req, res, next) => {
//   const email = req.body.email;
//   const uuid = uuidv4();
//   User.findOne({ where: { email } })
//     .then((user) => {
//       if (!user)
//         res.status(404).json({ message: "User not found", success: false });
//       return ForgotPassReq.create({
//         id: uuid,
//         userId: user.id,
//         isActive: true,
//       });
//     })
//     .then((data) => {
//       if (!data)
//         res.status(404).json({ message: "Request not sent", success: false });
//       else {
//         let defaultClient = brevo.ApiClient.instance;
//         let apiKey = defaultClient.authentications["api-key"];
//         apiKey.apiKey = process.env.API_KEY_MAIL;
//         let apiInstance = new brevo.TransactionalEmailsApi();
//         let sendSmtpEmail = new brevo.SendSmtpEmail();
//         sendSmtpEmail.subject = "{{params.subject}} for Expense App";
//         sendSmtpEmail.htmlContent = `<html><body><h1>Hello user, This mail is for {{params.parameter}}</h1>  <a href='http://localhost:3000/user/password/resetpassword/${uuid}'>Reset Password</a></body></html>`;
//         sendSmtpEmail.sender = {
//           name: "Aritra",
//           email: "aritralahiri17@gmail.com",
//         };
//         sendSmtpEmail.to = [{ email, name: "Aritra" }];
//         sendSmtpEmail.params = {
//           parameter: "Reset your password",
//           subject: "Reset Password",
//         };
//         return apiInstance.sendTransacEmail(sendSmtpEmail);
//       }
//     })
//     .then((response) => {
//       if (!response)
//         res.status(404).json({ message: "Mail not sent", success: false });
//       else {
//         return res
//           .status(201)
//           .json({ success: true, message: "Mail successfully Send" });
//       }
//     })
//     .catch((err) => res.status(404).json(err));
// };

// exports.resetPassword = (req, res) => {
//   const reqId = req.params.id;
//   ForgotPassReq.findByPk(reqId).then((data) => {
//     if (!data)
//       res.status(404).json({ success: false, message: "Request not found" });
//     if (!data.isActive) res.status(201).json(data);
//     ForgotPassReq.update({ isActive: false }, { where: { id: reqId } })
//       .then(() => {
//         res.redirect(
//           `http://127.0.0.1:5500/Frontend/Auth/ResetPassword/index.html?id=${data.userId}`
//         );
//       })
//       .catch((err) => console.log(err));
//   });
// };

// exports.updatePassword = (req, res) => {
//   const userId = req.params.id;
//   const password = req.body.password;
//   bcrypt.hash(password, saltRounds, async (err, hash) => {
//     if (err) {
//       console.log(err);
//       res.json(err.message);
//     }
//     await User.findOne({ where: { id: userId } }).then((user) => {
//       console.log(password);
//       return user
//         .update({
//           password: hash,
//         })
//         .then((data) => {
//           if (!data)
//             res
//               .status(404)
//               .json({ success: false, message: "Password not updated" });
//           else
//             res.status(200).json({
//               success: true,
//               message: "Password updated successfully",
//             });
//         })
//         .catch((err) => res.status(404).json(err));
//     });
//   });
// };

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, secret);
}
