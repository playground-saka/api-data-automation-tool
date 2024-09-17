import Permission from "../models/PermissionModel.js";
import ResourceModel from "../models/ResourceModel.js";
import ResourcePermissionModel from "../models/ResourcePermissionModel.js";

export const masterSelisihPermission = async () => {
  try {
    const parentPermission = await Permission.findOne({
      where: { name: "analisis_data.selisih." },
    });

    const resource = await ResourceModel.findOne({
      where: { link: "/analisis-data/selisih" },
    });

    const permissionPromises = permissionMasterSelisish.map(
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

    console.log("Permissions master selisih created");
  } catch (error) {
    console.error("Error seeding permissions:", error);
  }
};

const permissionMasterSelisish = [
  {
    name: "analisis_data.selisish.view",
    alias: "Detail Selisih",
    asModule: false,
  },
  {
    name: "analisis_data.selisish.export",
    alias: "Export Selisih",
    asModule: false,
  }
];
