import sequelize from "../configs/database";
import { DataTypes, Model } from "sequelize";
import Group from "./GroupModel";

class User extends Model {
  public id!: number;
  public user_login!: string;
  public user_email!: string;
  public user_password!: string;
  public is_super_admin!: boolean;
  public user_activation_key!: string;
  public user_registered!: Date;
  public user_status!: boolean;
  public display_name!: string;
  public group_id!: number | null;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    group_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      references: {
        model: Group,
        key: "id",
      },
      allowNull: true, // Cho phép null nếu là super admin
    },
    user_login: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    user_email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    user_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    user_activation_key: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    user_registered: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    is_super_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    user_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    display_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "users",
    sequelize,
    timestamps: false,
  }
);

User.belongsTo(Group, { foreignKey: "group_id", as: "group" });
Group.hasMany(User, { foreignKey: "group_id", as: "users" });

export default User;
