import { Request, Response } from "express";
import User from "../models/UserModel";
import Group from "../models/GroupModel";
import PostPermission from "../models/PostPermissionModel";
import { Op } from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "../configs/database";
import { error } from "winston";

const GetListUser = async (req: Request, res: Response) => {
  try {
    let { page = 1, limit = 10, name } = req.query;
    page = parseInt(page as string);
    limit = parseInt(limit as string);
    if (isNaN(page) || isNaN(limit)) {
      return res.status(400).json({ message: "Invalid pagination parameters" });
    }
    const offset = (page - 1) * limit;
    const whereClause = name
      ? {
          [Op.or]: [{ display_name: { [Op.like]: `%${name}%` } }],
        }
      : {};
    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      offset: offset,
      limit: limit,
      attributes: [
        "id",
        "user_login",
        "display_name",
        "user_email",
        "is_super_admin",
        "user_status",
      ],
      include: [
        { model: Group, as: "group", attributes: ["group_name"] },
        {
          model: PostPermission,
          as: "permission",
          attributes: ["can_update", "can_delete"],
        },
      ],
    });
    return res.json({ count, rows });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const AddNewUser = async (req: Request, res: Response) => {
  const transaction = await sequelize.transaction();
  try {
    const { user_login, email, password, display_name, group_id } = req.body;
    const isExist = await User.findOne({
      where: {
        [Op.or]: [{ user_email: email }, { user_login: user_login }],
      },
    });
    if (isExist) {
      return res
        .status(400)
        .json({ error: "Email or username already exist!" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    console.log(hashpassword);

    const newUser = await User.create(
      {
        user_login: user_login,
        user_email: email,
        user_password: hashpassword,
        display_name: display_name,
        group_id: group_id,
      },
      { transaction }
    );
    const permission = await PostPermission.create(
      { user_id: newUser.id },
      { transaction }
    );
    await transaction.commit();

    return res
      .status(200)
      .json({ message: "Created Successfully", user: newUser });
  } catch (error: any) {
    await transaction.rollback();
    return res.status(500).json({ error: error.message });
  }
};

const ChangePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user.id;
    const { current_password, new_password } = req.body;
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "You are haven't login yet" });
    }
    const isPasswordMatch = await bcrypt.compare(
      current_password,
      currentUser.user_password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Current password is incorrect!" });
    }
    const hashedNewPassword = await bcrypt.hash(new_password, 10);
    currentUser.user_password = hashedNewPassword;
    await currentUser.save();
    return res.status(200).json({ message: "Password updated successfully!" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const UpdateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user.id;
    const { user_login, email, display_name } = req.body;
    const currentUser = await User.findByPk(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "You are haven't login yet" });
    }
    const updateData = {
      user_login: user_login || currentUser.user_login,
      user_email: email || currentUser.user_email,
      display_name: display_name || currentUser.display_name,
    };
    currentUser.update(updateData);
    return res.status(200).json({ message: "Updated Successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const UserDetail = async (req: Request, res: Response) => {
  try {
    const userId = req.body.user.id;
    if (!userId) {
      return res.status(404).json({ error: "You are haven't login yet" });
    }
    const currentUser = await User.findByPk(userId, {
      attributes: ["user_login", "display_name", "user_email"],
      include: [
        { model: Group, as: "group", attributes: ["group_name"] },
        {
          model: PostPermission,
          as: "permission",
          attributes: ["can_update", "can_delete"],
        },
      ],
    });
    return res.status(200).json({ my_info: currentUser });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const GrantPermission = async (req: Request, res: Response) => {
  try {
    const { userId, can_update = 0, can_delete = 0 } = req.body;
    const user = await PostPermission.findOne({ where: { user_id: userId } });
    if (!user) {
      return res.status(401).json({ error: "Can't find user!" });
    }
    await user.update({ can_update, can_delete });
    return res.json({ message: "Grant Permission successfull!" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const DeleteUser = async (req: Request, res: Response) => {};

export {
  GrantPermission,
  GetListUser,
  AddNewUser,
  UpdateUser,
  DeleteUser,
  ChangePassword,
  UserDetail,
};
