<?php

namespace App\Services;

use App\Models\Faculty;

class FacultyService
{
    /**
     * Get all faculty for the listing view.
     */
    public function getAllFaculty()
    {
        return Faculty::all();
    }

    /**
     * Get a single faculty by ID.
     */
    public function getFacultyById(string $id)
    {
        return Faculty::findOrFail($id);
    }
}
