<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentSportsSkill extends Model
{
    protected $fillable = ['student_id', 'sport', 'level', 'height', 'weight', 'position'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
