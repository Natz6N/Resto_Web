# 🍽️ Sistem Kasir Restaurant

Sistem Point of Sale (POS) modern untuk restaurant dengan antarmuka yang intuitif dan fitur manajemen lengkap.

## 👥 Tim Pengembang

### UI/UX Designer
- **Designed By**: skyyDcode
- **GitHub**: [@SkyyDcode](https://github.com/SkyyDcode)

### Fullstack Developer
- **Created by**: Natz
- **GitHub**: [@Natz6N](https://github.com/Natz6N/Natz6N)

## ✨ Fitur Utama

### 🔐 Manajemen User
- **Sistem Role** - Kasir dan Koki dengan hak akses berbeda
- **Autentikasi** - Login/logout dengan keamanan tinggi
- **Activity Tracking** - Log aktivitas pengguna

### 📦 Manajemen Produk
- **Kategori Produk** - Organisasi menu yang rapi
- **Detail Lengkap** - Harga, gambar, deskripsi, ingredients
- **Stok Management** - Tracking stok dengan alert minimum
- **Status Produk** - Available, unavailable, out of stock
- **Filtering** - Vegetarian, vegan, spicy indicators

### 💰 Sistem Transaksi
- **Multiple Payment** - COD, Midtrans, Dummy payment
- **Order Tracking** - Status dari pending hingga served
- **Kode Transaksi** - Auto-generate dengan format TR+tanggal+sequence
- **Customer Info** - Nama customer dan nomor meja
- **Receipt System** - Slip pembayaran otomatis

### 🎯 Sistem Diskon
- **Flexible Discount** - Percentage, fixed amount, BOGO
- **Promo Code** - Kode voucher dengan validasi
- **Time-based** - Discount dengan waktu berlaku
- **Usage Limit** - Batasan penggunaan voucher

### 📊 Reporting & Analytics
- **Sales Report** - Laporan penjualan harian/bulanan
- **Product Analytics** - Produk terlaris dan profit margin
- **User Performance** - Kinerja kasir dan koki
- **Activity Logs** - Log semua aktivitas sistem

### 🔔 Notifikasi
- **Real-time Updates** - Notifikasi order baru untuk koki
- **Status Changes** - Update status pesanan
- **Stock Alerts** - Peringatan stok menipis

## 🛠️ Tech Stack

- **Framework**: Laravel 12+
- **Database**: MySQL
- **Payment Gateway**: Midtrans
- **Authentication**: Laravel Sanctum
- **Frontend**: React typescript & inertiajs
- **Storage**: Local/Cloud Storage

## 📋 Requirements

- PHP 8.2+
- Composer
- MySQL 8.0+
- Node.js & NPM
- Apache/Nginx

## 🚀 Installation

Lihat file [INSTALL.md](INSTALL.md) untuk panduan instalasi lengkap.

## 📊 Database Schema

### Core Tables
- **users** - Data pengguna (kasir & koki)
- **categories** - Kategori menu
- **products** - Data produk/menu
- **transactions** - Data transaksi
- **transaction_items** - Detail item transaksi
- **discounts** - Data voucher/diskon
- **notifications** - Sistem notifikasi
- **activity_logs** - Log aktivitas
- **settings** - Konfigurasi sistem

## 🔄 Workflow

Lihat file [FLOWCHART.md](FLOWCHART.md) untuk diagram alur sistem.

## 📜 License

Lihat file [LICENSE](LICENSE) untuk informasi lisensi.

## 🤝 Contributing

1. Fork repository ini
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📞 Support

Jika ada pertanyaan atau bug report:
- **UI/UX Issues**: Contact [@SkyyDcode](https://github.com/SkyyDcode)
- **Backend Issues**: Contact [@Natz6N](https://github.com/Natz6N/Natz6N)

## 🎉 Acknowledgments

Terima kasih kepada semua kontributor yang telah membantu pengembangan sistem ini.

---

**Made with ❤️ by skyyDcode & Natz**
