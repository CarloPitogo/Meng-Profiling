<?php

namespace App\Services;

use App\Models\Schedule;

class ScheduleService
{
    public function getAllSchedules()
    {
        return Schedule::all();
    }

    public function createSchedule(array $data)
    {
        return Schedule::create($data);
    }
}
