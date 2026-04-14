<?php

namespace App\Services;

use App\Models\Syllabus;

class SyllabusService
{
    public function getAllSyllabi()
    {
        return Syllabus::all();
    }
}
