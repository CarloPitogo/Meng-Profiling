<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Faculty;
use Illuminate\Support\Facades\Hash;

class FacultyUserSeeder extends Seeder
{
    public function run(): void
    {
        $faculties = Faculty::all();

        foreach ($faculties as $faculty) {
            User::updateOrCreate(
                ['email' => $faculty->email],
                [
                    'first_name' => $faculty->first_name,
                    'last_name' => $faculty->last_name,
                    'name' => "{$faculty->first_name} {$faculty->last_name}",
                    'password' => Hash::make('password123'),
                    'role' => 'faculty',
                    'gender' => 'Male', // Default, can be updated later
                ]
            );
        }
    }
}
