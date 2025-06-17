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

class PaymentController extends Controller
{
    /**
     * Process a new payment
     */
    public function process(Request $request, $id)
    {
        $transaction = transaction::with('items.product')->findOrFail($id);

        // Check if transaction is already paid
        if ($transaction->isPaid()) {
            return redirect()->back()->with('error', 'Transaksi ini sudah dibayar');
        }

        // Validate request
        $validated = $request->validate([
            'payment_method' => 'required|string|in:cash,midtrans,test',
            'amount' => 'required_if:payment_method,cash|numeric',
            'customer_name' => 'nullable|string|max:255',
            'table_number' => 'nullable|string|max:50',
        ]);

        // Update transaction data
        $transaction->payment_method = $validated['payment_method'];
        if (isset($validated['customer_name'])) {
            $transaction->customer_name = $validated['customer_name'];
        }
        if (isset($validated['table_number'])) {
            $transaction->table_number = $validated['table_number'];
        }

        try {
            // Process based on payment method
            switch ($validated['payment_method']) {
                case 'cash':
                    return $this->processCashPayment($transaction, $validated['amount']);

                case 'midtrans':
                    return $this->processMidtransPayment($transaction);

                case 'test':
                    return $this->processTestPayment($transaction);

                default:
                    throw new \Exception('Metode pembayaran tidak valid');
            }
        } catch (\Exception $e) {
            Log::error('Payment processing error: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memproses pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Process cash payment
     */
    private function processCashPayment(transaction $transaction, float $amount)
    {
        // Check if amount is sufficient
        if ($amount < $transaction->total_amount) {
            return redirect()->back()->with('error', 'Jumlah pembayaran kurang dari total transaksi');
        }

        // Calculate change
        $change = $amount - $transaction->total_amount;

        // Update transaction
        $transaction->payment_status = transaction::PAYMENT_SUCCESS;
        $transaction->paid_amount = $amount;
        $transaction->change_amount = $change;
        $transaction->paid_at = now();
        $transaction->save();

        // Log activity
        activity_log::create([
            'user_id' => Auth::id(),
            'action' => 'Pembayaran Cash',
            'description' => "Pembayaran cash untuk transaksi {$transaction->transaction_code} sebesar Rp " . number_format($transaction->total_amount, 0, ',', '.'),
        ]);

        // Broadcast event
        event(new PaymentStatusChanged($transaction, transaction::PAYMENT_SUCCESS));
        event(new SystemNotification(
            'payment_success',
            "Pembayaran cash untuk transaksi {$transaction->transaction_code} berhasil",
            ['transaction_id' => $transaction->id],
            ['admin', 'kasir']
        ));

        return redirect()->route('kasir.transactions')->with('success', 'Pembayaran berhasil');
    }

    /**
     * Process Midtrans payment (placeholder for future implementation)
     */
    private function processMidtransPayment(transaction $transaction)
    {
        // Generate a unique token for this transaction
        $token = Str::random(32);
        $transaction->payment_token = $token;

        // In a real implementation, this would call the Midtrans API
        // For now, we'll just simulate generating a payment URL
        $paymentUrl = url("/payment/simulate/{$token}");
        $transaction->payment_url = $paymentUrl;
        $transaction->save();

        // Broadcast event for pending payment
        event(new PaymentStatusChanged($transaction, transaction::PAYMENT_PENDING));

        // Redirect to payment page
        return redirect($paymentUrl);
    }

    /**
     * Process test payment (auto success for testing)
     */
    private function processTestPayment(transaction $transaction)
    {
        // Auto mark as paid
        $transaction->payment_status = transaction::PAYMENT_SUCCESS;
        $transaction->paid_amount = $transaction->total_amount;
        $transaction->change_amount = 0;
        $transaction->paid_at = now();
        $transaction->save();

        // Log activity
        activity_log::create([
            'user_id' => Auth::id(),
            'action' => 'Pembayaran Test',
            'description' => "Test pembayaran untuk transaksi {$transaction->transaction_code} sebesar Rp " . number_format($transaction->total_amount, 0, ',', '.'),
        ]);

        // Broadcast events
        event(new PaymentStatusChanged($transaction, transaction::PAYMENT_SUCCESS));
        event(new SystemNotification(
            'payment_success',
            "Test pembayaran untuk transaksi {$transaction->transaction_code} berhasil",
            ['transaction_id' => $transaction->id],
            ['all']
        ));

        return redirect()->route('kasir.transactions')->with('success', 'Test pembayaran berhasil');
    }

    /**
     * Display payment simulation page
     */
    public function simulatePayment($token)
    {
        $transaction = transaction::where('payment_token', $token)->firstOrFail();

        return Inertia::render('Payment/Simulate', [
            'transaction' => $transaction,
            'token' => $token
        ]);
    }

    /**
     * Handle payment simulation result
     */
    public function handleSimulationResult(Request $request, $token)
    {
        $transaction = transaction::where('payment_token', $token)->firstOrFail();

        $status = $request->input('status', 'success');

        if ($status === 'success') {
            $transaction->payment_status = transaction::PAYMENT_SUCCESS;
            $transaction->paid_amount = $transaction->total_amount;
            $transaction->paid_at = now();
            $message = "Pembayaran untuk transaksi {$transaction->transaction_code} berhasil";
            $eventType = 'payment_success';
        } else {
            $transaction->payment_status = transaction::PAYMENT_FAILED;
            $message = "Pembayaran untuk transaksi {$transaction->transaction_code} gagal";
            $eventType = 'payment_failed';
        }

        $transaction->payment_data = [
            'status' => $status,
            'method' => 'simulation',
            'time' => now()->toIso8601String(),
        ];

        $transaction->save();

        // Log activity
        activity_log::create([
            'user_id' => Auth::id() ?? 1,
            'action' => "Simulasi Pembayaran {$status}",
            'description' => $message,
        ]);

        // Broadcast events
        event(new PaymentStatusChanged($transaction, $transaction->payment_status));
        event(new SystemNotification(
            $eventType,
            $message,
            ['transaction_id' => $transaction->id],
            ['all']
        ));

        return redirect()->route('home')->with($status === 'success' ? 'success' : 'error', $message);
    }

    /**
     * Admin manually updates payment status
     */
    public function updateStatus(Request $request, $id)
    {
        $transaction = transaction::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:' . implode(',', [
                transaction::PAYMENT_PENDING,
                transaction::PAYMENT_SUCCESS,
                transaction::PAYMENT_FAILED,
                transaction::PAYMENT_CANCELED
            ]),
            'notes' => 'nullable|string|max:255',
        ]);

        $oldStatus = $transaction->payment_status;
        $transaction->payment_status = $validated['status'];

        if ($validated['status'] === transaction::PAYMENT_SUCCESS && !$transaction->paid_at) {
            $transaction->paid_at = now();
        }

        $transaction->save();

        // Log activity
        activity_log::create([
            'user_id' => Auth::id(),
            'action' => 'Update Status Pembayaran',
            'description' => "Status pembayaran transaksi {$transaction->transaction_code} diubah dari {$oldStatus} ke {$validated['status']}" .
                (isset($validated['notes']) ? " - Catatan: {$validated['notes']}" : ""),
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
