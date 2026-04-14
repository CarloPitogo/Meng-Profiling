<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_code',
        'section',
        'faculty_id',
        'room',
        'day',
        'time_start',
        'time_end',
        'type',
    ];
}
