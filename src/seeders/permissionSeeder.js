import Permission from "../models/PermissionModel.js";
import Database from "../configs/database.js";

const permissionSeeder = async () => {
  try {
    await Database.authenticate();
    console.log("Database connected...");

    const permissions = [
      //  formula
      {
        permissionName: "view_formula",
        description: "Permission to view a formula",
      },
      {
        permissionName: "create_formula",
        description: "Permission to create formula",
      },
      {
        permissionName: "update_formula",
        description: "Permission to update a formula",
      },
      {
        permissionName: "delete_formula",
        description: "Permission to update a formula",
      },
      {
        permissionName: "read_formula",
        description: "Permission to delete a formula",
      },
      //   kategori
      {
        permissionName: "view_kategori",
        description: "Permission to view a kategori",
      },
      {
        permissionName: "create_kategori",
        description: "Permission to create formula",
      },
      {
        permissionName: "update_kategori",
        description: "Permission to update a kategori",
      },
      {
        permissionName: "delete_kategori",
        description: "Permission to delete a kategori",
      },
      {
        permissionName: "read_kategori",
        description: "Permission to read a kategori",
      },
      // pelanggan
      {
        permissionName: "view_pelanggan",
        description: "Permission to view a pelanggan",
      },
      {
        permissionName: "create_pelanggan",
        description: "Permission to create pelanggan",
      },
      {
        permissionName: "update_pelanggan",
        description: "Permission to update a pelanggan",
      },
      {
        permissionName: "delete_pelanggan",
        description: "Permission to delete a pelanggan",
      },
      {
        permissionName: "read_pelanggan",
        description: "Permission to read a pelanggan",
      },
      //   logsheet status
      {
        permissionName: "view_logsheet_status",
        description: "Permission to view a logsheet status",
      },
      {
        permissionName: "create_logsheet_status",
        description: "Permission to create logsheet status",
      },
      {
        permissionName: "update_logsheet_status",
        description: "Permission to update a logsheet status",
      },
      {
        permissionName: "delete_logsheet_status",
        description: "Permission to delete a logsheet status",
      },
      {
        permissionName: "read_logsheet_status",
        description: "Permission to read a logsheet status",
      },
      //   logsheet manual
      {
        permissionName: "upload_logsheet_manual",
        description: "Permission to upload a logsheet manual",
      },
      //   logsheet siste,
      {
        permissionName: "upload_logsheet_sistem",
        description: "Permission to upload a logsheet sistem",
      },
      {
        permissionName: "read_selisih",
        description: "Permission to read a selisih",
      },
      {
        permissionName: "view_selisih",
        description: "Permission to view a selisih",
      },
    ];

    const createdPermissions = await Permission.bulkCreate(permissions);

    console.log("Permissions created:", createdPermissions);
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};

permissionSeeder();
