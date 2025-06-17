import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, ShoppingBag, ArrowLeft, Home } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ConfirmationPageProps {
  transaction: {
    id: number;
    transaction_code: string;
    payment_status: string;
    order_status: string;
    payment_method: string;
    total_amount: number;
    customer_name?: string;
    table_number?: string;
    items: {
      id: number;
      product_name: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[];
    created_at: string;
  };
}

export default function Confirmation({ transaction }: ConfirmationPageProps) {
  const isSuccess = transaction.payment_status === 'success';
  const paymentDate = new Date(transaction.created_at);

  return (
    <>
      <Head title={isSuccess ? 'Payment Success' : 'Payment Failed'} />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="max-w-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className={`p-6 text-white text-center ${isSuccess ? 'bg-green-600' : 'bg-red-600'}`}>
            <div className="mb-4 flex justify-center">
              {isSuccess ? (
                <CheckCircle className="h-16 w-16" />
              ) : (
                <XCircle className="h-16 w-16" />
              )}
            </div>
            <h1 className="text-2xl font-bold">
              {isSuccess ? 'Payment Successful' : 'Payment Failed'}
            </h1>
            <p className={isSuccess ? 'text-green-100' : 'text-red-100'}>
              {isSuccess
                ? 'Your order has been successfully processed.'
                : 'There was an issue processing your payment.'}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Order Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{transaction.transaction_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">
                  {paymentDate.toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium capitalize">{transaction.payment_method}</span>
              </div>
              {transaction.customer_name && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-medium">{transaction.customer_name}</span>
                </div>
              )}
              {transaction.table_number && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Table Number:</span>
                  <span className="font-medium">{transaction.table_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
                  {isSuccess ? 'Paid' : 'Failed'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 border-b">
            <h3 className="text-md font-medium mb-3">Items</h3>
            <div className="divide-y">
              {transaction.items.map((item) => (
                <div key={item.id} className="py-2 flex justify-between">
                  <div>
                    <span className="font-medium">{item.product_name}</span>
                    <div className="text-sm text-gray-500">
                      {item.quantity} x {formatCurrency(item.price)}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t flex justify-between font-bold">
              <span>Total</span>
              <span>{formatCurrency(transaction.total_amount)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 flex flex-wrap gap-4">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            <Link
              href="/Menu"
              className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
