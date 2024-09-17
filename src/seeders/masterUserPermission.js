import Permission from "../models/PermissionModel.js";
import ResourceModel from "../models/ResourceModel.js";
import ResourcePermissionModel from "../models/ResourcePermissionModel.js";

export const masterUserPermission = async () => {
  try {
    const parentPermission = await Permission.findOne({
      where: { name: "master.user." }});

    const resource = await ResourceModel.findOne({
      where: { link: "/master/user" },
    });

    const permissionPromises = permissionMasterUser.map(async (permission) => {
      const permissionCreated = await Permission.create({
        name: permission.name,
        asModule: permission.asModule ?? true,
        alias: permission.alias,
        parentId: parentPermission.id
      });

      await ResourcePermissionModel.findOrCreate({
        where: { resourceId: resource.id, permissionId: permissionCreated.id },
        defaults: {
          permissionId: permissionCreated.id,
          resourceId: resource.id,
        }
      });
    });

    await Promise.all(permissionPromises);

    console.log("Permissions master user created");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};

const permissionMasterUser = [
  {
    name: "master.user.create",
    alias: "Tambah User",
    asModule: false,
  },
  {
    name: "master.user.update",
    alias: "Edit User",
    asModule: false,
  },
  {
    name: "master.user.delete",
    alias: "Hapus User",
    asModule: false,
  }
];


