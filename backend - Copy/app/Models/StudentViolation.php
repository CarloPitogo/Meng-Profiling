<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentViolation extends Model
{
    protected $fillable = ['student_id', 'date', 'type', 'description', 'severity', 'resolution', 'suspended_until'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
