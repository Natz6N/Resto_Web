<?php

namespace App\Http\Controllers;

use App\Events\SystemNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated user
     */
    public function index()
    {
        $user = Auth::user();
        $role = $user->roles->first()->name ?? 'user';

        // Get notifications for this user based on role
        $notifications = DB::table('notifications')
            ->where(function($query) use ($role) {
                $query->where('data->for', 'like', '%"all"%')
                      ->orWhere('data->for', 'like', '%"' . $role . '"%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications
        ]);
    }

    /**
     * Mark notifications as read
     */
    public function markAsRead(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'string'
        ]);

        DB::table('notifications')
            ->whereIn('id', $validated['ids'])
            ->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }

    /**
     * Get unread notification count
     */
    public function getUnreadCount()
    {
        $user = Auth::user();
        $role = $user->roles->first()->name ?? 'user';

        $count = DB::table('notifications')
            ->whereNull('read_at')
            ->where(function($query) use ($role) {
                $query->where('data->for', 'like', '%"all"%')
                      ->orWhere('data->for', 'like', '%"' . $role . '"%');
            })
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Send a test notification (for development purposes)
     */
    public function sendTest(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string|in:info,success,warning,error',
            'message' => 'required|string',
            'for' => 'required|array',
            'for.*' => 'string|in:all,admin,kasir,koki'
        ]);

        event(new SystemNotification(
            $validated['type'],
            $validated['message'],
            ['source' => 'test', 'timestamp' => now()->toIso8601String()],
            $validated['for']
        ));

        return response()->json([
            'success' => true,
            'message' => 'Test notification sent'
        ]);
    }
}