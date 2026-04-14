<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAffiliation extends Model
{
    protected $fillable = ['student_id', 'organization', 'role', 'join_date', 'status'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
