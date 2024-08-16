import { Request, Response } from "express";
import Post from "../models/PostModel";
import { Op } from "sequelize";
import Topic from "../models/TopicModel";
import Group from "../models/GroupModel";
import * as cheerio from "cheerio";
import fs from "fs-extra";
import { saveImage } from "../helpers/saveImage";
import environment from "../configs/environments";

const GetListPost = async (req: Request, res: Response) => {
  try {
    let { page = 1, limit = 10, key_words } = req.query;
    page = parseInt(page as string);
    limit = parseInt(limit as string);
    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }
    const offset = (page - 1) * limit;
    const whereClause = key_words
      ? {
          [Op.or]: [
            { post_title: { [Op.like]: `%${key_words}%` } },
            { post_content: { [Op.like]: `%${key_words}%` } },
          ],
        }
      : {};

    const { count, rows: posts } = await Post.findAndCountAll({
      where: whereClause,
      offset: offset,
      limit: limit,
      attributes: [
        "post_title",
        "post_content",
        "post_slug",
        "first200Words",
        "views",
      ],
      include: [
        { model: Topic, as: "topic", attributes: ["topic_name"] },
        { model: Group, as: "group", attributes: ["group_name"] },
      ],
      raw: true,
      order: ["views"],
    });
    return res.status(200).json({ count, posts });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const DetailPost = async (req: Request, res: Response) => {};

const AddNewPost = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const $ = cheerio.load(content);
    const imageUrls: string[] = [];
    let first200Words: string;
    const text = $.text();

    const words = text.split(/\s+/);
    first200Words = words.slice(0, 200).join(" ") + " ...";

    $("img").each((index, element) => {
      const imgSrc = $(element).attr("src");
      if (imgSrc) {
        imageUrls.push(imgSrc);
      }
    });

    await fs.ensureDir(environment.publicDir);
    const newSrcs = await Promise.all(
      imageUrls.map((imageUrl, index) =>
        saveImage(imageUrl, environment.publicDir, $, index === 0)  
    )
    );

    // Find the first non-null newSrc
    const firstNewSrc = newSrcs.find((src) => src !== null) as string;

    const updatedHtml = $("body").html();

    const responseHtml = JSON.stringify(updatedHtml)
      .replace(/^"|"$/g, "")
      .replace(/\\"/g, '"')
      .replace(/"/g, "'");

    return res.json({ responseHtml, first200Words, firstNewSrc });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const UpdatePost = async (req: Request, res: Response) => {};

const DeletePost = async (req: Request, res: Response) => {};

export { GetListPost, AddNewPost, UpdatePost, DeletePost, DetailPost };
