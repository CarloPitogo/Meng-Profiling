<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubmissionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'task_id' => $this->task_id,
            'student_id' => $this->student_id,
            'file_path' => $this->file_path,
            'submission_link' => $this->submission_link,
            'submitted_at' => $this->submitted_at,
            'status' => $this->status,
            'grade' => $this->grade,
            'student' => new StudentResource($this->whenLoaded('student')),
            'task' => $this->whenLoaded('task'),
        ];
    }
}
