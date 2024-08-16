import sequelize from "../configs/database";
import { DataTypes, Model } from "sequelize";

class Topic extends Model {
  public id!: number;
  public topic_name!: string;
  public topic_slug!: string;
}

Topic.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    topic_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    topic_slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: "topics",
    sequelize,
    timestamps: false,
  }
);

export default Topic;
