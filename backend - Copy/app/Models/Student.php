<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'student_number',
        'email',
        'phone',
        'date_of_birth',
        'gender',
        'address',
        'enrollment_date',
        'program',
        'section',
        'year_level',
        'status',
        'gpa',
        'technical_skills',
        'other_skills'
    ];

    protected function casts(): array
    {
        return [
            'technical_skills' => 'array',
            'other_skills' => 'array',
        ];
    }

    public function academicHistories(): HasMany
    {
        return $this->hasMany(StudentAcademicHistory::class);
    }

    public function sportsSkills(): HasMany
    {
        return $this->hasMany(StudentSportsSkill::class);
    }

    public function affiliations(): HasMany
    {
        return $this->hasMany(StudentAffiliation::class);
    }

    public function violations(): HasMany
    {
        return $this->hasMany(StudentViolation::class);
    }

    public function activities(): HasMany
    {
        return $this->hasMany(StudentActivity::class);
    }
}
