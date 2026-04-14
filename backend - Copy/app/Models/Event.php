<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'category',
        'date',
        'time',
        'venue',
        'description',
        'organizer',
        'target_participants',
        'registration_required',
    ];

    protected function casts(): array
    {
        return [
            'target_participants' => 'array',
            'registration_required' => 'boolean',
        ];
    }
}
