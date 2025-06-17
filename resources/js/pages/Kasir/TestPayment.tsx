import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { CreditCard, DollarSign, Wallet, AlertCircle } from 'lucide-react';

interface Transaction {
    id: number;
    transaction_code: string;
    total_amount: string | number;
    payment_status: string;
    customer_name?: string;
    payment_method?: string;
}

const TestPaymentPage: React.FC = () => {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<string>('test');
    const [amount, setAmount] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);

    // Load pending transactions
    const fetchPendingTransactions = async () => {
        setLoadingTransactions(true);
        setError('');

        try {
            const response = await axios.get('/api/transactions/pending');
            setTransactions(response.data);
        } catch (err) {
            setError('Failed to load pending transactions');
            console.error(err);
        } finally {
            setLoadingTransactions(false);
        }
    };

    // Process payment
    const handleProcessPayment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedTransaction) {
            setError('Please select a transaction');
            return;
        }

        if (paymentMethod === 'cash' && (!amount || parseFloat(amount) < parseFloat(String(selectedTransaction.total_amount)))) {
            setError('Amount must be equal to or greater than the total');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formData = {
                payment_method: paymentMethod,
                amount: paymentMethod === 'cash' ? amount : selectedTransaction.total_amount,
            };

            await axios.post(`/dashboard/kasir/payment/${selectedTransaction.id}/process`, formData);

            // Reset form
            setSelectedTransaction(null);
            setPaymentMethod('test');
            setAmount('');

            // Fetch updated list
            fetchPendingTransactions();

            // Show success message
            alert('Payment processed successfully!');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Payment processing failed');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Initialize component
    React.useEffect(() => {
        fetchPendingTransactions();
    }, []);

    return (
        <>
            <Head title="Test Payment" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Test Payment Processing</h1>

                {/* Error message */}
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <AlertCircle className="h-5 w-5 text-red-400" />
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Transaction List */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Pending Transactions</h2>

                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={fetchPendingTransactions}
                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                disabled={loadingTransactions}
                            >
                                {loadingTransactions ? 'Loading...' : 'Refresh Transactions'}
                            </button>
                        </div>

                        {loadingTransactions ? (
                            <div className="text-center py-4">Loading transactions...</div>
                        ) : transactions.length === 0 ? (
                            <div className="text-center py-4 text-gray-500">No pending transactions found</div>
                        ) : (
                            <div className="space-y-4">
                                {transactions.map(transaction => (
                                    <div
                                        key={transaction.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                                            selectedTransaction?.id === transaction.id
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                        onClick={() => {
                                            setSelectedTransaction(transaction);
                                            setAmount(String(transaction.total_amount));
                                        }}
                                    >
                                        <div className="flex justify-between">
                                            <div className="font-medium">{transaction.transaction_code}</div>
                                            <div className="text-green-600 font-medium">
                                                Rp {parseFloat(String(transaction.total_amount)).toLocaleString('id')}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500 mt-2">
                                            {transaction.customer_name || 'Guest'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Payment Form */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Process Payment</h2>

                        {!selectedTransaction ? (
                            <div className="text-center py-8 text-gray-500">
                                Select a transaction from the list to process payment
                            </div>
                        ) : (
                            <form onSubmit={handleProcessPayment}>
                                <div className="mb-6">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Transaction</h3>
                                    <div className="bg-gray-50 p-3 rounded-md">
                                        <div className="flex justify-between">
                                            <div className="font-medium">{selectedTransaction.transaction_code}</div>
                                            <div className="text-green-600 font-medium">
                                                Rp {parseFloat(String(selectedTransaction.total_amount)).toLocaleString('id')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div
                                            className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                                paymentMethod === 'test'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                            onClick={() => setPaymentMethod('test')}
                                        >
                                            <Wallet className="h-6 w-6 mx-auto text-blue-500 mb-2" />
                                            <div className="text-sm font-medium">Test Payment</div>
                                        </div>
                                        <div
                                            className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                                paymentMethod === 'cash'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                            onClick={() => setPaymentMethod('cash')}
                                        >
                                            <DollarSign className="h-6 w-6 mx-auto text-green-500 mb-2" />
                                            <div className="text-sm font-medium">Cash</div>
                                        </div>
                                        <div
                                            className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                                                paymentMethod === 'midtrans'
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:bg-gray-50'
                                            }`}
                                            onClick={() => setPaymentMethod('midtrans')}
                                        >
                                            <CreditCard className="h-6 w-6 mx-auto text-purple-500 mb-2" />
                                            <div className="text-sm font-medium">Midtrans</div>
                                        </div>
                                    </div>
                                </div>

                                {paymentMethod === 'cash' && (
                                    <div className="mb-6">
                                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                                            Amount Received
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">Rp</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="amount"
                                                id="amount"
                                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                                                placeholder="0.00"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                min={selectedTransaction.total_amount}
                                            />
                                        </div>
                                        {parseFloat(amount) > parseFloat(String(selectedTransaction.total_amount)) && (
                                            <div className="mt-2 text-sm text-gray-600">
                                                Change: Rp {(parseFloat(amount) - parseFloat(String(selectedTransaction.total_amount))).toLocaleString('id')}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="mt-8">
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        disabled={loading}
                                    >
                                        {loading ? 'Processing...' : 'Process Payment'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default TestPaymentPage;
