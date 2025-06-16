<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        // Kasir gate - for users with kasir role
        Gate::define('kasir', function ($user) {
            return $user->role === 'kasir' || $user->role === 'admin';
        });

        // Koki gate - for users with koki role
        Gate::define('koki', function ($user) {
            return $user->role === 'koki' || $user->role === 'admin';
        });

        // Active user gate - checks if user is active
        Gate::define('active', function ($user) {
            return $user->is_active === true;
        });
    }
}
