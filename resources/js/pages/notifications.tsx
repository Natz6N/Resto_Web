import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { useNotifications, NotificationType } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
    const { notifications, loading, fetchNotifications, markAsRead, sendTestNotification } = useNotifications();

    const [testData, setTestData] = useState({
        type: 'info' as NotificationType,
        message: '',
        for: ['all']
    });

    const [transactionTest, setTransactionTest] = useState({
        transaction_id: '',
        type: 'payment',
        status: 'dibayar',
        message: ''
    });

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Handle system notification test
    const handleTestNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await sendTestNotification(
                testData.type,
                testData.message,
                testData.for
            );
            toast.success('Test notification sent');
        } catch (error) {
            console.error('Error sending test notification:', error);
            toast.error('Failed to send test notification');
        }
    };

    // Handle transaction notification test
    const handleTestTransactionNotification = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post(route('dashboard.notifications.test-transaction'), transactionTest);
            toast.success('Transaction notification sent');
        } catch (error) {
            console.error('Error sending transaction notification:', error);
            toast.error('Failed to send transaction notification');
        }
    };

    return (
        <AppLayout>
            <Head title="Notifications" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <h1 className="text-2xl font-semibold">Notifications</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Test System Notification */}
                        <Card className="p-6">
                            <h2 className="text-lg font-medium mb-4">Test System Notification</h2>
                            <form onSubmit={handleTestNotification} className="space-y-4">
                                <div>
                                    <label htmlFor="notif-type" className="block text-sm font-medium">Type</label>
                                    <select
                                        id="notif-type"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={testData.type}
                                        onChange={(e) => setTestData({ ...testData, type: e.target.value as NotificationType })}
                                    >
                                        <option value="info">Info</option>
                                        <option value="success">Success</option>
                                        <option value="warning">Warning</option>
                                        <option value="error">Error</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium">Message</label>
                                    <Input
                                        id="message"
                                        value={testData.message}
                                        onChange={(e) => setTestData({ ...testData, message: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">For Roles</label>
                                    <div className="space-y-2">
                                        {['all', 'admin', 'kasir', 'koki'].map((role) => (
                                            <label key={role} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={testData.for.includes(role)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setTestData({ ...testData, for: [...testData.for, role] });
                                                        } else {
                                                            setTestData({
                                                                ...testData,
                                                                for: testData.for.filter(r => r !== role)
                                                            });
                                                        }
                                                    }}
                                                    className="mr-2"
                                                />
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit">Send Test Notification</Button>
                            </form>
                        </Card>

                        {/* Test Transaction Notification */}
                        <Card className="p-6">
                            <h2 className="text-lg font-medium mb-4">Test Transaction Notification</h2>
                            <form onSubmit={handleTestTransactionNotification} className="space-y-4">
                                <div>
                                    <label htmlFor="transaction_id" className="block text-sm font-medium">Transaction ID</label>
                                    <Input
                                        id="transaction_id"
                                        value={transactionTest.transaction_id}
                                        onChange={(e) => setTransactionTest({ ...transactionTest, transaction_id: e.target.value })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="notif_type" className="block text-sm font-medium">Notification Type</label>
                                    <select
                                        id="notif_type"
                                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        value={transactionTest.type}
                                        onChange={(e) => setTransactionTest({ ...transactionTest, type: e.target.value })}
                                    >
                                        <option value="payment">Payment Status</option>
                                        <option value="order">Order Status</option>
                                        <option value="customer">Customer Notification</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="status" className="block text-sm font-medium">Status</label>
                                    <Input
                                        id="status"
                                        value={transactionTest.status}
                                        onChange={(e) => setTransactionTest({ ...transactionTest, status: e.target.value })}
                                        required
                                        placeholder="e.g., dibayar, batal, diproses, etc."
                                    />
                                </div>

                                <div>
                                    <label htmlFor="transaction_message" className="block text-sm font-medium">Message</label>
                                    <Input
                                        id="transaction_message"
                                        value={transactionTest.message}
                                        onChange={(e) => setTransactionTest({ ...transactionTest, message: e.target.value })}
                                        required
                                    />
                                </div>

                                <Button type="submit">Send Transaction Notification</Button>
                            </form>
                        </Card>
                    </div>

                    {/* Notification History */}
                    <Card className="p-6 mt-6">
                        <h2 className="text-lg font-medium mb-4">Notification History</h2>

                        {loading ? (
                            <p>Loading notifications...</p>
                        ) : notifications.length === 0 ? (
                            <p>No notifications to display</p>
                        ) : (
                            <div className="space-y-4">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 border rounded-md ${
                                            notification.read
                                                ? 'bg-white'
                                                : 'bg-blue-50'
                                        }`}
                                        onClick={() => {
                                            if (!notification.read) {
                                                markAsRead([notification.id]);
                                            }
                                        }}
                                    >
                                        <div className="flex justify-between">
                                            <span className={`text-sm font-medium ${
                                                notification.type === 'success' ? 'text-green-600' :
                                                notification.type === 'error' ? 'text-red-600' :
                                                notification.type === 'warning' ? 'text-amber-600' :
                                                'text-blue-600'
                                            }`}>
                                                {notification.type.toUpperCase()}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(notification.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="mt-1">{notification.message}</p>

                                        {notification.data && (
                                            <div className="mt-2 text-xs text-gray-600">
                                                <pre className="whitespace-pre-wrap">
                                                    {JSON.stringify(notification.data, null, 2)}
                                                </pre>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default NotificationsPage;
