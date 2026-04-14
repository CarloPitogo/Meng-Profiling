<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentActivity extends Model
{
    protected $fillable = ['student_id', 'name', 'type', 'date', 'description', 'award'];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
