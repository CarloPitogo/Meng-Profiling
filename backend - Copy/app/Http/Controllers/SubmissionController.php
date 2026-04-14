<?php

namespace App\Http\Controllers;

use App\Models\Submission;
use App\Models\Student;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\SubmissionResource;

class SubmissionController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        if ($user->role === 'student') {
            $student = Student::where('email', $user->email)->first();
            return SubmissionResource::collection(Submission::where('student_id', $student->id)->get());
        }
        return SubmissionResource::collection(Submission::with(['student', 'task'])->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'file' => 'nullable|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar,jpg,png|max:10240',
            'submission_link' => 'nullable|url',
        ]);

        $user = Auth::user();
        $student = Student::where('email', $user->email)->first();

        if (!$student) {
            return response()->json(['message' => 'Student record not found'], 404);
        }

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('submissions', 'public');
        }

        $task = Task::find($request->task_id);
        $status = now()->isAfter($task->due_date) ? 'Late' : 'Submitted';

        $submission = Submission::updateOrCreate(
            ['task_id' => $request->task_id, 'student_id' => $student->id],
            [
                'file_path' => $filePath ?? Submission::where('task_id', $request->task_id)->where('student_id', $student->id)->value('file_path'),
                'submission_link' => $request->submission_link,
                'submitted_at' => now(),
                'status' => $status
            ]
        );

        return response()->json([
            'data' => $submission,
            'message' => 'Submission successful!'
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'grade' => 'required',
            'status' => 'nullable|string'
        ]);

        $submission = Submission::findOrFail($id);
        $submission->update($request->only(['grade', 'status']));

        return response()->json(['data' => $submission, 'message' => 'Grade updated successfully']);
    }

    public function getSubmissionsByTask($taskId)
    {
        $submissions = Submission::with('student')->where('task_id', $taskId)->get();
        return SubmissionResource::collection($submissions);
    }
}
