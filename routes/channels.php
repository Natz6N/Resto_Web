<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// User-specific channel
Broadcast::channel('user.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Role-based channels
Broadcast::channel('role.admin', function ($user) {
    return $user->hasRole('admin');
});

Broadcast::channel('role.kasir', function ($user) {
    return $user->hasRole('admin') || $user->hasRole('kasir');
});

Broadcast::channel('role.koki', function ($user) {
    return $user->hasRole('admin') || $user->hasRole('koki');
});

// Channel for transaction-related messages
Broadcast::channel('transactions', function ($user) {
    return $user->hasAnyRole(['admin', 'kasir', 'koki']);
});

// Kitchen channel
Broadcast::channel('kitchen', function ($user) {
    return $user->hasAnyRole(['admin', 'koki']);
});
