<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Faculty;
use App\Services\FacultyService;
use App\Http\Resources\FacultyResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class FacultyController extends Controller
{
    use AuthorizesRequests;

    protected FacultyService $facultyService;

    public function __construct(FacultyService $facultyService)
    {
        $this->facultyService = $facultyService;
    }

    public function index()
    {
        $this->authorize('viewAny', Faculty::class);
        $faculties = $this->facultyService->getAllFaculty();
        return FacultyResource::collection($faculties);
    }

    public function show(string $id)
    {
        $faculty = $this->facultyService->getFacultyById($id);
        $this->authorize('view', $faculty);
        return new FacultyResource($faculty);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Faculty::class);
    }

    public function update(Request $request, string $id)
    {
        $faculty = $this->facultyService->getFacultyById($id);
        $this->authorize('update', $faculty);
    }

    public function destroy(string $id)
    {
        $faculty = $this->facultyService->getFacultyById($id);
        $this->authorize('delete', $faculty);
    }
}
