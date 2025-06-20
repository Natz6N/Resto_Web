<?php

namespace App\Http\Controllers;

use App\Events\PaymentStatusChanged;
use App\Events\SystemNotification;
use App\Models\transaction;
use App\Models\activity_log;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use App\Events\CustomerNotification;

class PaymentController extends Controller
{
    /**
     * Initialize payment process (first step)
     * This should NOT mark the transaction as paid yet
     */
    public function process(Request $request, $id)
    {
        $transaction = transaction::with('items.product')->findOrFail($id);

        // Check if transaction is already paid
        if ($transaction->isPaid()) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Transaksi ini sudah dibayar'], 400);
            }
            return redirect()->back()->with('error', 'Transaksi ini sudah dibayar');
        }

        // Validate request
        $validated = $request->validate([
            'payment_method' => 'required|string|in:COD,Midtrans,Dummy',
            'customer_name' => 'nullable|string|max:255',
            'table_number' => 'nullable|string|max:50',
        ]);

        // Update transaction basic data (but don't change payment status yet)
        $transaction->payment_method = $validated['payment_method'];
        if (isset($validated['customer_name'])) {
            $transaction->customer_name = $validated['customer_name'];
        }
        if (isset($validated['table_number'])) {
            $transaction->table_number = $validated['table_number'];
        }
        $transaction->save();

        try {
            // Process based on payment method - this should initiate appropriate payment flow
            // without marking transaction as paid yet
            switch ($validated['payment_method']) {
                case 'COD':
                    // For COD, we need to collect the payment amount first
                    return $this->initiateCashPayment($transaction, $request->wantsJson());

                case 'Midtrans':
                    // For Midtrans, generate token and redirect to payment page
                    return $this->initiateMidtransPayment($transaction, $request->wantsJson());

                case 'Dummy':
                    // For Dummy, auto succeed (simulation)
                    return $this->initiateTestPayment($transaction, $request->wantsJson());

                default:
                    throw new \Exception('Metode pembayaran tidak valid');
            }
        } catch (\Exception $e) {
            Log::error('Payment initiation error: ' . $e->getMessage());
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Gagal memulai pembayaran: ' . $e->getMessage()], 500);
            }
            return redirect()->back()->with('error', 'Gagal memulai pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Initiate cash payment - show payment form to enter amount
     */
    private function initiateCashPayment(transaction $transaction, bool $isJson = false)
    {
        if ($isJson) {
            return response()->json([
                'success' => true,
                'requires_input' => true,
                'payment_method' => 'COD',
                'transaction' => $transaction,
                'next_action' => 'collect_payment_amount'
            ]);
        }

        // Redirect to the cash payment form
        return redirect()->route('payment.cash.form', ['id' => $transaction->id]);
    }

    /**
     * Show the cash payment form for entering the payment amount
     */
    public function showCashPaymentForm($id)
    {
        $transaction = transaction::findOrFail($id);

        // Validate that this transaction is pending payment and uses COD method
        if ($transaction->payment_status !== 'belum_dibayar' && $transaction->payment_status !== 'pending') {
            return redirect()->route('payment.confirmation', ['id' => $transaction->id])
                ->with('error', 'Transaksi ini sudah diproses pembayarannya');
        }

        if ($transaction->payment_method !== 'COD') {
            return redirect()->back()->with('error', 'Metode pembayaran bukan tunai');
        }

        return Inertia::render('Payment/CashPayment', [
            'transaction' => [
                'id' => $transaction->id,
                'transaction_code' => $transaction->transaction_code,
                'total_amount' => $transaction->total_amount,
                'customer_name' => $transaction->customer_name,
                'table_number' => $transaction->table_number,
            ]
        ]);
    }

    /**
     * Process cash payment after amount is entered
     */
    public function processCashPayment(Request $request, $id)
    {
        $transaction = transaction::findOrFail($id);

        // Validate the payment amount
        $validated = $request->validate([
            'amount' => 'required|numeric|min:' . $transaction->total_amount
        ]);

        $amount = $validated['amount'];

        try {
            // Calculate change
            $change = $amount - $transaction->total_amount;

            // Save cashier ID if authenticated
            if (Auth::check()) {
                $transaction->cashier_id = Auth::id();
            }

            // Update transaction status
            $transaction->payment_status = 'dibayar';
            $transaction->paid_amount = $amount;
            $transaction->change_amount = $change;
            $transaction->paid_at = now();
            $transaction->save();

            // Log activity
            activity_log::create([
                'log_name' => 'payments',
                'description' => "Pembayaran cash untuk transaksi {$transaction->transaction_code} sebesar Rp " . number_format($transaction->total_amount, 0, ',', '.'),
                'causer_type' => Auth::user() ? get_class(Auth::user()) : null,
                'causer_id' => Auth::id(),
                'subject_type' => get_class($transaction),
                'subject_id' => $transaction->id,
                'properties' => [
                    'payment_method' => 'cash',
                    'amount' => $amount,
                    'change' => $change,
                    'cashier_id' => $transaction->cashier_id
                ]
            ]);

            // Broadcast events
            event(new PaymentStatusChanged($transaction, 'dibayar'));
            event(new SystemNotification(
                'payment_success',
                "Pembayaran cash untuk transaksi {$transaction->transaction_code} berhasil",
                ['transaction_id' => $transaction->id],
                ['admin', 'kasir']
            ));

            // Send customer notification about successful payment
            event(new CustomerNotification(
                'success',
                "Pembayaran tunai untuk pesanan #{$transaction->transaction_code} berhasil",
                $transaction,
                [
                    'payment_method' => 'cash',
                    'paid_amount' => $amount,
                    'change_amount' => $change
                ]
            ));

            // Also broadcast to kitchen when payment is successful
            event(new SystemNotification(
                'success',
                "Ada pesanan baru yang sudah dibayar: #{$transaction->transaction_code}",
                [
                    'transaction_id' => $transaction->id,
                    'customer_name' => $transaction->customer_name,
                    'table_number' => $transaction->table_number,
                    'total_amount' => $transaction->total_amount
                ],
                ['koki']
            ));

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Pembayaran berhasil',
                    'transaction' => $transaction,
                    'change' => $change
                ]);
            }

            // Redirect to receipt/confirmation page
            return redirect()->route('payment.confirmation', ['id' => $transaction->id])
                ->with('success', 'Pembayaran berhasil. Kembalian: ' . number_format($change, 0, ',', '.'));

        } catch (\Exception $e) {
            Log::error('Cash payment error: ' . $e->getMessage());
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Gagal memproses pembayaran: ' . $e->getMessage()], 500);
            }
            return redirect()->back()->with('error', 'Gagal memproses pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Initiate Midtrans payment - generate token and redirect
     */
    private function initiateMidtransPayment(transaction $transaction, bool $isJson = false)
    {
        try {
            // Generate a unique token for this transaction
            $token = Str::random(32);
            $transaction->payment_token = $token;
            $transaction->payment_status = 'belum_dibayar'; // Ensure status is still pending

            // In a real implementation, this would call the Midtrans API
            // For now, we'll just simulate generating a payment URL
            $paymentUrl = url("/payment/simulate/{$token}");
            $transaction->payment_url = $paymentUrl;
            $transaction->save();

            // Log the payment initiation
            activity_log::create([
                'log_name' => 'payments',
                'description' => "Pembayaran Midtrans dimulai untuk transaksi {$transaction->transaction_code}",
                'causer_type' => Auth::user() ? get_class(Auth::user()) : null,
                'causer_id' => Auth::id(),
                'subject_type' => get_class($transaction),
                'subject_id' => $transaction->id,
                'properties' => [
                    'payment_url' => $paymentUrl,
                    'token' => $token
                ]
            ]);

            // Return response
            if ($isJson) {
                return response()->json([
                    'success' => true,
                    'payment_url' => $paymentUrl,
                    'token' => $token,
                    'transaction_id' => $transaction->id
                ]);
            }

            // Redirect to Midtrans payment page
            return redirect($paymentUrl);
        } catch (\Exception $e) {
            Log::error('Midtrans payment initiation error: ' . $e->getMessage());
            if ($isJson) {
                return response()->json(['error' => 'Gagal memulai pembayaran Midtrans: ' . $e->getMessage()], 500);
            }
            return redirect()->back()->with('error', 'Gagal memulai pembayaran Midtrans: ' . $e->getMessage());
        }
    }

    /**
     * Initiate test payment (Dummy) - auto success
     */
    private function initiateTestPayment(transaction $transaction, bool $isJson = false)
    {
        try {
            // Save cashier ID if authenticated
            if (Auth::check()) {
                $transaction->cashier_id = Auth::id();
            }

            // Auto mark as paid (this is a dummy/test payment that always succeeds)
            $transaction->payment_status = 'dibayar';
            $transaction->paid_amount = $transaction->total_amount;
            $transaction->change_amount = 0;
            $transaction->paid_at = now();
            $transaction->save();

            // Log activity
            activity_log::create([
                'log_name' => 'payments',
                'description' => "Test pembayaran otomatis berhasil untuk transaksi {$transaction->transaction_code}",
                'causer_type' => Auth::user() ? get_class(Auth::user()) : null,
                'causer_id' => Auth::id(),
                'subject_type' => get_class($transaction),
                'subject_id' => $transaction->id,
                'properties' => [
                    'payment_method' => 'dummy',
                    'amount' => $transaction->total_amount,
                    'cashier_id' => $transaction->cashier_id
                ]
            ]);

            // Broadcast events
            event(new PaymentStatusChanged($transaction, 'dibayar'));
            event(new SystemNotification(
                'payment_success',
                "Test pembayaran untuk transaksi {$transaction->transaction_code} berhasil",
                ['transaction_id' => $transaction->id],
                ['all']
            ));

            // Send customer notification
            event(new CustomerNotification(
                'success',
                "Pembayaran dummy untuk pesanan #{$transaction->transaction_code} berhasil",
                $transaction
            ));

            // Notify kitchen staff
            event(new SystemNotification(
                'success',
                "Ada pesanan baru yang sudah dibayar: #{$transaction->transaction_code}",
                [
                    'transaction_id' => $transaction->id,
                    'customer_name' => $transaction->customer_name,
                    'table_number' => $transaction->table_number,
                    'total_amount' => $transaction->total_amount
                ],
                ['koki']
            ));

            if ($isJson) {
                return response()->json([
                    'success' => true,
                    'message' => 'Test pembayaran berhasil',
                    'transaction' => $transaction
                ]);
            }

            // Redirect to receipt/confirmation page
            return redirect()->route('payment.confirmation', ['id' => $transaction->id])
                ->with('success', 'Test pembayaran berhasil secara otomatis');
        } catch (\Exception $e) {
            Log::error('Test payment error: ' . $e->getMessage());
            if ($isJson) {
                return response()->json(['error' => 'Gagal memproses pembayaran test: ' . $e->getMessage()], 500);
            }
            return redirect()->back()->with('error', 'Gagal memproses pembayaran test: ' . $e->getMessage());
        }
    }

    /**
     * Display payment confirmation page (receipt)
     */
    public function confirmation($id)
    {
        $transaction = transaction::with(['items', 'cashier'])->findOrFail($id);

        return Inertia::render('Payment/Confirmation', [
            'transaction' => [
                'id' => $transaction->id,
                'transaction_code' => $transaction->transaction_code,
                'payment_status' => $transaction->payment_status,
                'order_status' => $transaction->order_status,
                'payment_method' => $transaction->payment_method,
                'total_amount' => $transaction->total_amount,
                'paid_amount' => $transaction->paid_amount,
                'change_amount' => $transaction->change_amount,
                'customer_name' => $transaction->customer_name,
                'table_number' => $transaction->table_number,
                'cashier' => $transaction->cashier ? [
                    'id' => $transaction->cashier->id,
                    'name' => $transaction->cashier->name
                ] : null,
                'items' => $transaction->items->map(function($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product_name,
                        'quantity' => $item->quantity,
                        'price' => $item->unit_price,
                        'subtotal' => $item->total_price
                    ];
                }),
                'created_at' => $transaction->created_at,
                'paid_at' => $transaction->paid_at
            ]
        ]);
    }

    /**
     * Display payment simulation page (for Midtrans)
     */
    public function simulatePayment($token)
    {
        $transaction = transaction::where('payment_token', $token)->firstOrFail();

        return Inertia::render('Payment/Simulate', [
            'transaction' => [
                'id' => $transaction->id,
                'transaction_code' => $transaction->transaction_code,
                'total_amount' => $transaction->total_amount,
                'customer_name' => $transaction->customer_name,
                'table_number' => $transaction->table_number,
                'payment_method' => $transaction->payment_method
            ],
            'token' => $token
        ]);
    }

    /**
     * Handle payment simulation result (callback from Midtrans)
     */
    public function handleSimulationResult(Request $request, $token)
    {
        $transaction = transaction::where('payment_token', $token)->firstOrFail();

        $status = $request->input('status', 'success');

        if ($status === 'success') {
            // Save cashier ID if authenticated
            if (Auth::check()) {
                $transaction->cashier_id = Auth::id();
            }

            $transaction->payment_status = 'dibayar';
            $transaction->paid_amount = $transaction->total_amount;
            $transaction->paid_at = now();
            $message = "Pembayaran untuk transaksi {$transaction->transaction_code} berhasil";
            $eventType = 'payment_success';

            // Send customer notification
            event(new CustomerNotification(
                'success',
                "Pembayaran online untuk pesanan #{$transaction->transaction_code} berhasil",
                $transaction,
                [
                    'payment_method' => 'midtrans',
                    'amount' => $transaction->total_amount
                ]
            ));

            // Notify kitchen staff
            event(new SystemNotification(
                'success',
                "Ada pesanan baru yang sudah dibayar: #{$transaction->transaction_code}",
                [
                    'transaction_id' => $transaction->id,
                    'customer_name' => $transaction->customer_name,
                    'table_number' => $transaction->table_number,
                    'total_amount' => $transaction->total_amount
                ],
                ['koki']
            ));
        } else {
            $transaction->payment_status = 'batal';
            $message = "Pembayaran untuk transaksi {$transaction->transaction_code} gagal";
            $eventType = 'payment_failed';

            // Send customer notification about failed payment
            event(new CustomerNotification(
                'error',
                "Pembayaran untuk pesanan #{$transaction->transaction_code} gagal",
                $transaction,
                [
                    'payment_method' => 'midtrans',
                    'reason' => 'Pembayaran tidak berhasil diproses'
                ]
            ));
        }

        $transaction->payment_data = [
            'status' => $status,
            'method' => 'simulation',
            'time' => now()->toIso8601String(),
        ];

        $transaction->save();

        // Log activity
        activity_log::create([
            'log_name' => 'payments',
            'description' => $message,
            'causer_type' => Auth::user() ? get_class(Auth::user()) : null,
            'causer_id' => Auth::id(),
            'subject_type' => get_class($transaction),
            'subject_id' => $transaction->id,
            'properties' => [
                'payment_method' => 'midtrans',
                'status' => $status,
                'cashier_id' => $transaction->cashier_id
            ]
        ]);

        // Broadcast events
        event(new PaymentStatusChanged($transaction, $transaction->payment_status));
        event(new SystemNotification(
            $eventType,
            $message,
            ['transaction_id' => $transaction->id],
            ['all']
        ));

        return redirect()->route('payment.confirmation', ['id' => $transaction->id])
            ->with($status === 'success' ? 'success' : 'error', $message);
    }

    /**
     * Admin manually updates payment status
     */
    public function updateStatus(Request $request, $id)
    {
        $transaction = transaction::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:belum_dibayar,dibayar,batal',
            'notes' => 'nullable|string|max:255',
        ]);

        $oldStatus = $transaction->payment_status;
        $transaction->payment_status = $validated['status'];

        if ($validated['status'] === 'dibayar' && !$transaction->paid_at) {
            $transaction->paid_at = now();

            // Set cashier ID if not already set
            if (!$transaction->cashier_id && Auth::check()) {
                $transaction->cashier_id = Auth::id();
            }
        }

        $transaction->save();

        // Log activity
        activity_log::create([
            'log_name' => 'payments',
            'description' => "Status pembayaran transaksi {$transaction->transaction_code} diubah dari {$oldStatus} ke {$validated['status']}" .
                (isset($validated['notes']) ? " - Catatan: {$validated['notes']}" : ""),
            'causer_type' => Auth::user() ? get_class(Auth::user()) : null,
            'causer_id' => Auth::id(),
            'subject_type' => get_class($transaction),
            'subject_id' => $transaction->id,
            'properties' => [
                'old_status' => $oldStatus,
                'new_status' => $validated['status'],
                'notes' => $validated['notes'] ?? null,
                'cashier_id' => $transaction->cashier_id
            ]
        ]);

        // Broadcast event
        event(new PaymentStatusChanged($transaction, $validated['status']));
        event(new SystemNotification(
            'payment_status_changed',
            "Status pembayaran transaksi {$transaction->transaction_code} diubah menjadi {$validated['status']}",
            ['transaction_id' => $transaction->id],
            ['admin', 'kasir']
        ));

        return redirect()->back()->with('success', 'Status pembayaran berhasil diperbarui');
    }
}
