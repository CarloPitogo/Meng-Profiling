<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => (string) $this->id,
            'firstName' => $this->first_name,
            'middleName' => $this->middle_name,
            'lastName' => $this->last_name,
            'studentNumber' => $this->student_number,
            'email' => $this->email,
            'phone' => $this->phone,
            'dateOfBirth' => $this->date_of_birth,
            'gender' => $this->gender,
            'address' => $this->address,
            'enrollmentDate' => $this->enrollment_date,
            'program' => $this->program,
            'section' => $this->section,
            'yearLevel' => $this->year_level,
            'status' => $this->status,
            'gpa' => (float) $this->gpa,
            'technicalSkills' => $this->technical_skills ?? [],
            'otherSkills' => $this->other_skills ?? [],
            
            'academicHistory' => $this->whenLoaded('academicHistories', function() {
                return $this->academicHistories->map(function($history) {
                    return [
                        'semester' => $history->semester,
                        'semesterGPA' => (float) $history->semester_gpa,
                        'courses' => $history->courses ?? []
                    ];
                });
            }),
            
            'sportsSkills' => $this->whenLoaded('sportsSkills', function() {
                return $this->sportsSkills->map(function($skill) {
                    return [
                        'sport' => $skill->sport,
                        'level' => $skill->level,
                        'height' => $skill->height,
                        'weight' => $skill->weight,
                        'position' => $skill->position
                    ];
                });
            }),
            
            'affiliations' => $this->whenLoaded('affiliations', function() {
                return $this->affiliations->map(function($affil) {
                    return [
                        'organization' => $affil->organization,
                        'role' => $affil->role,
                        'joinDate' => $affil->join_date,
                        'status' => $affil->status
                    ];
                });
            }),
            
            'violations' => $this->whenLoaded('violations', function() {
                return $this->violations->map(function($violation) {
                    return [
                        'date' => $violation->date,
                        'type' => $violation->type,
                        'description' => $violation->description,
                        'severity' => $violation->severity,
                        'resolution' => $violation->resolution
                    ];
                });
            }),
            
            'nonAcademicActivities' => $this->whenLoaded('activities', function() {
                return $this->activities->map(function($activity) {
                    return [
                        'name' => $activity->name,
                        'type' => $activity->type,
                        'date' => $activity->date,
                        'description' => $activity->description,
                        'award' => $activity->award
                    ];
                });
            }),
        ];
    }
}
