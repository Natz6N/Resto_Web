import React, { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { ShoppingCart, X, Plus, Minus, Trash2, CreditCard, DollarSign, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from './button';
import { Product } from '@/types/Resto';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface CartItemProps {
  id: number;
  product: Product;
  quantity: number;
  notes?: string;
  subtotal: number;
}

enum CheckoutStep {
  CART,
  CUSTOMER_INFO,
  PAYMENT
}

interface CustomerInfo {
  name: string;
  tableNumber: string;
}

const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    setIsOpen,
    removeItem,
    updateQuantity,
    updateNotes,
    clearCart,
    subtotal,
    totalTax,
    totalAmount
  } = useCartStore();

  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>(CheckoutStep.CART);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({ name: '', tableNumber: '' });
  const [paymentMethod, setPaymentMethod] = useState<string>('test');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Reset checkout state
  const resetCheckout = () => {
    setCheckoutStep(CheckoutStep.CART);
    setCustomerInfo({ name: '', tableNumber: '' });
    setPaymentMethod('test');
    setError('');
  };

  // Handle checkout completion
  const handleCheckout = async () => {
    if (checkoutStep === CheckoutStep.CART) {
      setCheckoutStep(CheckoutStep.CUSTOMER_INFO);
      return;
    }

    if (checkoutStep === CheckoutStep.CUSTOMER_INFO) {
      // Validate customer info if needed
      setCheckoutStep(CheckoutStep.PAYMENT);
      return;
    }

    // Submit order and process payment
    setLoading(true);
    setError('');

    try {
      // Create a transaction
      const orderData = {
        items: items.map(item => ({
          product_id: item.product.id,
          quantity: item.quantity,
          notes: item.notes || '',
          price: item.product.price,
          subtotal: item.subtotal
        })),
        customer_name: customerInfo.name,
        table_number: customerInfo.tableNumber,
        subtotal: subtotal(),
        tax_amount: totalTax(),
        total_amount: totalAmount(),
        payment_method: paymentMethod
      };

      // Use the correct API URL with the appropriate base path
      const baseUrl = window.location.origin;
      const response = await axios.post(`${baseUrl}/api/transactions`, orderData);

      if (response.data.transaction_id) {
        // Process payment
        await axios.post(`${baseUrl}/dashboard/kasir/payment/${response.data.transaction_id}/process`, {
          payment_method: paymentMethod
        });

        // Clear cart and reset checkout
        clearCart();
        resetCheckout();
        setIsOpen(false);

        // Navigate to order confirmation page
        router.visit(`/payment/confirmation/${response.data.transaction_id}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.response?.data?.message || 'An error occurred during checkout. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Render different steps of checkout
  const renderCheckoutContent = () => {
    switch (checkoutStep) {
      case CheckoutStep.CUSTOMER_INFO:
        return (
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-4">Informasi Pelanggan</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Pelanggan
                </label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nama Pelanggan (opsional)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Meja
                </label>
                <input
                  type="text"
                  value={customerInfo.tableNumber}
                  onChange={(e) => setCustomerInfo({...customerInfo, tableNumber: e.target.value})}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nomor Meja (opsional)"
                />
              </div>
            </div>
          </div>
        );

      case CheckoutStep.PAYMENT:
        return (
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-4">Metode Pembayaran</h3>

            <div className="space-y-4">
              <div
                className={`p-3 border rounded flex items-center ${paymentMethod === 'test' ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => setPaymentMethod('test')}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <ShoppingCart size={18} className="text-blue-600" />
                </div>
                <div>
                  <div className="font-medium">Test Payment</div>
                  <div className="text-xs text-gray-500">Simulasi pembayaran otomatis</div>
                </div>
                <div className="ml-auto">
                  <input
                    type="radio"
                    checked={paymentMethod === 'test'}
                    onChange={() => setPaymentMethod('test')}
                  />
                </div>
              </div>

              <div
                className={`p-3 border rounded flex items-center ${paymentMethod === 'cash' ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <DollarSign size={18} className="text-green-600" />
                </div>
                <div>
                  <div className="font-medium">Cash</div>
                  <div className="text-xs text-gray-500">Bayar di tempat</div>
                </div>
                <div className="ml-auto">
                  <input
                    type="radio"
                    checked={paymentMethod === 'cash'}
                    onChange={() => setPaymentMethod('cash')}
                  />
                </div>
              </div>

              <div
                className={`p-3 border rounded flex items-center ${paymentMethod === 'midtrans' ? 'border-blue-500 bg-blue-50' : ''}`}
                onClick={() => setPaymentMethod('midtrans')}
              >
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <CreditCard size={18} className="text-purple-600" />
                </div>
                <div>
                  <div className="font-medium">Midtrans</div>
                  <div className="text-xs text-gray-500">Pembayaran online (simulasi)</div>
                </div>
                <div className="ml-auto">
                  <input
                    type="radio"
                    checked={paymentMethod === 'midtrans'}
                    onChange={() => setPaymentMethod('midtrans')}
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start">
                <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <ShoppingCart size={64} className="mb-4 opacity-20" />
                <p className="text-lg font-medium">Keranjang Anda kosong</p>
                <p className="text-sm text-center mt-2">
                  Tambahkan beberapa menu lezat ke keranjang Anda
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    id={item.product.id}
                    product={item.product}
                    quantity={item.quantity}
                    notes={item.notes}
                    subtotal={item.subtotal}
                  />
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  // Determine header title based on checkout step
  const getHeaderTitle = () => {
    switch (checkoutStep) {
      case CheckoutStep.CUSTOMER_INFO:
        return 'Informasi Pelanggan';
      case CheckoutStep.PAYMENT:
        return 'Pembayaran';
      default:
        return 'Keranjang';
    }
  };

  // Determine button text based on checkout step
  const getButtonText = () => {
    switch (checkoutStep) {
      case CheckoutStep.CUSTOMER_INFO:
        return 'Lanjut ke Pembayaran';
      case CheckoutStep.PAYMENT:
        return loading ? 'Memproses...' : 'Bayar Sekarang';
      default:
        return 'Checkout';
    }
  };

  return (
    <>
      {/* Cart Trigger Button - Mobile Only */}
      <div className="fixed bottom-4 right-4 md:hidden z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 text-white p-3 rounded-full shadow-lg flex items-center justify-center relative"
        >
          <ShoppingCart size={24} />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {items.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          if (checkoutStep !== CheckoutStep.CART) {
            resetCheckout();
          } else {
            setIsOpen(false);
          }
        }}
      />

      <div
        className={`fixed top-0 right-0 h-full bg-white w-full sm:w-96 z-50 shadow-xl transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        {/* Cart Header */}
        <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-lg font-semibold flex items-center">
            {checkoutStep === CheckoutStep.CART && <ShoppingCart className="mr-2" size={20} />}
            {getHeaderTitle()}
            {checkoutStep === CheckoutStep.CART && items.length > 0 && (
              <span className="ml-2 text-sm bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                {items.reduce((acc, item) => acc + item.quantity, 0)} item
              </span>
            )}
          </h2>
          <button
            onClick={() => {
              if (checkoutStep !== CheckoutStep.CART) {
                resetCheckout();
              } else {
                setIsOpen(false);
              }
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart/Checkout Content */}
        {renderCheckoutContent()}

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 bg-white sticky bottom-0">
            {/* Cart Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">PPN (11%)</span>
                <span className="font-medium">{formatCurrency(totalTax())}</span>
              </div>
              <div className="flex justify-between font-semibold text-base pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(totalAmount())}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  if (checkoutStep !== CheckoutStep.CART) {
                    resetCheckout();
                  } else {
                    clearCart();
                  }
                }}
              >
                {checkoutStep !== CheckoutStep.CART ? 'Kembali' : 'Kosongkan'}
              </Button>
              <Button
                className="w-full bg-orange-500 hover:bg-orange-600"
                disabled={loading || items.length === 0}
                onClick={handleCheckout}
              >
                {getButtonText()}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const CartItem: React.FC<CartItemProps> = ({ id, product, quantity, notes, subtotal }) => {
  const { removeItem, updateQuantity, updateNotes } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    } else {
      removeItem(id);
    }
  };

  // Calculate the unit price (with discount if applicable)
  const getUnitPrice = () => {
    const price = typeof product.price === 'number' ? product.price :
                 typeof product.price === 'string' ? parseFloat(product.price) : 0;

    const hasDiscount = product.discounts && product.discounts.length > 0;
    const discountValue = hasDiscount && product.discounts ? product.discounts[0]?.value : 0;

    return hasDiscount ? price * (1 - discountValue / 100) : price;
  };

  return (
    <div className="flex border rounded-lg overflow-hidden bg-white">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0">
        <img
          src={product.image || '/Product/default.jpg'}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col p-2">
        <div className="flex justify-between">
          <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
          <button
            onClick={() => removeItem(id)}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="text-xs text-gray-500 mb-1">
          {formatCurrency(getUnitPrice())}
        </div>

        {/* Notes */}
        <input
          type="text"
          placeholder="Catatan (opsional)"
          value={notes || ''}
          onChange={(e) => updateNotes(id, e.target.value)}
          className="text-xs border rounded px-2 py-1 mb-1"
        />

        {/* Quantity and Subtotal */}
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center space-x-1">
            <button
              onClick={handleDecrement}
              className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full"
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-medium w-6 text-center">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="text-sm font-semibold">
            {formatCurrency(subtotal)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
