<?php

namespace App\Http\Controllers;

use App\Models\Syllabus;
use App\Services\SyllabusService;
use App\Http\Resources\SyllabusResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class SyllabusController extends Controller
{
    use AuthorizesRequests;

    protected SyllabusService $syllabusService;

    public function __construct(SyllabusService $syllabusService)
    {
        $this->syllabusService = $syllabusService;
    }

    public function index()
    {
        $this->authorize('viewAny', Syllabus::class);
        return SyllabusResource::collection($this->syllabusService->getAllSyllabi());
    }
}
