# Backend for FiDO Whatsapp Service API

## Step by step installation
### Clone Repository
```bash
git clone https://github.com/FiDO-Whatsapp-API-Service/frontend_fido
```

### Generate Environtment (.env)
```bash
cp .env.example .env
```

### Install Dependency
```bash
npm install
# or
yarn
```

### Migration Prisma
buat database baru lalu atur nama database, user, dan password di `.env` lalu jalankan perintah berikut
```bash
npx prisma db push

```
### Build App
hasil `build` akan disimpan dalam folder `/dist`
```bash
npm run build
```

### Running App
App hanya dapat berjalan ketika telah di-`build` maka dari itu lakukan Build App terlebih dahulu
```bash
#setelah melakukan build
npm run start
```

### Build & Running App in one prompt
anda dapat melakukan `build` dan langsung menjalankan app dalam sekali prompt dengan perintah berikut
```bash
npm run serve
```

