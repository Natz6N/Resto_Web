import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { formatCurrency } from '@/lib/utils';
import { CreditCard, Check, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimulateProps {
  transaction: {
    id: number;
    transaction_code: string;
    total_amount: number;
    customer_name?: string;
    table_number?: string;
    payment_method: string;
  };
  token: string;
}

export default function Simulate({ transaction, token }: SimulateProps) {
  const { post, processing } = useForm();
  const [loading, setLoading] = useState(false);

  const handlePaymentResult = (status: 'success' | 'failed') => {
    setLoading(true);
    post(route('payment.simulate.result', { token, status }));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <Head title="Simulasi Pembayaran Midtrans" />

      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-green-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="mr-2" />
            <span className="font-bold text-lg">Midtrans</span>
          </div>
          <div className="text-sm">Simulator</div>
        </div>

        {/* Transaction Info */}
        <div className="p-6">
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Merchant</div>
            <div className="font-semibold">Resto App</div>
          </div>

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Order ID</div>
            <div className="font-semibold">{transaction.transaction_code}</div>
          </div>

          {transaction.customer_name && (
            <div className="mb-6">
              <div className="text-sm text-gray-500 mb-1">Customer</div>
              <div className="font-semibold">{transaction.customer_name}</div>
            </div>
          )}

          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">Amount</div>
            <div className="text-xl font-bold text-green-700">{formatCurrency(transaction.total_amount)}</div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-center">
            <ShieldCheck className="h-6 w-6 text-blue-700 mr-3" />
            <div className="text-sm">
              This is a payment simulation. In a real integration, you would be redirected to the Midtrans payment page.
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-500 mb-4">Choose payment result:</div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handlePaymentResult('success')}
                disabled={processing || loading}
                className="bg-green-600 hover:bg-green-700 flex items-center justify-center"
              >
                <Check className="mr-2 h-5 w-5" />
                Success
              </Button>

              <Button
                onClick={() => handlePaymentResult('failed')}
                disabled={processing || loading}
                className="bg-red-600 hover:bg-red-700 flex items-center justify-center"
              >
                <X className="mr-2 h-5 w-5" />
                Failed
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="text-xs text-center text-gray-500">
            Powered by Midtrans Simulator
          </div>
        </div>
      </div>
    </div>
  );
}
