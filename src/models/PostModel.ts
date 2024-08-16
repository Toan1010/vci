import sequelize from "../configs/database";
import { DataTypes, Model } from "sequelize";
import Group from "./GroupModel";
import Topic from "./TopicModel";

class Post extends Model {
  public id!: number;
  public group_id!: number;
  public topic_id!: number;
  public post_title!: string;
  public post_content!: string;
  public post_status!: boolean;
  public post_slug!: string;
  public post_thumbnail!: string;
  public first200Words!: string;
  public views!: number;
  public created_at!: Date;
  public updated_at!: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    group_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Group,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    topic_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Topic,
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    post_title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    post_content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    post_thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "default.png",
    },
    post_status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    post_slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    first200Words: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    views: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    tableName: "posts",
    sequelize,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Post.belongsTo(Group, { foreignKey: "group_id", as: "group" });
Post.belongsTo(Topic, { foreignKey: "topic_id", as: "topic" });

Group.hasMany(Post, { foreignKey: "group_id", as: "posts" });
Topic.hasMany(Post, { foreignKey: "topic_id", as: "posts" });

export default Post;
