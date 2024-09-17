import Permission from "../models/PermissionModel.js";
import ResourceModel from "../models/ResourceModel.js";
import ResourcePermissionModel from "../models/ResourcePermissionModel.js";

export const masterPelangganPermission = async () => {
  try {
    const parentPermission = await Permission.findOne({
      where: { name: "master.pelanggan." },
    });

    const resource = await ResourceModel.findOne({
      where: { link: "/master/pelanggan" },
    });

    const permissionPromises = permissionMasterPelanggan.map(async (permission) => {
      const permissionCreated = await Permission.create({
        name: permission.name,
        asModule: permission.asModule ?? true,
        alias: permission.alias,
        parentId: parentPermission.id,
      });

      await ResourcePermissionModel.findOrCreate({
        where: { resourceId: resource.id, permissionId: permissionCreated.id },
        defaults: {
          permissionId: permissionCreated.id,
          resourceId: resource.id,
        },
      });
    });

    await Promise.all(permissionPromises);

    console.log("Permissions master pelanggan created");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};

const permissionMasterPelanggan = [
  {
    name: "master.pelanggan.create",
    alias: "Tambah Pelanggan",
    asModule: false,
  },
  {
    name: "master.pelanggan.update",
    alias: "Edit Pelanggan",
    asModule: false,
  },
  {
    name: "master.pelanggan.delete",
    alias: "Hapus Pelanggan",
    asModule: false,
  },
];
