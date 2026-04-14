<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

use App\Http\Controllers\FacultyController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\SyllabusController;

use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\SubmissionController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/update-password', [AuthController::class, 'updatePassword']);
    Route::put('/update-profile', [AuthController::class, 'updateProfile']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Students Module API
    Route::get('students/available-skills', [StudentController::class, 'availableSkills']);
    Route::apiResource('students', StudentController::class);

    // Faculty Module API
    Route::apiResource('faculty', FacultyController::class);
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('submissions', SubmissionController::class);
    Route::get('tasks/{task}/submissions', [SubmissionController::class, 'getSubmissionsByTask']);

    // Courses & Instruction API
    Route::apiResource('courses', CourseController::class);
    Route::apiResource('syllabi', SyllabusController::class);

    // Scheduling API
    Route::apiResource('schedules', ScheduleController::class);

    // Events API
    Route::get('events/available-sports', [EventController::class, 'availableSports']);
    Route::get('events/available-activities', [EventController::class, 'availableActivities']);
    Route::apiResource('events', EventController::class);

    // System Logs API
    Route::get('/system-logs', [\App\Http\Controllers\SystemLogController::class, 'index']);

    // Announcements API
    Route::apiResource('announcements', \App\Http\Controllers\AnnouncementController::class);
});

















