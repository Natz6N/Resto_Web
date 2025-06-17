<?php

namespace App\Http\Controllers;

use App\Events\OrderStatusChanged;
use App\Events\SystemNotification;
use App\Models\transaction;
use App\Models\activity_log;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a listing of orders for kitchen
     */
    public function index()
    {
        // Get orders that are not completed or cancelled
        $pendingOrders = transaction::where('payment_status', transaction::PAYMENT_SUCCESS)
            ->whereIn('order_status', [
                transaction::ORDER_PENDING,
                transaction::ORDER_PREPARING,
                transaction::ORDER_READY
            ])
            ->with(['items.product', 'cashier'])
            ->orderBy('created_at', 'desc')
            ->get();

        // Get recently completed orders (last 24 hours)
        $completedOrders = transaction::where('payment_status', transaction::PAYMENT_SUCCESS)
            ->where('order_status', transaction::ORDER_SERVED)
            ->where('updated_at', '>=', now()->subDay())
            ->with(['items.product', 'cashier'])
            ->orderBy('updated_at', 'desc')
            ->get();

        return Inertia::render('Kitchen/Orders', [
            'pendingOrders' => $pendingOrders,
            'completedOrders' => $completedOrders
        ]);
    }

    /**
     * Update order status
     */
    public function updateStatus(Request $request, $id)
    {
        $transaction = transaction::with('items.product')->findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:' . implode(',', [
                transaction::ORDER_PENDING,
                transaction::ORDER_PREPARING,
                transaction::ORDER_READY,
                transaction::ORDER_SERVED,
                transaction::ORDER_CANCELED
            ]),
            'notes' => 'nullable|string|max:255',
        ]);

        $oldStatus = $transaction->order_status;
        $transaction->order_status = $validated['status'];

        // If order is being served, update the served_at timestamp
        if ($validated['status'] === transaction::ORDER_SERVED && !$transaction->served_at) {
            $transaction->served_at = now();
        }

        $transaction->save();

        // Log activity
        activity_log::create([
            'user_id' => Auth::id(),
            'action' => 'Update Status Pesanan',
            'description' => "Status pesanan {$transaction->transaction_code} diubah dari {$oldStatus} ke {$validated['status']}" .
                (isset($validated['notes']) ? " - Catatan: {$validated['notes']}" : ""),
        ]);

        // Determine who should receive the notification
        $notifyRoles = ['all'];
        switch ($validated['status']) {
            case transaction::ORDER_PREPARING:
                $notifyRoles = ['koki', 'admin'];
                break;

            case transaction::ORDER_READY:
                $notifyRoles = ['kasir', 'admin'];
                break;

            case transaction::ORDER_SERVED:
                $notifyRoles = ['koki', 'admin', 'kasir'];
                break;

            case transaction::ORDER_CANCELED:
                $notifyRoles = ['koki', 'admin', 'kasir'];
                break;
        }

        // Broadcast events
        event(new OrderStatusChanged($transaction, $validated['status']));
        event(new SystemNotification(
            'order_status_changed',
            "Status pesanan {$transaction->transaction_code} diubah menjadi {$validated['status']}",
            [
                'transaction_id' => $transaction->id,
                'old_status' => $oldStatus,
                'new_status' => $validated['status']
            ],
            $notifyRoles
        ));

        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Status pesanan berhasil diperbarui'
            ]);
        }

        return redirect()->back()->with('success', 'Status pesanan berhasil diperbarui');
    }

    /**
     * Get real-time order updates for kitchen display
     */
    public function getUpdates()
    {
        $pendingOrders = transaction::where('payment_status', transaction::PAYMENT_SUCCESS)
            ->whereIn('order_status', [
                transaction::ORDER_PENDING,
                transaction::ORDER_PREPARING,
                transaction::ORDER_READY
            ])
            ->with(['items.product'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'pendingOrders' => $pendingOrders
        ]);
    }
}
