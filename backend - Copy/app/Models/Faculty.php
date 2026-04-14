<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Faculty extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'middle_name',
        'last_name',
        'employee_number',
        'email',
        'phone',
        'gender',
        'department',
        'position',
        'specialization',
        'status',
        'courses_teaching',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'specialization' => 'array',
            'courses_teaching' => 'array',
        ];
    }
}
