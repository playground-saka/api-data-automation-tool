import RoleModel from "../models/RoleModel.js";
import Database from "../configs/database.js";

const roleSeeder = async () => {
  try {
    await Database.authenticate();
    console.log("Database connected...");

    // await RoleModel.destroy({ where: { roleName: 'aadmin' } });
    // console.log("Existing admin user deleted.");

    const adminRole = await RoleModel.create({
      roleName: "admin",
      description: "Admin role",
    });

    console.log("Admin user created:", adminRole);
  } catch (error) {
    console.error("Error seeding admin role:", error);
  } finally {
    await Database.close();
    console.log("Database connection closed.");
  }
};

roleSeeder();
