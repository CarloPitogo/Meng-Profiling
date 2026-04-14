<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SyllabusResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'courseCode' => $this->course_code,
            'courseName' => $this->course_name,
            'facultyId' => $this->faculty_id,
            'semester' => $this->semester,
            'description' => $this->description,
            'objectives' => $this->objectives ?? [],
            'topics' => $this->topics ?? [],
            'gradingSystem' => $this->grading_system ?? [],
        ];
    }
}
