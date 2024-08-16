import { Request, Response } from "express";
import User from "../models/UserModel";
import bcrypt from "bcrypt";
import { tokenGenerate, tokenVerify } from "../helpers/tokenHandle";
import { Op } from "sequelize";

let refreshTokens: string[] = [];

const Login = async (req: Request, res: Response) => {
  try {
    const { credential, password } = req.body;

    const findUser = await User.findOne({
      where: {
        user_status: 1,
        [Op.or]: [{ user_email: credential }, { user_login: credential }],
      },
    });
    if (!findUser) {
      return res.status(400).json({ error: "Thông tin email không đúng" });
    }
    const isPassword = await bcrypt.compare(password, findUser.user_password);
    if (!isPassword) {
      return res.status(400).json({ error: "Mật khẩu không đúng" });
    }
    const tokenData = {
      id: findUser.id,
      role: findUser.is_super_admin ? "super_admin" : "admin",
      group_id: findUser.group_id,
    };

    const accessToken = tokenGenerate(tokenData, "access");
    const refreshToken = tokenGenerate(tokenData, "refresh");

    refreshTokens.push(refreshToken);

    return res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Có lỗi xảy ra" });
  }
};

const RefreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = await req.body;

    if (!refreshTokens.includes(refreshToken)) {
      return res.status(403).json({ error: "Refresh token không hợp lệ" });
    }
    const data = await tokenVerify(refreshToken, "refresh");
    if (data && typeof data === "object") {
      const newAccessToken = tokenGenerate(data, "access");
      const newRefreshToken = tokenGenerate(data, "refresh");

      refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

      refreshTokens.push(newRefreshToken);
      return res.json({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } else {
      return res.status(403).json({ error: "Dữ liệu token không hợp lệ" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Co looix xayr ra" });
  }
};

const Logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      if (refreshTokens.includes(refreshToken)) {
        refreshTokens = refreshTokens.filter(
          (token: string) => token !== refreshToken
        );
        return res.status(200).json({ message: "Logged out successfully!" });
      } else {
        return res.status(403).json({ error: "Refresh token không hợp lệ" });
      }
    } else {
      return res.status(400).json({ error: "No refresh token provided" });
    }
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during logout" });
  }
};

export { Login, RefreshToken, Logout };
