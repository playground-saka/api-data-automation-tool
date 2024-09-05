import RoleModel from "../models/RoleModel.js";
import Database from "../configs/Database.js";

const roleSeeder = async () => {
  try {
    await Database.authenticate();
    console.log("Database connected...");

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
