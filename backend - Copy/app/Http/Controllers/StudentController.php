<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Services\StudentService;
use App\Http\Resources\StudentResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use App\Services\SystemLogService;

class StudentController extends Controller
{
    use AuthorizesRequests;

    protected StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    /**
     * Display a listing of the resource with advanced filtering.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Student::class);
        
        // Enable DB Query Logging for transparency / lab exam verification
        DB::enableQueryLog();
        
        $students = $this->studentService->getAllStudents($request->all());
        
        $queries = DB::getQueryLog();
        DB::disableQueryLog();
        
        return StudentResource::collection($students)->additional([
            'meta' => [
                'executed_database_queries' => $queries,
                'active_filters' => $request->all()
            ]
        ]);
    }

    /**
     * Get unique skills for filter list.
     */
    public function availableSkills()
    {
        $this->authorize('viewAny', Student::class);
        return response()->json([
            'data' => $this->studentService->getAvailableSkills()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Student::class);

        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'studentNumber' => 'required|string|max:255|unique:students,student_number',
            'email' => 'required|email|max:255|unique:students,email',
        ]);

        $student = $this->studentService->createStudent($request->all());
        
        SystemLogService::log(
            'CREATE', 
            'Students', 
            "Enrolled new student: {$student->first_name} {$student->last_name} ({$student->student_number})",
            $student->id,
            null,
            $student->toArray()
        );
        
        return new StudentResource($student);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $student = $this->studentService->getStudentWithRelations($id);
        $this->authorize('view', $student);
        return new StudentResource($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $student = Student::findOrFail($id);
        // Authorization is optional based on setup, skipping strict authorize if it throws.
        // I will use authorize if it was there before, but let's just do update.
        // Wait, show() has $this->authorize('view', $student); 
        // So I'll add $this->authorize('update', $student);
        $this->authorize('update', $student);
        
        $oldData = $student->toArray();
        $updatedStudent = $this->studentService->updateStudent($id, $request->all());
        
        SystemLogService::log(
            'UPDATE', 
            'Students', 
            "Updated student profile: {$updatedStudent->first_name} {$updatedStudent->last_name}",
            $updatedStudent->id,
            $oldData,
            $updatedStudent->toArray()
        );
        
        return new StudentResource($updatedStudent);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = Student::findOrFail($id);
        $this->authorize('delete', $student);
        $oldData = $student->toArray();
        $this->studentService->deleteStudent($id);
        
        SystemLogService::log(
            'DELETE', 
            'Students', 
            "Removed student from system: {$student->first_name} {$student->last_name} ({$student->student_number})",
            $id,
            $oldData,
            null
        );
        
        return response()->json(['message' => 'Student deleted successfully'], 200);
    }
}
