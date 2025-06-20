import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { formatCurrency } from '@/lib/utils';
import WebLayouts from '@/layouts/web-layouts';
import { DollarSign, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CashPaymentProps {
  transaction: {
    id: number;
    transaction_code: string;
    total_amount: number;
    customer_name?: string;
    table_number?: string;
  };
}

export default function CashPayment({ transaction }: CashPaymentProps) {
  const { data, setData, post, processing, errors } = useForm({
    amount: transaction.total_amount,
  });

  const [showError, setShowError] = useState(false);
  const [insufficientAmount, setInsufficientAmount] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setData('amount', value);

    // Validate amount is sufficient
    if (value < transaction.total_amount) {
      setInsufficientAmount(true);
    } else {
      setInsufficientAmount(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (data.amount < transaction.total_amount) {
      setShowError(true);
      return;
    }

    post(route('payment.cash', { id: transaction.id }));
  };

  // Calculate change amount (if payment amount exceeds total)
  const changeAmount = Math.max(0, data.amount - transaction.total_amount);

  return (
    <WebLayouts className="bg-gray-50 min-h-screen">
      <Head title="Pembayaran Tunai | Resto" />

      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={16} />
            Kembali
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Pembayaran Tunai</h1>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h2 className="text-lg font-semibold mb-2">Detail Transaksi</h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-600">Kode Transaksi:</div>
              <div className="font-medium">{transaction.transaction_code}</div>

              {transaction.customer_name && (
                <>
                  <div className="text-gray-600">Nama Pelanggan:</div>
                  <div className="font-medium">{transaction.customer_name}</div>
                </>
              )}

              {transaction.table_number && (
                <>
                  <div className="text-gray-600">Nomor Meja:</div>
                  <div className="font-medium">{transaction.table_number}</div>
                </>
              )}

              <div className="text-gray-600">Total Pembayaran:</div>
              <div className="font-bold text-blue-700">{formatCurrency(transaction.total_amount)}</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jumlah Pembayaran Tunai
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={data.amount}
                  onChange={handleAmountChange}
                  className={`pl-10 pr-4 py-3 w-full border ${
                    insufficientAmount ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium`}
                  placeholder="Masukkan jumlah"
                  min={transaction.total_amount}
                  step="1000"
                />
              </div>

              {insufficientAmount && (
                <p className="mt-2 text-sm text-red-600 flex items-start">
                  <AlertCircle size={16} className="mr-1 mt-0.5 flex-shrink-0" />
                  Jumlah pembayaran kurang dari total transaksi
                </p>
              )}

              {showError && (
                <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
                  Jumlah pembayaran harus minimal {formatCurrency(transaction.total_amount)}
                </div>
              )}
            </div>

            {/* Change amount calculation */}
            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Kembalian:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(changeAmount)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg bg-blue-600 hover:bg-blue-700"
              disabled={processing || insufficientAmount}
            >
              {processing ? 'Memproses...' : 'Proses Pembayaran'}
            </Button>
          </form>
        </div>
      </div>
    </WebLayouts>
  );
}