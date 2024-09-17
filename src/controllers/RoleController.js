import RoleModel from "../models/RoleModel.js";
import RolePermission from "../models/RolePermissionModel.js";

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

export const getRole = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.per_page, 10) || 10;
    const offset = (page - 1) * perPage;

    const { count, rows: roles } = await RoleModel.findAndCountAll({
      limit: perPage,
      offset: offset,
    });

    const totalPages = Math.ceil(count / perPage);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.status(200).json({
      data: roles,
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

export const getAllRole = async (req, res) => {
  try {
    const roles = await RoleModel.findAll();
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

export const updateRolePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    const currentPermissions = await RolePermission.findAll({
      where: { roleId: id },
      attributes: ["permissionId"],
    });
    console.log(currentPermissions);
    
    // Extract existing permission IDs
    const existingPermissionIds = currentPermissions.map((p) => p.permissionId);

    // Find permissions to add (not in existing)
    const permissionsToAdd = permissionIds.filter(
      (pid) => !existingPermissionIds.includes(pid)
    );

    // Find permissions to remove (not in request)
    const permissionsToRemove = existingPermissionIds.filter(
      (pid) => !permissionIds.includes(pid)
    );

    // Add new permissions
    if (permissionsToAdd.length > 0) {
      await RolePermission.bulkCreate(
        permissionsToAdd.map((pid) => ({ roleId: id, permissionId: pid }))
      );
    }

    // Remove old permissions
    if (permissionsToRemove.length > 0) {
      await RolePermission.destroy({
        where: {
          roleId: id,
          permissionId: permissionsToRemove,
        },
      });
    }
    res.status(200).json({ message: "Hak akses diperbarui" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
