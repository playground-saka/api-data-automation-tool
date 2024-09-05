import RoleModel from "../models/RoleModel.js";

// Create
export const createRole = async (req, res) => {
  try {
    const { roleName, description } = req.body;

    if (!roleName) {
      return res.status(400).json({
        message: "roleName is required",
      });
    }

    const existingRole = await RoleModel.findOne({
      where: { roleName },
    });

    if (existingRole) {
      return res.status(400).json({
        message: "Role with this roleName already exists",
      });
    }

    const role = await RoleModel.create({ roleName, description });
    res.status(201).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all data
export const getAllRole = async (req, res) => {
  try {
    const roles = await RoleModel.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit data
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { roleName, description } = req.body;

    const role = await RoleModel.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (roleName !== undefined) {
      role.roleName = roleName;
    }
    if (description !== undefined) {
      role.description = description;
    }

    await role.save();

    res.status(200).json(role);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete data
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await RoleModel.findByPk(id);

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    await role.destroy();
    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
