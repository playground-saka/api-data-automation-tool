import Permission from "../models/PermissionModel.js";
import ResourceModel from "../models/ResourceModel.js";
import ResourcePermissionModel from "../models/ResourcePermissionModel.js";

export const masterLogsheetPermission = async () => {
  try {
    const parentPermission = await Permission.findOne({
      where: { name: "master.logsheet." },
    });

    const resource = await ResourceModel.findOne({
      where: { link: "/master/logsheet" },
    });

    const permissionPromises = permissionMasterLogsheet.map(
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

const permissionMasterLogsheet = [
  {
    name: "master.logsheet.generate",
    alias: "Geneared Logsheet",
    asModule: false,
  },
  {
    name: "master.logsheet.upload",
    alias: "Upload Logsheet",
    asModule: false,
  },
  {
    name: "master.logsheet.rollback",
    alias: "Rollback Logsheet",
    asModule: false,
  },
];
