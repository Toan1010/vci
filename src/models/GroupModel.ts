import sequelize from "../configs/database";
import { DataTypes, Model } from "sequelize";

class Group extends Model {
  public id!: number;
  public group_name!: string;
  public group_slug!: string;
}

Group.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    group_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    group_slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "groups",
    sequelize,
    timestamps: false,
  }
);

export default Group;
