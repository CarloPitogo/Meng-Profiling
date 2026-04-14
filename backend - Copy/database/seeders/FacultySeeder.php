<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Faculty;

class FacultySeeder extends Seeder
{
    public function run(): void
    {
        $mockFaculty = [
            [
                'first_name' => 'Dr. Robert',
                'last_name' => 'Garcia',
                'employee_number' => 'FAC-2015-001',
                'email' => 'robert.garcia@faculty.edu',
                'phone' => '+63 922 123 4567',
                'department' => 'Computer Science',
                'position' => 'Professor',
                'specialization' => ['Artificial Intelligence', 'Machine Learning', 'Data Science'],
                'status' => 'Active',
                'courses_teaching' => ['CS301', 'CS401', 'CS405'],
            ],
            [
                'first_name' => 'Prof. Anna',
                'last_name' => 'Mendoza',
                'employee_number' => 'FAC-2018-012',
                'email' => 'anna.mendoza@faculty.edu',
                'phone' => '+63 923 234 5678',
                'department' => 'Computer Science',
                'position' => 'Associate Professor',
                'specialization' => ['Web Development', 'Software Engineering', 'Database Systems'],
                'status' => 'Active',
                'courses_teaching' => ['CS303', 'CS302', 'CS201'],
            ],
            [
                'first_name' => 'Dr. James',
                'last_name' => 'Sy',
                'employee_number' => 'FAC-2017-008',
                'email' => 'james.sy@faculty.edu',
                'phone' => '+63 924 345 6789',
                'department' => 'Information Technology',
                'position' => 'Professor',
                'specialization' => ['Network Security', 'Cybersecurity', 'Cloud Computing'],
                'status' => 'Active',
                'courses_teaching' => ['IT201', 'IT301', 'IT401'],
            ],
        ];

        foreach ($mockFaculty as $data) {
            Faculty::create($data);
        }
    }
}
