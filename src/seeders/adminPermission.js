import Permission from "../models/PermissionModel.js";
import RoleModel from "../models/RoleModel.js";
import RolePermission from "../models/RolePermissionModel.js";

export const adminPermission = async () => {
  try {
    console.log("Seeding permissions");
    const permissions = await Permission.findAll();
    const role = await RoleModel.findOne({ where: { roleName: "admin" } });

    const permissionPromises = permissions.map(async (permission) => {
      console.log(role.id);
      
      await RolePermission.findOrCreate({
        where: { roleId: role.id, permissionId: permission.id },
        defaults: {
          roleId: role.id,
          permissionId: permission.id
        }
      });
    });

    await Promise.all(permissionPromises);

    console.log("Permissions admin created");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};


