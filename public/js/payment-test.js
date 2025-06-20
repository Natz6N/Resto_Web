/**
 * Test script for payment processing
 *
 * This file provides utility functions to test payment processing via browser console
 */

const testPayment = {
    // Test Dummy payment method
    testDummyPayment: async function(transactionId) {
        console.log(`Testing Dummy payment for transaction ${transactionId}`);
        const paymentData = {
            payment_method: 'Dummy',
            customer_name: 'Test Customer',
            table_number: 'Test Table'
        };

        try {
            const response = await fetch(`/api/payment/${transactionId}/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();
            console.log('Dummy payment result:', data);
            return data;
        } catch (error) {
            console.error('Dummy payment error:', error);
            throw error;
        }
    },

    // Test Cash/COD payment method
    testCashPayment: async function(transactionId, amount) {
        console.log(`Testing Cash payment for transaction ${transactionId}`);
        const paymentData = {
            payment_method: 'COD',
            amount: amount || 0,
            customer_name: 'Test Customer',
            table_number: 'Test Table'
        };

        try {
            const response = await fetch(`/api/payment/${transactionId}/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();
            console.log('Cash payment result:', data);
            return data;
        } catch (error) {
            console.error('Cash payment error:', error);
            throw error;
        }
    },

    // Test Midtrans payment method
    testMidtransPayment: async function(transactionId) {
        console.log(`Testing Midtrans payment for transaction ${transactionId}`);
        const paymentData = {
            payment_method: 'Midtrans',
            customer_name: 'Test Customer',
            table_number: 'Test Table'
        };

        try {
            const response = await fetch(`/api/payment/${transactionId}/process`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
                },
                body: JSON.stringify(paymentData)
            });

            const data = await response.json();
            console.log('Midtrans payment result:', data);
            return data;
        } catch (error) {
            console.error('Midtrans payment error:', error);
            throw error;
        }
    }
};

// Make it available in the global scope for browser console testing
window.testPayment = testPayment;
