import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import { generateToken } from "../utils/generateToken.js";

export const getUsers = async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user.id);

    res.json({
      token: token,
      user: {
        id: user.dataValues.id,
        username: user.dataValues.username,
        email: user.dataValues.email,
        role: user.dataValues.role,
        isActive: user.dataValues.isActive,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update User
export const updateUser = async (req, res) => {
  try {
    const { username, email, password, isActive } = req.body;
    const user = await UserModel.findByPk(req.params.id);
    if (user) {
      user.username = username;
      user.email = email;
      user.password = password;
      user.isActive = isActive;
      await user.save();
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "UserModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (user) {
      await user.destroy();
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "UserModel not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
