import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, XCircle, CreditCard, Clock } from 'lucide-react';

interface SimulatePageProps {
  transaction: {
    id: number;
    transaction_code: string;
    total_amount: number;
    customer_name?: string;
  };
  token: string;
}

export default function Simulate({ transaction, token }: SimulatePageProps) {
  const [processing, setProcessing] = useState(false);
  const { data, setData, post, processing: formProcessing } = useForm({
    status: 'success',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      post(`/payment/simulate/${token}/result`);
    }, 2000);
  };

  return (
    <>
      <Head title="Payment Simulation" />

      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 p-4 text-white text-center">
            <h1 className="text-2xl font-bold">Payment Simulation</h1>
            <p className="text-blue-100">This is a test payment page</p>
          </div>

          {/* Transaction Details */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold mb-4">Transaction Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{transaction.transaction_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium">{transaction.customer_name || 'Guest'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg">
                  Rp {transaction.total_amount.toLocaleString('id')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Options */}
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Result</h2>
            <p className="text-sm text-gray-600 mb-4">
              Select the payment result for testing purposes:
            </p>

            <div className="space-y-3">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment_status"
                  value="success"
                  checked={data.status === 'success'}
                  onChange={() => setData('status', 'success')}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Successful Payment</div>
                  <div className="text-sm text-gray-500">Simulate a successful payment</div>
                </div>
                <CheckCircle className="h-6 w-6 text-green-500" />
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment_status"
                  value="failed"
                  checked={data.status === 'failed'}
                  onChange={() => setData('status', 'failed')}
                  className="mr-3"
                />
                <div className="flex-1">
                  <div className="font-medium">Failed Payment</div>
                  <div className="text-sm text-gray-500">Simulate a failed payment</div>
                </div>
                <XCircle className="h-6 w-6 text-red-500" />
              </label>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={processing || formProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {processing || formProcessing ? (
                  <span className="flex items-center justify-center">
                    <Clock className="animate-spin h-5 w-5 mr-2" />
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Process Payment
                  </span>
                )}
              </button>
            </div>
          </form>

          {/* Disclaimer */}
          <div className="p-4 bg-gray-50 text-center text-xs text-gray-500">
            This is a simulated payment page for testing purposes only.
            <br />
            No real payment is being processed.
          </div>
        </div>
      </div>
    </>
  );
}
