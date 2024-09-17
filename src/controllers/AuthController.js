import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import { generateToken } from "../utils/generateToken.js";
import RoleModel from "../models/RoleModel.js";
import Permission from "../models/PermissionModel.js";
import { Op } from "sequelize";
import ResourceModel from "../models/ResourceModel.js";
import ResourcePermissionModel from "../models/ResourcePermissionModel.js";
import UserRoleModel from "../models/UserRoleModel.js";
import Database from "../configs/Database.js";
export const getUsers = async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 10;
    const offset = (page - 1) * perPage;

    const whereClause = search
    ? {
        [Op.or]: [
          { fullName: { [Op.iLike]: `%${search}%` } },
          { username: { [Op.iLike]: `%${search}%` } },
        ],
      }
    : {};

    const { count, rows: usersList } = await UserModel.findAndCountAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: RoleModel,
          as: "role", // Ensure this alias matches the one defined in the association
          attributes: ["id", "roleName"],
          through: {
            attributes: [],
          },
        },
      ],
      where: whereClause,
      limit: perPage,
      offset: offset,
    });

    const totalPages = Math.ceil(count / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.status(200).json({
      data: usersList,
      current_page: page,
      per_page: perPage,
      total_items: count,
      total_pages: totalPages,
      next_page: nextPage,
      prev_page: prevPage,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createUser = async (req, res) => {
  const { username, fullName, email, password, isActive, roleId } = req.body;
  let transaction;
  try {
    transaction = await Database.transaction();
    const existingUser = await UserModel.findOne({ where: { username }, transaction });
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      username,
      fullName,
      email,
      password: hashedPassword,
      isActive,
    }, { transaction });

    await UserRoleModel.create({
      userId: newUser.id,
      roleId,
    }, { transaction });

    await transaction.commit();
    res.status(201).json(newUser);
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Error creating user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({
      where: { email },
      include: [
        {
          model: RoleModel,
          attributes: ["id", "roleName"],
          exclude: ["createdAt", "updatedAt"],
          through: {
            attributes: [],
          },
          as: "roles",
          include: [
            {
              model:Permission,
              exclude: ["createdAt", "updatedAt"],
              through: {
                attributes: [],
              },
              as: "permissions",
              order:[
                ["root", "ASC"]
              ]
            }
          ]
        },
      ],
    });    


    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isActive) return res.status(403).json({ message: "Akun Anda tidak aktif. Silakan hubungi administrator." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });
    
    const token = generateToken(user.id);

    const menus = await ResourceModel.findAll({
      attributes: ["id", "label", "hasDropdown", "link", "iconKey", "root"],
      include: [
        {
          model: ResourcePermissionModel,
          as: "permissions",
          attributes: [],
          where: {
            permissionId: {
              [Op.in]: user.roles[0].permissions.filter(
                (permission) => permission.parentId === null
              ).map((permission) => permission.id),
            },
          },
          exclude: ["createdAt", "updatedAt"],
        },
        {
          model: ResourceModel,
          attributes: ["id", "label", "hasDropdown", "link","root","iconKey"],
          as: "children",
          order: [["id", "ASC"]],
          separate: true,
          include: [
            {
              model: ResourcePermissionModel,
              as: "permissions",
              attributes: [],
              where: {
                permissionId: {
                  [Op.in]: user.roles[0].permissions.map(
                    (permission) => permission.id
                  ),
                },
              },
              exclude: ["createdAt", "updatedAt"],
            },
          ],
        },
      ],
      order: [["root", "ASC"]],
    });
    


    // // get perm
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        isActive: user.isActive,
        role: user.roles[0].roleName,
      },
      permissions: user.roles[0].permissions.map((permission) => permission.name),
      menus: menus,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Error during login" });
  }
};

// Update User
export const updateUser = async (req, res) => {
  const { username, fullName, email, password, isActive, roleId } = req.body;
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username !== undefined) user.username = username;
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) {
      const existingUser = await UserModel.findOne({ where: { email } });
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (isActive) {
      user.isActive = isActive;
    }
    
    const userRole = await UserRoleModel.findOne({
      where: { userId: user.id },
    });
    if (userRole) {
      userRole.roleId = roleId;
      userRole.save();
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await UserModel.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await UserRoleModel.destroy({ where: { userId: user.id } });
    
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Error deleting user" });
  }
};
