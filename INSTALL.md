# 🚀 Panduan Instalasi Sistem Kasir Restaurant

## 📋 Prerequisites

Pastikan sistem Anda memiliki requirements berikut:

### Software Requirements
- **PHP**: 8.1 atau lebih tinggi
- **Composer**: 2.0+
- **MySQL**: 8.0+ atau MariaDB 10.3+
- **Node.js**: 16.0+ 
- **NPM**: 8.0+
- **Web Server**: Apache 2.4+ atau Nginx 1.18+

### PHP Extensions
```bash
# Pastikan extension berikut sudah terinstall
php -m | grep -E "(pdo|mysql|gd|curl|zip|xml|mbstring|openssl|tokenizer|json|bcmath)"
```

Required extensions:
- PDO PHP Extension
- MySQL PHP Extension
- GD PHP Extension
- cURL PHP Extension
- Zip PHP Extension
- XML PHP Extension
- Mbstring PHP Extension
- OpenSSL PHP Extension
- Tokenizer PHP Extension
- JSON PHP Extension
- BCMath PHP Extension

## 📥 Download & Setup

### 1. Clone Repository
```bash
# Clone dari GitHub
git clone https://github.com/your-repo/kasir-restaurant.git
cd kasir-restaurant

# Atau download ZIP dan extract
```

### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Build assets
npm run build
```

## ⚙️ Konfigurasi Environment

### 1. Setup Environment File
```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 2. Konfigurasi Database
Edit file `.env` dan sesuaikan dengan database Anda:

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kasir_restaurant
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 3. Konfigurasi Midtrans (Opsional)
Untuk menggunakan payment gateway Midtrans:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true
```

### 4. Konfigurasi Mail (Opsional)
Untuk fitur notifikasi email:

```env
# Mail Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="Kasir Restaurant"
```

## 🗄️ Setup Database

### 1. Buat Database
```sql
-- Login ke MySQL
mysql -u root -p

-- Buat database
CREATE DATABASE kasir_restaurant;

-- Buat user (opsional)
CREATE USER 'kasir_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON kasir_restaurant.* TO 'kasir_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Jalankan Migration
```bash
# Jalankan migration untuk membuat tabel
php artisan migrate

# Jalankan seeder untuk data awal
php artisan db:seed
```

### 3. Data Seeder (Default)
Seeder akan membuat:
- **Admin User**: email: `admin@kasir.com`, password: `password`
- **Kasir User**: email: `kasir@kasir.com`, password: `password`
- **Koki User**: email: `koki@kasir.com`, password: `password`
- **Sample Categories**: Makanan, Minuman, Snack
- **Sample Products**: Beberapa produk contoh
- **Sample Settings**: Konfigurasi dasar sistem

## 🔧 Konfigurasi Web Server

### Apache Configuration
Buat file `.htaccess` di root folder:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

Atau konfigurasi Virtual Host:
```apache
<VirtualHost *:80>
    ServerName kasir.local
    DocumentRoot /path/to/kasir-restaurant/public
    
    <Directory "/path/to/kasir-restaurant/public">
        AllowOverride All
        Order allow,deny
        Allow from all
    </Directory>
</VirtualHost>
```

### Nginx Configuration
```nginx
server {
    listen 80;
    server_name kasir.local;
    root /path/to/kasir-restaurant/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## 🔒 Setup Permission

### Linux/macOS
```bash
# Set permission untuk storage dan cache
chmod -R 775 storage bootstrap/cache

# Set ownership (sesuaikan dengan web server user)
chown -R www-data:www-data storage bootstrap/cache

# Atau untuk development
chmod -R 777 storage bootstrap/cache
```

### Windows
```cmd
# Berikan Full Control permission untuk folder:
# - storage/
# - bootstrap/cache/
```

## 🚀 Menjalankan Aplikasi

### Development Server
```bash
# Jalankan Laravel development server
php artisan serve

# Akses melalui browser
# http://localhost:8000
```

### Production Server
```bash
# Optimize untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Setup cron job untuk queue worker
# * * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

## 🔧 Konfigurasi Tambahan

### 1. Setup Queue Worker (Opsional)
```bash
# Untuk background job processing
php artisan queue:work

# Atau setup supervisor untuk production
```

### 2. Setup File Storage
```bash
# Link storage untuk public access
php artisan storage:link

# Konfigurasi di .env
FILESYSTEM_DISK=local
# atau untuk cloud storage
FILESYSTEM_DISK=s3
```

### 3. Setup Backup (Opsional)
```bash
# Install backup package
composer require spatie/laravel-backup

# Publish config
php artisan vendor:publish --provider="Spatie\Backup\BackupServiceProvider"

# Setup backup cron
php artisan backup:run
```

## ✅ Verifikasi Instalasi

### 1. Cek System Requirements
```bash
php artisan about
```

### 2. Test Database Connection
```bash
php artisan migrate:status
```

### 3. Test Login
- Buka browser dan akses aplikasi
- Login dengan akun default:
  - **Admin**: admin@kasir.com / password
  - **Kasir**: kasir@kasir.com / password
  - **Koki**: koki@kasir.com / password

### 4. Test Features
- Buat transaksi baru
- Test payment method
- Test notification system
- Cek reporting features

## 🐛 Troubleshooting

### Common Issues

#### 1. Permission Denied
```bash
# Fix storage permission
sudo chmod -R 775 storage bootstrap/cache
sudo chown -R www-data:www-data storage bootstrap/cache
```

#### 2. Database Connection Error
```bash
# Check database service
sudo systemctl status mysql

# Check credentials in .env file
# Test connection
php artisan tinker
DB::connection()->getPdo();
```

#### 3. 500 Internal Server Error
```bash
# Check error logs
tail -f storage/logs/laravel.log

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear
```

#### 4. Composer Issues
```bash
# Update composer
composer self-update

# Clear composer cache
composer clear-cache

# Install with no-dev
composer install --no-dev --optimize-autoloader
```

#### 5. NPM Build Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
npm run build
```

## 📞 Support

Jika mengalami masalah durante instalasi:

1. **Check System Requirements**: Pastikan semua requirements terpenuhi
2. **Read Error Messages**: Baca dengan teliti pesan error
3. **Check Documentation**: Cek dokumentasi Laravel dan package yang digunakan
4. **Contact Developer**: 
   - UI/UX Issues: [@SkyyDcode](https://github.com/SkyyDcode)
   - Backend Issues: [@Natz6N](https://github.com/Natz6N/Natz6N)

## 🎉 Selamat!

Jika semua langkah berhasil, sistem kasir restaurant Anda sudah siap digunakan!

**Next Steps:**
1. Ubah password default
2. Konfigurasi setting sesuai kebutuhan
3. Tambahkan kategori dan produk
4. Setup payment gateway
5. Training user untuk menggunakan sistem

---

**Happy Coding! 🚀**
