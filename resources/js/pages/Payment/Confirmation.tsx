import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { formatCurrency } from '@/lib/utils';
import WebLayouts from '@/layouts/web-layouts';
import { CheckCircle, XCircle, AlertCircle, Printer, Home, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConfirmationProps {
  transaction: {
    id: number;
    transaction_code: string;
    payment_status: string;
    order_status: string;
    payment_method: string;
    total_amount: number;
    paid_amount: number;
    change_amount: number;
    customer_name?: string;
    table_number?: string;
    cashier?: {
      id: number;
      name: string;
    };
    items: Array<{
      id: number;
      product_name: string;
      quantity: number;
      price: number;
      subtotal: number;
    }>;
    created_at: string;
    paid_at?: string;
  };
  success?: boolean;
  error?: string;
}

export default function Confirmation({ transaction, success, error }: ConfirmationProps) {
  const isPaid = transaction.payment_status === 'dibayar';
  const isCancelled = transaction.payment_status === 'batal';

  const getStatusIcon = () => {
    if (isPaid) {
      return <CheckCircle className="h-12 w-12 text-green-500" />;
    } else if (isCancelled) {
      return <XCircle className="h-12 w-12 text-red-500" />;
    } else {
      return <AlertCircle className="h-12 w-12 text-amber-500" />;
    }
  };

  const getStatusText = () => {
    if (isPaid) {
      return 'Pembayaran Berhasil';
    } else if (isCancelled) {
      return 'Pembayaran Dibatalkan';
    } else {
      return 'Menunggu Pembayaran';
    }
  };

  const getStatusDescription = () => {
    if (isPaid) {
      return `Pembayaran telah berhasil diproses pada ${new Date(transaction.paid_at || '').toLocaleString('id-ID')}`;
    } else if (isCancelled) {
      return 'Pembayaran telah dibatalkan';
    } else {
      return 'Transaksi sedang menunggu pembayaran';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <WebLayouts className="bg-gray-50 min-h-screen">
      <Head title={`Receipt #${transaction.transaction_code}`} />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Status Banner */}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Receipt Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden print:shadow-none">
          {/* Header */}
          <div className="bg-gray-800 text-white p-6 print:bg-white print:text-black">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Receipt</h1>
              <div className="text-sm">{transaction.transaction_code}</div>
            </div>
            <div className="mt-2 text-gray-300 print:text-gray-600">
              {formatDate(transaction.created_at)} • {formatTime(transaction.created_at)}
            </div>
          </div>

          {/* Status Section */}
          <div className="p-6 border-b flex items-center">
            <div className="mr-4">
              {getStatusIcon()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{getStatusText()}</h2>
              <p className="text-gray-600">{getStatusDescription()}</p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Detail Transaksi</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Metode Pembayaran</div>
                <div className="font-medium">
                  {transaction.payment_method === 'COD' && 'Cash / Tunai'}
                  {transaction.payment_method === 'Midtrans' && 'Midtrans (Online)'}
                  {transaction.payment_method === 'Dummy' && 'Test Payment'}
                </div>
              </div>

              {transaction.customer_name && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Nama Pelanggan</div>
                  <div className="font-medium">{transaction.customer_name}</div>
                </div>
              )}

              {transaction.table_number && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Nomor Meja</div>
                  <div className="font-medium">{transaction.table_number}</div>
                </div>
              )}

              {transaction.cashier && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Kasir</div>
                  <div className="font-medium">{transaction.cashier.name}</div>
                </div>
              )}

              <div>
                <div className="text-sm text-gray-600 mb-1">Status Pesanan</div>
                <div className="font-medium">
                  {transaction.order_status === 'pending' && 'Menunggu'}
                  {transaction.order_status === 'preparing' && 'Sedang Dimasak'}
                  {transaction.order_status === 'ready' && 'Siap Disajikan'}
                  {transaction.order_status === 'served' && 'Sudah Disajikan'}
                  {transaction.order_status === 'cancelled' && 'Dibatalkan'}
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold mb-4">Items</h3>
            <div className="space-y-4">
              {transaction.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-sm text-gray-600">
                      {item.quantity} x {formatCurrency(item.price)}
                    </div>
                  </div>
                  <div className="font-medium">
                    {formatCurrency(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-6">
            <div className="flex justify-between mb-2">
              <div className="text-gray-600">Total</div>
              <div className="font-semibold">{formatCurrency(transaction.total_amount)}</div>
            </div>

            {isPaid && transaction.payment_method === 'COD' && (
              <>
                <div className="flex justify-between mb-2">
                  <div className="text-gray-600">Pembayaran</div>
                  <div className="font-semibold">{formatCurrency(transaction.paid_amount)}</div>
                </div>

                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <div>Kembalian</div>
                  <div>{formatCurrency(transaction.change_amount)}</div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 text-center print:hidden">
            <div className="mb-6">
              <div className="text-gray-500 text-sm">
                Terima kasih telah melakukan pembelian di Resto App.
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={handlePrint}
              >
                <Printer size={16} />
                Cetak
              </Button>

              <Link href="/">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Home size={16} />
                  Kembali ke Beranda
                </Button>
              </Link>

              <Link href="/Menu">
                <Button
                  className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
                >
                  <RefreshCw size={16} />
                  Pesan Lagi
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </WebLayouts>
  );
}
