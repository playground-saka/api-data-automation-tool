import Permission from "../models/PermissionModel.js";
import ResourceModel from "../models/ResourceModel.js";
import ResourcePermissionModel from "../models/ResourcePermissionModel.js";

export const aclPermission = async () => {
  try {
    const parentPermission = await Permission.findOne({
      where: { name: "acl.role." },
    });

    const resource = await ResourceModel.findOne({
      where: { link: "/acl/role" },
    });

    const permissionPromises = permissionAclRole.map(async (permission) => {
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

const permissionAclRole = [
  {
    name: "acl.role.create",
    alias: "Tambah Role",
    asModule: false,
  },
  {
    name: "acl.role.update",
    alias: "Edit Role",
    asModule: false,
  },
  {
    name: "acl.role.delete",
    alias: "Hapus Role",
    asModule: false,
  },
  {
    name: "acl.role.setting",
    alias: "Seting Role Permission",
    asModule: false,
  },
];
