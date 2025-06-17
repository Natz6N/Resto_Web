// types/index.ts
export interface User {
    id: number;
    name: string;
    email: string;
    role: 'kasir' | 'koki';
    phone?: string;
    is_active: boolean;
    last_login_at?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Computed attributes
    role_display: string;
    is_kasir: boolean;
    is_koki: boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    color: string;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Relationships
    products?: Product[];
    active_products?: Product[];

    // Computed attributes
    products_count: number;
    active_products_count: number;
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description?: string;
    price: number;
    image?: string;
    gallery?: string[];
    status: 'available' | 'unavailable' | 'out_of_stock';
    stock?: number;
    min_stock?: number;
    is_discountable: boolean;
    is_featured: boolean;
    preparation_time: number;
    cost_price?: number;
    ingredients?: string[];
    allergens?: string[];
    calories?: number;
    is_spicy: boolean;
    is_vegetarian: boolean;
    is_vegan: boolean;
    sort_order: number;
    rating?: number;
    views?: number;
    sold_count?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Relationships
    category?: Category;
    transaction_items?: TransactionItem[];
    discounts?: Discount[];
    reviews?: ProductReview[];

    // Computed attributes
    is_in_stock: boolean;
    is_low_stock: boolean;
    status_label: string;
    profit_margin?: number;
    formatted_price: string;
}

export interface ProductReview {
    id: number;
    product_id: number;
    user_id?: number;
    customer_name: string;
    rating: number;
    comment: string;
    is_approved: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Relationships
    product?: Product;
    user?: User;
}

export interface Feedback {
    id: number;
    user_id?: number;
    customer_name: string;
    email?: string;
    subject: string;
    message: string;
    rating: number;
    is_resolved: boolean;
    resolved_at?: string;
    resolved_by?: number;
    response?: string;
    created_at: string;
    updated_at: string;

    // Relationships
    user?: User;
    resolver?: User;
}

export interface Transaction {
    id: number;
    transaction_code: string;
    cashier_id: number;
    payment_method: 'COD' | 'Midtrans' | 'Dummy';
    payment_status: 'belum_dibayar' | 'dibayar' | 'batal';
    order_status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    paid_amount: number;
    change_amount: number;
    customer_name?: string;
    table_number?: string;
    notes?: string;
    midtrans_transaction_id?: string;
    midtrans_response?: any;
    paid_at?: string;
    served_at?: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Relationships
    cashier?: User;
    items?: TransactionItem[];

    // Computed attributes
    payment_status_label: string;
    order_status_label: string;
    formatted_total: string;
    total_items: number;
}

export interface TransactionItem {
    id: number;
    transaction_id: number;
    product_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    product_name: string;
    product_description?: string;
    product_image?: string;
    category_name: string;
    notes?: string;
    status: 'pending' | 'preparing' | 'ready' | 'served';
    prepared_at?: string;
    created_at: string;
    updated_at: string;

    // Relationships
    transaction?: Transaction;
    product?: Product;

    // Computed attributes
    status_label: string;
    formatted_total: string;
}

export interface Discount {
    id: number;
    name: string;
    code?: string;
    description?: string;
    type: 'percentage' | 'fixed' | 'buy_one_get_one';
    value: number;
    minimum_amount?: number;
    maximum_discount?: number;
    usage_limit?: number;
    usage_count: number;
    is_active: boolean;
    starts_at: string;
    expires_at: string;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Relationships
    products?: Product[];
}

export interface Setting {
    id: number;
    key: string;
    value: any;
    type: 'string' | 'integer' | 'boolean' | 'json';
    group: string;
    description?: string;
    created_at: string;
    updated_at: string;
}

export interface Notification {
    id: number;
    type: string;
    notifiable_type: string;
    notifiable_id: number;
    data: any;
    read_at?: string;
    created_at: string;
    updated_at: string;
}

export interface ActivityLog {
    id: number;
    log_name?: string;
    description: string;
    subject_type?: string;
    subject_id?: number;
    causer_type?: string;
    causer_id?: number;
    properties?: any;
    batch_uuid?: string;
    created_at: string;
    updated_at: string;
}

// API Response Types
export interface ApiResponse<T = any> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginatedResponse<T = any> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url?: string;
        label: string;
        active: boolean;
    }>;
    next_page_url?: string;
    path: string;
    per_page: number;
    prev_page_url?: string;
    to: number;
    total: number;
}

// Form Types
export interface CategoryForm {
    name: string;
    slug?: string;
    description?: string;
    icon?: string;
    color: string;
    is_active: boolean;
    sort_order: number;
}

export interface ProductForm {
    category_id: number;
    name: string;
    slug?: string;
    description?: string;
    price: number;
    image?: File | string;
    gallery?: (File | string)[];
    status: 'available' | 'unavailable' | 'out_of_stock';
    stock?: number;
    min_stock?: number;
    is_discountable: boolean;
    is_featured: boolean;
    preparation_time: number;
    cost_price?: number;
    ingredients?: string[];
    allergens?: string[];
    calories?: number;
    is_spicy: boolean;
    is_vegetarian: boolean;
    is_vegan: boolean;
    sort_order: number;
}

export interface UserForm {
    name: string;
    email: string;
    password?: string;
    password_confirmation?: string;
    role: 'kasir' | 'koki';
    phone?: string;
    is_active: boolean;
}

export interface TransactionForm {
    payment_method: 'COD' | 'Midtrans' | 'Dummy';
    customer_name?: string;
    table_number?: string;
    notes?: string;
    items: Array<{
        product_id: number;
        quantity: number;
        notes?: string;
    }>;
    discount_code?: string;
}

export interface DiscountForm {
    name: string;
    code?: string;
    description?: string;
    type: 'percentage' | 'fixed' | 'buy_one_get_one';
    value: number;
    minimum_amount?: number;
    maximum_discount?: number;
    usage_limit?: number;
    is_active: boolean;
    starts_at: string;
    expires_at: string;
    product_ids?: number[];
}

// Cart Types
export interface CartItem {
    product: Product;
    quantity: number;
    notes?: string;
    subtotal: number;
}

export interface Cart {
    items: CartItem[];
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    applied_discount?: Discount;
}

// Filter Types
export interface ProductFilter {
    category_id?: number;
    status?: string;
    is_featured?: boolean;
    search?: string;
    sort_by?: 'name' | 'price' | 'created_at';
    sort_order?: 'asc' | 'desc';
}

export interface TransactionFilter {
    payment_status?: string;
    order_status?: string;
    payment_method?: string;
    cashier_id?: number;
    date_from?: string;
    date_to?: string;
    search?: string;
}

// Dashboard Types
export interface DashboardStats {
    today_sales: number;
    today_orders: number;
    pending_orders: number;
    low_stock_products: number;
    total_revenue: number;
    total_orders: number;
    total_products: number;
    total_customers: number;
}

export interface SalesChart {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        backgroundColor?: string;
        borderColor?: string;
        fill?: boolean;
    }>;
}

// Inertia Page Props
export interface PageProps {
    auth: {
        user: User;
    };
    flash?: {
        success?: string;
        error?: string;
        warning?: string;
        info?: string;
    };
    errors?: Record<string, string>;
}

// Component Props
export interface TableProps<T = any> {
    data: T[];
    columns: Array<{
        key: string;
        label: string;
        sortable?: boolean;
        render?: (item: T) => React.ReactNode;
    }>;
    loading?: boolean;
    onSort?: (column: string, direction: 'asc' | 'desc') => void;
    onRowClick?: (item: T) => void;
}

export interface ModalProps {
    show: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export interface InputProps {
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
}

export interface SelectProps {
    label?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: Array<{
        value: string | number;
        label: string;
    }>;
    placeholder?: string;
}

// Event Types
export interface OrderStatusUpdateEvent {
    transaction_id: number;
    old_status: string;
    new_status: string;
    updated_by: number;
}

export interface StockUpdateEvent {
    product_id: number;
    old_stock: number;
    new_stock: number;
    reason: string;
}

export interface PaymentReceivedEvent {
    transaction_id: number;
    amount: number;
    payment_method: string;
    received_by: number;
}
