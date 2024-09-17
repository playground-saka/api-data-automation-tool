
import Database from "../configs/Database.js";
import { resourceSeeder } from "./resourceSeeder.js";
import { masterUserPermission } from "./masterUserPermission.js";
import { masterCategoryPermission } from "./masterCategoryPermission.js";
import { masterPelangganPermission } from "./masterPelangganPermission.js";
import { masterFormulaPermission } from "./masterFormulaPermission.js";
import { masterLogsheetPermission } from "./masterLogsheetPermission.js";
import { masterSelisihPermission } from "./masterSelisihPermission.js";
import { adminPermission } from "./adminPermission.js";
import { aclPermission } from "./aclPermission.js";
import { roleSeeder } from "./roleSeeder.js";
import { seedAdmin } from "./adminSeeder.js";



const seeding = async () => {
  console.log("Seeding start");
  try {
    // await Database.authenticate();
    console.log("Database connected...");
    
    await roleSeeder();
    await seedAdmin();
    await resourceSeeder();
    await masterUserPermission();
    await masterCategoryPermission();
    await masterPelangganPermission();
    await masterFormulaPermission();
    await masterLogsheetPermission();
    await masterSelisihPermission();
    await aclPermission();
    await adminPermission();

  } catch (error) {
    console.error("Error connecting to the database:", error);
  }

  await Database.close();
  console.log("Database connection closed.");
  console.log("Seeding done");
}
seeding()