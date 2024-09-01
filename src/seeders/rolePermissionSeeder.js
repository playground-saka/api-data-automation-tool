import RolePermission from "../models/RolePermissionModel.js";
import Database from "../configs/database.js";

const rolePermissionSeeder = async () => {
  try {
    await Database.authenticate();
    console.log("Database connected...");

    // await RolePermission.destroy({ where: { roleName: 'aadmin' } });
    // console.log("Existing admin user deleted.");

    const rolePermission = await RolePermission.create({
      roleId: 1,
      permissionId: 1,
    });

    console.log("Admin user created:", rolePermission);
  } catch (error) {
    console.error("Error seeding role permission", error);
  } finally {
    await Database.close();
    console.log("Database connection closed.");
  }
};

rolePermissionSeeder();
