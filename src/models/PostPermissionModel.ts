import sequelize from "../configs/database";
import { DataTypes, Model } from "sequelize";
import User from "./UserModel";

class PostPermission extends Model {
  public id!: number;
  public user_id!: number;
  public can_update!: boolean;
  public can_delete!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

PostPermission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
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
    can_update: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    can_delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "post_permissions",
    sequelize,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

PostPermission.belongsTo(User, { foreignKey: "user_id", as: "user" });
User.hasOne(PostPermission, { foreignKey: "user_id", as: "permission" });

export default PostPermission;
