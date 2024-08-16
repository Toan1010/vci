import { Request, Response } from "express";
import Topic from "../models/TopicModel";
import Post from "../models/PostModel";
import Group from "../models/GroupModel";
import { convertString } from "../helpers/convertToSlug";

const GetListTopic = async (req: Request, res: Response) => {
  try {
    const listTopic = await Topic.findAll();
    return res.json({ topics: listTopic });
  } catch (error) {
    return res.status(500).json({ error: "Something when wrong" });
  }
};

const ListTopicPost = async (req: Request, res: Response) => {
  try {
    const user = req.body.user;
    if (!user) {
      return res.status(400).json({ error: "You have to login first!" });
    }

    const slug = req.params.slug;
    const { count, rows: posts } = await Post.findAndCountAll({
      attributes: ["id", "post_title", "post_slug", "created_at", "updated_at"],
      raw: true,
      include: [
        {
          model: Topic,
          as: "topic",
          attributes: ["topic_name"],
          where: {
            topic_slug: slug,
          },
        },
        {
          model: Group,
          as: "group",
          attributes: ["group_name"],
          where: {
            ...(user.role === "admin" ? { group_id: user.group_id } : {}),
          },
        },
      ],
    });
    return res.json({ count, posts });
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ error: "Somthing wrrong" });
  }
};

const AddNewTopic = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const slug = convertString(name);
    const newTopic = await Topic.create({ topic_name: name, topic_slug: slug });
    return res.json({ message: "New topic is created", newTopic });
  } catch (error) {
    return res.json({ error: "Something wrong" });
  }
};

const UpdateTopic = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const currentTopic = await Topic.findByPk(id);
    if (!currentTopic) {
      return res.json({ error: "There no topic with this id" });
    }
    const { name } = req.body;
    let slug = convertString(name);
    let newTopic = await currentTopic.update({
      topic_name: name,
      topic_slug: slug,
    });

    return res.json({ message: "Topic Updated Successfully", topic: newTopic });
  } catch (error) {
    return res.json({ error: "Something wrong" });
  }
};

const DeleteTopic = async (req: Request, res: Response) => {
  return res.json("DeleteTopic");
};

export { GetListTopic, ListTopicPost, AddNewTopic, UpdateTopic, DeleteTopic };
