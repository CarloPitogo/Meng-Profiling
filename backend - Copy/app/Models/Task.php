<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'faculty_id',
        'section',
        'course_code',
        'title',
        'description',
        'due_date',
        'status',
    ];

    public function faculty()
    {
        return $this->belongsTo(Faculty::class);
    }
}
