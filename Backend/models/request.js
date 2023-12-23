const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Request = sequelize.define("requests", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  pending: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  requestFrom: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = Request;
