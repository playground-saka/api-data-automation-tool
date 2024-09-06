import UserRoleModel from "../models/UserRoleModel.js";
import User from "../models/UserModel.js";
import RoleModel from "../models/RoleModel.js";

// Get all UserRoles
export const getUserRoles = async (req, res) => {
  try {
    const userRoles = await UserRoleModel.findAll({
      include: [User, RoleModel],
    });
    res.json(userRoles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get UserRole by ID
export const getUserRoleById = async (req, res) => {
  try {
    const userRole = await UserRoleModel.findByPk(req.params.id, {
      include: [User, RoleModel],
    });
    if (!userRole)
      return res.status(404).json({ message: "User Role not found" });
    res.json(userRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new UserRole
export const createUserRole = async (req, res) => {
  const { userId, roleId, assignedDate } = req.body;
  try {
    // Check if the user already has a role
    const existingRole = await UserRoleModel.findOne({
      where: { userId },
    });
    if (existingRole) {
      return res.status(400).json({ message: "User already has a role" });
    }

    // Create the new role
    const newUserRole = await UserRoleModel.create({
      userId,
      roleId,
      assignedDate,
    });
    res.status(201).json(newUserRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update UserRole by ID
export const updateUserRole = async (req, res) => {
  const { userId, roleId, assignedDate } = req.body;
  try {
    const userRole = await UserRoleModel.findByPk(req.params.id);
    if (!userRole)
      return res.status(404).json({ message: "User Role not found" });

    // Check if the user is trying to assign a new role
    if (userRole.roleId !== roleId) {
      const existingRole = await UserRoleModel.findOne({
        where: { userId },
      });
      if (existingRole) {
        return res.status(400).json({ message: "User already has a role" });
      }
    }

    userRole.userId = userId;
    userRole.roleId = roleId;
    userRole.assignedDate = assignedDate;

    await userRole.save();
    res.json(userRole);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete UserRole by ID
export const deleteUserRole = async (req, res) => {
  try {
    const userRole = await UserRoleModel.findByPk(req.params.id);
    if (!userRole)
      return res.status(404).json({ message: "User Role not found" });

    await userRole.destroy();
    res.json({ message: "User Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
