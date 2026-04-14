<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Student;

class UpdateSuspensionStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'student:update-suspensions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Checks suspended students and activates them if their suspension date has passed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $suspendedStudents = Student::where('status', 'Suspended')->get();
        $activatedCount = 0;

        foreach ($suspendedStudents as $student) {
            // Check if they have ANY active suspensions
            $activeSuspensions = $student->violations()
                                         ->whereNotNull('suspended_until')
                                         ->whereDate('suspended_until', '>=', now()->toDateString())
                                         ->exists();
            
            if (!$activeSuspensions) {
                $student->update(['status' => 'Active']);
                $activatedCount++;
            }
        }
        
        $this->info("Successfully activated {$activatedCount} students whose suspensions expired.");
    }
}
