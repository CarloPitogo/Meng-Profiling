<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Services\ScheduleService;
use App\Http\Resources\ScheduleResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ScheduleController extends Controller
{
    use AuthorizesRequests;

    protected ScheduleService $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }

    public function index()
    {
        $this->authorize('viewAny', Schedule::class);
        return ScheduleResource::collection($this->scheduleService->getAllSchedules());
    }

    public function store(\Illuminate\Http\Request $request)
    {
        $this->authorize('create', Schedule::class);
        $request->validate([
            'courseCode' => 'required|string',
            'section' => 'required|string',
            'facultyId' => 'required',
            'room' => 'required|string',
            'day' => 'required|string',
            'timeStart' => 'required|string',
            'timeEnd' => 'required|string',
            'type' => 'required|string|in:Lecture,Laboratory',
        ]);

        $data = [
            'course_code' => $request->courseCode,
            'section' => $request->section,
            'faculty_id' => $request->facultyId,
            'room' => $request->room,
            'day' => $request->day,
            'time_start' => $request->timeStart,
            'time_end' => $request->timeEnd,
            'type' => $request->type,
        ];

        $schedule = $this->scheduleService->createSchedule($data);
        return new ScheduleResource($schedule);
    }

    public function destroy(Schedule $schedule)
    {
        $this->authorize('delete', $schedule);
        $schedule->delete();
        return response()->json(null, 204);
    }
}
