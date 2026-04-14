<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Manual Performance Profiling: Log every database query with its execution time
        // This helps identify slow queries without needing a UI dashboard.
        \Illuminate\Support\Facades\DB::listen(function ($query) {
            $time = $query->time; // in milliseconds

            // Log to laravel.log if the query is particularly slow (e.g. > 50ms)
            // Or log ALL queries during performance testing phase.
            if ($time > 50) {
                \Illuminate\Support\Facades\Log::warning("SLOW QUERY DETECTED: [{$time}ms] {$query->sql}", [
                    'bindings' => $query->bindings,
                ]);
            }
            else {
                \Illuminate\Support\Facades\Log::debug("QUERY: [{$time}ms] {$query->sql}");
            }
        });
    }
}
