import Permission from "../models/PermissionModel.js";

// Get all Permissions
export const getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Permission by ID
export const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission)
      return res.status(404).json({ message: "Permission not found" });
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new Permission
export const createPermission = async (req, res) => {
  const { permissionName, description } = req.body;

  if (!permissionName) {
    return res.status(400).json({
      message: "permissionName is required",
    });
  }

  try {
    const existingPermission = await Permission.findOne({
      where: { permissionName },
    });

    if (existingPermission) {
      return res.status(400).json({
        message: "Permission with this permissionName already exists",
      });
    }

    const newPermission = await Permission.create({
      permissionName,
      description,
    });

    res.status(201).json(newPermission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Permission by ID
export const updatePermission = async (req, res) => {
  const { permissionName, description } = req.body;
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission)
      return res.status(404).json({ message: "Permission not found" });

    permission.permissionName = permissionName;
    permission.description = description;

    await permission.save();
    res.json(permission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Permission by ID
export const deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByPk(req.params.id);
    if (!permission)
      return res.status(404).json({ message: "Permission not found" });

    await permission.destroy();
    res.json({ message: "Permission deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
