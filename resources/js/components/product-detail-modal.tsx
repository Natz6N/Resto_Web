import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Product } from '@/types/Resto';
import { formatCurrency } from '@/lib/utils';
import { Button } from './ui/button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const { addItem } = useCartStore();

  // Reset state when modal closes or product changes
  React.useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);
      setNotes('');
    }
  }, [isOpen, product]);

  if (!product) return null;

  // Parse price with proper conversion
  const parsePrice = (price: any): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Calculate prices
  const originalPrice = parsePrice(product.price);
  const hasDiscount = product.discounts && product.discounts.length > 0;
  const discountValue = hasDiscount && product.discounts ? product.discounts[0]?.value : 0;
  const discountAmount = hasDiscount ? originalPrice * (discountValue / 100) : 0;
  const finalPrice = originalPrice - discountAmount;
  const totalPrice = finalPrice * quantity;

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addItem(product, quantity, notes);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Detail Menu</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={product.image || '/Product/default.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold">{product.name}</h2>

            {/* Category */}
            {product.category && (
              <div className="mt-1 text-sm text-gray-500">
                Kategori: <span className="font-medium">{product.category.name}</span>
              </div>
            )}

            {/* Pricing */}
            <div className="mt-3 space-y-1">
              {/* Current/Final Price */}
              <div className="text-2xl font-bold text-gray-800">
                {formatCurrency(finalPrice)}
              </div>

              {/* Original price with strikethrough if discounted */}
              {hasDiscount && originalPrice > 0 && (
                <div className="text-sm text-gray-500 line-through">
                  {formatCurrency(originalPrice)}
                </div>
              )}

              {/* Discount badge */}
              {hasDiscount && (
                <div className="inline-block bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold">
                  {discountValue}% off
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-4 text-sm text-gray-600">
              {product.description || 'Tidak ada deskripsi.'}
            </div>

            {/* Attributes */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              {product.is_spicy && (
                <div className="flex items-center text-red-500">
                  <span className="mr-1">🌶️</span> Pedas
                </div>
              )}
              {product.is_vegetarian && (
                <div className="flex items-center text-green-500">
                  <span className="mr-1">🥗</span> Vegetarian
                </div>
              )}
              {product.is_vegan && (
                <div className="flex items-center text-green-500">
                  <span className="mr-1">🌱</span> Vegan
                </div>
              )}
              {product.calories && (
                <div className="flex items-center text-gray-500">
                  <span className="mr-1">🔥</span> {product.calories} kal
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Jumlah</label>
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 rounded-full p-0"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <MinusIcon className="h-4 w-4" />
                </Button>
                <span className="mx-3 w-8 text-center font-medium">{quantity}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 rounded-full p-0"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium mb-2">
                Catatan (opsional)
              </label>
              <textarea
                id="notes"
                className="w-full border rounded-md p-2 text-sm"
                placeholder="Contoh: Level pedas, tanpa es, dll."
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* Total and Add to Cart */}
            <div className="mt-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-lg font-bold">{formatCurrency(totalPrice)}</div>
              </div>
              <Button
                className="bg-orange-500 hover:bg-orange-600"
                onClick={handleAddToCart}
              >
                Tambah ke Keranjang
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
