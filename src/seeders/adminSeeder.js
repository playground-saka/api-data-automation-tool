import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel.js';
import UserRoleModel from '../models/UserRoleModel.js';
import RoleModel from '../models/RoleModel.js';

export const seedAdmin = async () => {
  try {
    console.log("Seeding admin user");
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456789', salt);

    const [admin, createdUser] = await UserModel.findOrCreate({
      where: { username: 'admin' },
      defaults: {
        username: 'admin',
        fullName: 'admin',
        email: 'admin@gmail.com',
        password: passwordHash,
        isActive: true,
      },
    });

    if (!createdUser) {
      console.log("Admin user already exists, skipping...");
      return;
    }

    const role = await RoleModel.findOne({ where: { roleName: 'admin' } });
    if (!role) {
      console.error('Error seeding admin user: admin role not found');
      return;
    }

    const [userRole, created] = await UserRoleModel.findOrCreate({
      where: { userId: admin.id },
      defaults: {
        userId: admin.id,
        roleId: role.id,
      },
    });
    if (!created) {
      await userRole.update({
        roleId: role.id,
      });
    }

    console.log("Admin user created:", admin);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
};

