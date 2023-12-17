<?php

namespace App;

use Illuminate\Console\Scheduling\Schedule;

class ConsoleKernel extends \Illuminate\Foundation\Console\Kernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('inspire')->hourly();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
