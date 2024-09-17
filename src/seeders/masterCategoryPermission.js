import Permission from "../models/PermissionModel.js";
import ResourceModel from "../models/ResourceModel.js";
import ResourcePermissionModel from "../models/ResourcePermissionModel.js";

export const masterCategoryPermission = async () => {
  try {
    const parentPermission = await Permission.findOne({
      where: { name: "master.kategori." },
    });

    const resource = await ResourceModel.findOne({
      where: { link: "/master/kategori" },
    });

    const permissionPromises = permissionMasterUser.map(async (permission) => {
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

    console.log("Permissions master kategori created");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};

const permissionMasterUser = [
  {
    name: "master.kategori.create",
    alias: "Tambah Kategori",
    asModule: false,
  },
  {
    name: "master.kategori.update",
    alias: "Edit Kategori",
    asModule: false,
  },
  {
    name: "master.kategori.delete",
    alias: "Hapus Kategori",
    asModule: false,
  },
];
