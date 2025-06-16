# 📊 Flowchart Sistem Kasir Restaurant

## 🔐 Alur Autentikasi

```mermaid
graph TD
    A[User Access] --> B{Sudah Login?}
    B -->|Ya| C[Dashboard]
    B -->|Tidak| D[Login Page]
    D --> E[Input Credentials]
    E --> F{Valid?}
    F -->|Ya| G[Set Session]
    F -->|Tidak| H[Error Message]
    G --> I{Role Check}
    I -->|Kasir| J[Kasir Dashboard]
    I -->|Koki| K[Koki Dashboard]
    H --> D
```

## 🛒 Alur Transaksi Kasir

```mermaid
graph TD
    A[Kasir Login] --> B[Pilih Produk]
    B --> C[Tambah ke Cart]
    C --> D{Lanjut Belanja?}
    D -->|Ya| B
    D -->|Tidak| E[Review Cart]
    E --> F[Input Customer Info]
    F --> G[Pilih Payment Method]
    G --> H{Payment Method}
    H -->|COD| I[Hitung Kembalian]
    H -->|Midtrans| J[Generate Payment Link]
    H -->|Dummy| K[Mark as Paid]
    I --> L[Cetak Struk]
    J --> M{Payment Success?}
    M -->|Ya| L
    M -->|Tidak| N[Payment Failed]
    K --> L
    L --> O[Kirim ke Koki]
    N --> G
```

## 👨‍🍳 Alur Dapur (Koki)

```mermaid
graph TD
    A[Koki Login] --> B[Lihat Order Baru]
    B --> C{Ada Order?}
    C -->|Tidak| D[Wait for Notification]
    C -->|Ya| E[Pilih Order]
    E --> F[Update Status: Preparing]
    F --> G[Masak Pesanan]
    G --> H[Update Status: Ready]
    H --> I[Notifikasi Kasir]
    I --> J{Ada Order Lain?}
    J -->|Ya| E
    J -->|Tidak| B
    D --> B
```

## 💰 Alur Payment Processing

```mermaid
graph TD
    A[Pilih Payment] --> B{Payment Method}
    B -->|COD| C[Input Jumlah Bayar]
    B -->|Midtrans| D[Generate Midtrans Token]
    B -->|Dummy| E[Auto Success]
    
    C --> F{Cukup?}
    F -->|Ya| G[Hitung Kembalian]
    F -->|Tidak| H[Error Insufficient]
    
    D --> I[Redirect ke Midtrans]
    I --> J[Customer Payment]
    J --> K[Callback Handler]
    K --> L{Payment Success?}
    L -->|Ya| M[Update Status: Paid]
    L -->|Tidak| N[Update Status: Failed]
    
    E --> M
    G --> M
    H --> C
    M --> O[Generate Receipt]
    N --> P[Show Error]
```

## 📦 Alur Manajemen Stok

```mermaid
graph TD
    A[Produk Terjual] --> B[Kurangi Stok]
    B --> C{Stok Tersisa}
    C -->|> Min Stock| D[Continue]
    C -->|<= Min Stock| E[Generate Alert]
    C -->|= 0| F[Update Status: Out of Stock]
    E --> G[Notifikasi Admin]
    F --> H[Auto Hide from Menu]
    G --> D
    H --> I[Update Product Status]
```

## 🎯 Alur Sistem Diskon

```mermaid
graph TD
    A[Apply Discount] --> B{Discount Type}
    B -->|Code| C[Input Discount Code]
    B -->|Auto| D[Check Available Discounts]
    
    C --> E[Validate Code]
    E --> F{Valid?}
    F -->|Ya| G[Check Conditions]
    F -->|Tidak| H[Invalid Code Error]
    
    D --> I[List Available Discounts]
    I --> J[Select Discount]
    J --> G
    
    G --> K{Conditions Met?}
    K -->|Ya| L[Calculate Discount]
    K -->|Tidak| M[Condition Error]
    
    L --> N[Apply to Transaction]
    N --> O[Update Usage Count]
    
    H --> A
    M --> A
```

## 🔔 Alur Notifikasi

```mermaid
graph TD
    A[System Event] --> B{Event Type}
    B -->|New Order| C[Notify Koki]
    B -->|Order Ready| D[Notify Kasir]
    B -->|Payment Success| E[Notify All]
    B -->|Low Stock| F[Notify Admin]
    B -->|System Error| G[Notify Admin]
    
    C --> H[Create Notification]
    D --> H
    E --> H
    F --> H
    G --> H
    
    H --> I[Store in Database]
    I --> J[Send Real-time Notification]
    J --> K[Mark as Sent]
```

## 📊 Alur Reporting

```mermaid
graph TD
    A[Access Reports] --> B{Report Type}
    B -->|Sales Report| C[Daily/Monthly Sales]
    B -->|Product Report| D[Product Performance]
    B -->|User Report| E[User Activity]
    
    C --> F[Filter by Date]
    D --> G[Filter by Category]
    E --> H[Filter by User]
    
    F --> I[Generate Sales Data]
    G --> J[Generate Product Data]
    H --> K[Generate Activity Data]
    
    I --> L[Export/Display]
    J --> L
    K --> L
```

## 🔄 Alur Order Status

```mermaid
graph TD
    A[Order Created] --> B[Status: Pending]
    B --> C[Koki Terima Order]
    C --> D[Status: Preparing]
    D --> E[Koki Selesai Masak]
    E --> F[Status: Ready]
    F --> G[Kasir Ambil Order]
    G --> H[Status: Served]
    H --> I[Order Complete]
    
    B --> J[Cancel Order]
    D --> J
    J --> K[Status: Cancelled]
```

## ⚙️ Alur Konfigurasi Sistem

```mermaid
graph TD
    A[Admin Access] --> B[Settings Page]
    B --> C{Setting Type}
    C -->|General| D[Restaurant Info]
    C -->|Payment| E[Payment Config]
    C -->|Notification| F[Notification Config]
    C -->|Tax| G[Tax Settings]
    
    D --> H[Update Settings]
    E --> H
    F --> H
    G --> H
    
    H --> I[Validate Settings]
    I --> J{Valid?}
    J -->|Ya| K[Save to Database]
    J -->|Tidak| L[Validation Error]
    
    K --> M[Apply Changes]
    L --> B
```

---

**Flowchart ini menggambarkan alur kerja utama dalam sistem kasir restaurant. Setiap alur dirancang untuk memberikan pengalaman pengguna yang optimal dan efisiensi operasional.**
