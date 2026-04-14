<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Faculty;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with('faculty')->latest()->get();
        return response()->json(['data' => $tasks]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'section' => 'required|string',
            'courseCode' => 'required|string',
            'due_date' => 'required|date',
        ]);

        $user = Auth::user();
        if ($user->role !== 'faculty') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $faculty = Faculty::where('email', $user->email)->first();
        if (!$faculty) {
            return response()->json(['message' => 'Faculty record not found'], 404);
        }

        $task = Task::create([
            'faculty_id' => $faculty->id,
            'title' => $request->title,
            'description' => $request->description,
            'section' => $request->section,
            'course_code' => $request->courseCode,
            'due_date' => $request->due_date,
            'status' => 'Open',
        ]);

        return response()->json(['data' => $task, 'message' => 'Task created successfully']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'status' => 'required|in:Open,Closed',
        ]);

        $task->update($request->only('status'));

        return response()->json(['data' => $task, 'message' => 'Task status updated']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task deleted']);
    }
}
