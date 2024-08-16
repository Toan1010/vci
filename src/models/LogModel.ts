import sequelize from "../configs/database";
import { DataTypes, Model } from "sequelize";
import User from "./UserModel";

class Log extends Model {
  public id!: number;
  public user_id!: number;
  public endpoint!: string;
  public method!: string;
  public status!: number;
  public error_reason!: string;
  public created_at!: Date;
}

Log.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    endpoint: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    error_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "logs",
    sequelize,
    timestamps: false,
  }
);

Log.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasMany(Log, { foreignKey: "user_id", as: "logs" });

export default Log;
