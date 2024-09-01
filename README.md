# Backend Express

Backend Express adalah proyek backend menggunakan Express.js, Sequelize, dan MySQL untuk mengelola aplikasi web. Proyek ini mencakup pengaturan otentikasi, manajemen pengguna, dan pengelolaan data menggunakan Sequelize ORM.

## Install 

1. Clone repositori ini

```bash
git clone https://github.com/Rafijohari18/dat-pln-api.git
```

2. Masuk ke direktori proyek:
```bash
cd backend-express
```

3. Install dependencies:
```bash
npm install
```

4. Buat file .env di root direktori proyek dan tambahkan konfigurasi berikut:
```bash
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
PORT=
```


## Pengunaan
1. Untuk menjalankan project dalam mode development, gunakan:
```bash
npm run dev
```
2. Untuk menjalankan seeder (misalnya, untuk menambahkan admin pengguna), gunakan:
```bash
node src/seeders/adminSeeder.js
```

## Struktur Project

```bash
├── src
│   ├── config
│   │   └── Database.js
│   ├── controllers
│   │   └── AuthController.js
│   │   └── PltmController.js
│   │   └── UnitPltmController.js
│   ├── middleware
│   │   └── AuthMiddleware.js
│   ├── models
│   │   └── PermissionModel.js
│   │   └── PltmModel.js
│   │   └── RoleModel.js
│   │   └── RolePermissionModel.js
│   │   └── UnitPltmModel.js
│   │   └── UserModel.js
│   │   └── UserRole.js
│   ├── routes
│   │   └── index.js
│   ├── seeders
│   │   └── adminSeeder.js
│   ├── utils
│   │   └── generateToken.js
├── .gitignore
├── .env.example
├── index.js
├── persyaratan.txt
├── package-lock.json
├── package.json
└── README.md
```