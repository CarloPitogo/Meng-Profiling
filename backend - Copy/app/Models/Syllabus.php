<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Syllabus extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_code',
        'course_name',
        'faculty_id',
        'semester',
        'description',
        'objectives',
        'topics',
        'grading_system',
    ];

    protected function casts(): array
    {
        return [
            'objectives' => 'array',
            'topics' => 'array',
            'grading_system' => 'array',
        ];
    }
}
