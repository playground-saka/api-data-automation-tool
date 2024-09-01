import bcrypt from 'bcryptjs';
import UserModel from '../models/UserModel.js';
import Database from '../configs/database.js';

const seedAdmin = async () => {
  try {
    await Database.authenticate();
    console.log("Database connected...");

    // await UserModel.destroy({ where: { email: 'admin@example.com' } });
    // console.log("Existing admin user deleted.");

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456789', salt);

    const admin = await UserModel.create({
      username: 'admin',
      email: 'admin@gmail.com',
      password: passwordHash,
      isActive: true,
    });

    console.log("Admin user created:", admin);
  } catch (error) {
    console.error("Error seeding admin user:", error);
  } finally {
    await Database.close();
    console.log("Database connection closed.");
  }
};

seedAdmin();
