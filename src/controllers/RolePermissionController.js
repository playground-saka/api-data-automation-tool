import RolePermission from '../models/RolePermissionModel.js';
import RoleModel from '../models/RoleModel.js';
import Permission from '../models/PermissionModel.js';

// Get all RolePermissions
export const getRolePermissions = async (req, res) => {
    try {
        const rolePermissions = await RolePermission.findAll({
            include: [
                { model: RoleModel, as: 'role' },
                { model: Permission, as: 'permission' },
            ],
        });
        res.json(rolePermissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get RolePermission by ID
export const getRolePermissionById = async (req, res) => {
    try {
        const rolePermission = await RolePermission.findByPk(req.params.id, {
            include: [
                { model: RoleModel, as: 'role' },
                { model: Permission, as: 'permission' },
            ],
        });

        if (!rolePermission) return res.status(404).json({ message: 'RolePermission not found' });
        res.json(rolePermission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new RolePermission
export const createRolePermission = async (req, res) => {
    const { roleId, permissionId } = req.body;

    try {
        const newRolePermission = await RolePermission.create({
            roleId,
            permissionId,
        });
        res.status(201).json(newRolePermission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update RolePermission by ID
export const updateRolePermission = async (req, res) => {
    const { roleId, permissionId } = req.body;

    try {
        const rolePermission = await RolePermission.findByPk(req.params.id);
        if (!rolePermission) return res.status(404).json({ message: 'RolePermission not found' });

        rolePermission.roleId = roleId;
        rolePermission.permissionId = permissionId;

        await rolePermission.save();
        res.json(rolePermission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete RolePermission by ID
export const deleteRolePermission = async (req, res) => {
    try {
        const rolePermission = await RolePermission.findByPk(req.params.id);
        if (!rolePermission) return res.status(404).json({ message: 'RolePermission not found' });

        await rolePermission.destroy();
        res.json({ message: 'RolePermission deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
