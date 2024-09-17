import Permission from "../models/PermissionModel.js";
import ResourceModel from "../models/ResourceModel.js";
import ResourcePermissionModel from "../models/ResourcePermissionModel.js";

export const masterFormulaPermission = async () => {
  try {
    const parentPermission = await Permission.findOne({
      where: { name: "master.formula." },
    });

    const resource = await ResourceModel.findOne({
      where: { link: "/master/formula" },
    });

    const permissionPromises = permissionMasterFormula.map(
      async (permission) => {
        const permissionCreated = await Permission.create({
          name: permission.name,
          asModule: permission.asModule ?? true,
          alias: permission.alias,
          parentId: parentPermission.id,
        });

        await ResourcePermissionModel.findOrCreate({
          where: {
            resourceId: resource.id,
            permissionId: permissionCreated.id,
          },
          defaults: {
            permissionId: permissionCreated.id,
            resourceId: resource.id,
          },
        });
      }
    );

    await Promise.all(permissionPromises);

    console.log("Permissions master formula created");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};

const permissionMasterFormula = [
  {
    name: "master.formula.create",
    alias: "Tambah Formula",
    asModule: false,
  },
  {
    name: "master.formula.update",
    alias: "Edit Formula",
    asModule: false,
  },
  {
    name: "master.formula.delete",
    alias: "Hapus Formula",
    asModule: false,
  },
];
