<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Limit;
use Illuminate\Support\Facades\File;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Define your route model bindings, pattern filters, etc.
     */
    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        $this->routes(function () {
            // Create api.php file if it doesn't exist
            $apiFile = base_path('routes/api.php');
            if (!File::exists($apiFile)) {
                File::put($apiFile, '<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TransactionController;

Route::post(\'/transactions\', [TransactionController::class, \'store\']);
Route::get(\'/transactions/{id}\', [TransactionController::class, \'show\']);
Route::get(\'/transactions/token/{token}\', [TransactionController::class, \'getByToken\']);
Route::get(\'/transactions/pending\', [TransactionController::class, \'getPendingTransactions\']);
');
            }

            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));

            // Add the following if they don't exist
            if (file_exists(base_path('routes/Dashboard.php'))) {
                Route::middleware('web')
                    ->group(base_path('routes/Dashboard.php'));
            }

            if (file_exists(base_path('routes/auth.php'))) {
                Route::middleware('web')
                    ->group(base_path('routes/auth.php'));
            }

            if (file_exists(base_path('routes/settings.php'))) {
                Route::middleware('web')
                    ->group(base_path('routes/settings.php'));
            }

            if (file_exists(base_path('routes/channels.php'))) {
                require base_path('routes/channels.php');
            }
        });
    }
}
