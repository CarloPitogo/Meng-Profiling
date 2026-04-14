<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScheduleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'courseCode' => $this->course_code,
            'section' => $this->section,
            'facultyId' => $this->faculty_id,
            'room' => $this->room,
            'day' => $this->day,
            'timeStart' => $this->time_start,
            'timeEnd' => $this->time_end,
            'type' => $this->type,
        ];
    }
}
