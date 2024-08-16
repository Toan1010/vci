import { Request, Response } from "express";
import Group from "../models/GroupModel";
import Topic from "../models/TopicModel";
import Post from "../models/PostModel";
import { convertString } from "../helpers/convertToSlug";

const GetListGroup = async (req: Request, res: Response) => {
  try {
    const { count, rows: groups } = await Group.findAndCountAll();
    return res.json({ count, groups });
  } catch (error) {
    return res.status(500).json({ error: "Something when wrong" });
  }
};

const ListGroupPost = async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug;
    const { count, rows: posts } = await Post.findAndCountAll({
      attributes: ["id", "post_title", "post_slug", "created_at", "updated_at"],
      raw: true,
      include: [
        {
          model: Topic,
          as: "topic",
          attributes: ["topic_name"],
        },
        {
          model: Group,
          as: "group",
          attributes: ["group_name"],
          where: {
            group_slug: slug,
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

const AddNewGroup = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const slug = convertString(name);
    const newGroup = await Group.create({
      group_name: name,
      group_slug: slug,
    });
    return res.json({ message: "New group is created", newGroup });
  } catch (error) {
    return res.json({ error: "Something wrong" });
  }
};

const UpdateGroup = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const currentGroup = await Group.findByPk(id);
    if (!currentGroup) {
      return res.json({ error: "There no Group with this id" });
    }
    const { name } = req.body;
    let slug = convertString(name);
    let newGroup = await currentGroup.update({
      group_name: name,
      group_slug: slug,
    });

    return res.json({ message: "Group Updated Successfully", group: newGroup });
  } catch (error) {
    return res.json({ error: "Something wrong" });
  }
};

const DeleteGroup = async (req: Request, res: Response) => {
  return res.json();
};

export { GetListGroup, AddNewGroup, DeleteGroup, ListGroupPost, UpdateGroup };
