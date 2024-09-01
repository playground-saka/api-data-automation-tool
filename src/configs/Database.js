import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

// localhost
const Database = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// staging
// const DATABASE_URL = process.env.DATABASE_URL;

// const Database = new Sequelize(DATABASE_URL, {
//   dialect: 'postgres',
//   protocol: 'postgres',
//   logging: false, // Set to true if you want to see the SQL queries in the console
//   dialectOptions: {
//     // Additional options like SSL can be configured here if needed
//   },
// });

Database
  .authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.log("Error: " + err));

export default Database;
