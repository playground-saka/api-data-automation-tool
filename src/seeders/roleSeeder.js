import RoleModel from "../models/RoleModel.js";

export const roleSeeder = async () => {
  try {
    console.log("Start seeding role");
    const [adminRole] = await RoleModel.findOrCreate({
      where: { roleName: "Admin" },
      defaults: {
        roleName: "Admin",
        description: "Admin role",
      },
    });
    console.log("Admin role created:", adminRole);
  } catch (error) {
    console.error("Error seeding admin role:", error);
  }
};