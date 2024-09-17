import ResourceModel from "../models/ResourceModel.js";
import Permission from "../models/PermissionModel.js";
import ResourcePermissionModel from "../models/ResourcePermissionModel.js";

const createPermission = async (permission, parentId = null) => {
  const permissionCreated = await Permission.create({
    name: permission.name,
    asModule: permission.asModule ?? true,
    alias: permission.alias,
    parentId: parentId
  });
  return permissionCreated;
};

export const resourceSeeder = async () => {
  try {
    console.log("Seeding Resources");

    const resourceLists = [
      {
        label: "Master",
        hasDropdown: true,
        link: "/master",
        iconKey: "BuildingOffice2Icon",
        permission: {
          name: "master.",
          alias: "Master",
        },
        childrens: [
          {
            label: "User",
            hasDropdown: false,
            link: "/master/user",
            permission: {
              name: "master.user.",
              alias: "User",
            },
          },
          {
            label: "Kategori",
            hasDropdown: false,
            link: "/master/kategori",
            permission: {
              name: "master.kategori.",
              alias: "Kategori",
            },
          },
          {
            label: "Pelanggan",
            hasDropdown: false,
            link: "/master/pelanggan",
            permission: {
              name: "master.pelanggan.",
              alias: "Pelanggan",
            },
          },
          {
            label: "Formula",
            hasDropdown: false,
            link: "/master/formula",
            permission: {
              name: "master.formula.",
              alias: "Formula",
            },
          },
          {
            label: "Logsheet",
            hasDropdown: false,
            link: "/master/logsheet",
            permission: {
              name: "master.logsheet.",
              alias: "Logsheet",
            },
          },
        ],
      },
      {
        label: "Analisis Data",
        hasDropdown: true,
        link: "/analusis-data",
        iconKey: "ChartBarSquareIcon",
        permission: {
          name: "analisis_data.",
          alias: "Analisis Data",
        },
        childrens: [
          {
            label: "Selisih",
            hasDropdown: false,
            link: "/analisis-data/selisih",
            permission: {
              name: "analisis_data.selisih.",
              alias: "Selisih",
            },
          },
        ],
      },
      {
        label: "Acl",
        hasDropdown: true,
        link: "/acl",
        iconKey: "Cog6ToothIcon",
        permission: {
          name: "acl.",
          alias: "Acl",
        },
        childrens: [
          {
            label: "Role",
            hasDropdown: false,
            link: "/acl/role",
            permission: {
              name: "acl.role.",
              alias: "Role",
            },
          },
        ],
      },
    ];

    const resources = await Promise.all(resourceLists.map(async (resourceList) => {      
      const resource = await ResourceModel.create({
        label: resourceList.label,
        hasDropdown: resourceList.hasDropdown,
        link: resourceList.link,
        iconKey: resourceList.iconKey,
        parentId: null,
      });

      let parentPermissionId = null;
      if (resourceList.permission) {
        const parentPermission = await createPermission(
          resourceList.permission
        );
        await ResourcePermissionModel.create({
          resourceId: resource.id,
          permissionId: parentPermission.id,
        });
        parentPermissionId = parentPermission.id;
      }

      if(resourceList.childrens) {
        const children = [];
        for (const child of resourceList.childrens) {
          const resourceChild = await ResourceModel.create({
            label: child.label,
            hasDropdown: child.hasDropdown,
            link: child.link,
            iconKey: child.iconKey ?? null,
            parentId: resource.id,
          });

          if(child.permission) {
            const childPermission = await createPermission(child.permission,parentPermissionId);
            await ResourcePermissionModel.create({
              resourceId: resourceChild.id,
              permissionId: childPermission.id,
            });
          }
          children.push(resourceChild);
        }

        return children;
      }
      return resource;
    }));
    return resources;
  } catch (error) {
    console.error("Error seeding resource:", error);
  } 
};


