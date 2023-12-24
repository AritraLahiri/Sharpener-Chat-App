const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const UserToGroup = sequelize.define("user-to-group", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  groupId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
module.exports = UserToGroup;
