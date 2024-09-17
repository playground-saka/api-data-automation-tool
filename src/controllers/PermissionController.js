import Permission from "../models/PermissionModel.js";
import RolePermission from "../models/RolePermissionModel.js";

export const getPermissions = async (req, res) => {
    try {
        const roleId = req.query.roleId || null;
        const permissions = await Permission.findAll({
          where: {
            parentId: null,
          },
          order: [["root", "ASC"]],
          include: [
            {
              model: Permission,
              as: "children",
              separate: true,
              order: [["root", "ASC"]],
              attributes: [
                "id",
                "parentId",
                "name",
                "asModule",
                "alias",
                "root",
              ],
              include: [
                {
                  model: Permission,
                  as: "children",
                  separate: true,
                  order: [["root", "ASC"]],
                  attributes: [
                    "id",
                    "parentId",
                    "name",
                    "asModule",
                    "alias",
                    "root",
                  ],
                  include: [
                    {
                      model: RolePermission,
                      as: "rolePermission",
                      where: {
                        roleId: roleId,
                      },
                      required: false,
                      attributes: ["id", "roleId", "permissionId"],
                    },
                  ],
                },
                {
                  model: RolePermission,
                  as: "rolePermission",
                  where: {
                    roleId: roleId,
                  },
                  required: false,
                  attributes: ["id", "roleId", "permissionId"],
                },
              ],
            },
            {
              model: RolePermission,
              as: "rolePermission",
              where: {
                roleId: roleId,
              },
              required: false,
              attributes: ["id", "roleId", "permissionId"],
            },
          ],
          attributes: ["id", "parentId", "name", "asModule", "alias", "root"],
        });
        res.status(200).json(permissions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};