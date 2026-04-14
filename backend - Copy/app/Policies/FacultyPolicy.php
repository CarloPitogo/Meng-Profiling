<?php

namespace App\Policies;

use App\Models\Faculty;
use App\Models\User;

class FacultyPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Faculty $faculty): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Faculty $faculty): bool
    {
        return true;
    }

    public function delete(User $user, Faculty $faculty): bool
    {
        return true;
    }
}
