<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    public function run(): void
    {
        $mockCourses = [
            // Computer Science
            [
                'code' => 'CS101',
                'name' => 'Introduction to Computing',
                'description' => 'Principles and concepts of computer science',
                'units' => 3,
                'program' => 'Bachelor of Science in Computer Science',
                'year_level' => 1,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'CS102',
                'name' => 'Computer Programming 1',
                'description' => 'Fundamentals of programming using modern languages',
                'units' => 3,
                'program' => 'Bachelor of Science in Computer Science',
                'year_level' => 1,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'CS201',
                'name' => 'Object Oriented Programming',
                'description' => 'Principles of OOP and class design',
                'units' => 3,
                'program' => 'Bachelor of Science in Computer Science',
                'year_level' => 2,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'CS301',
                'name' => 'Data Structures',
                'description' => 'Study of fundamental data structures and their applications',
                'units' => 3,
                'program' => 'Bachelor of Science in Computer Science',
                'year_level' => 3,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'CS302',
                'name' => 'Algorithms',
                'description' => 'Analysis and design of computer algorithms',
                'units' => 3,
                'program' => 'Bachelor of Science in Computer Science',
                'year_level' => 3,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'CS303',
                'name' => 'Web Development',
                'description' => 'Modern web technologies and frameworks',
                'units' => 3,
                'program' => 'Bachelor of Science in Computer Science',
                'year_level' => 3,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'CS401',
                'name' => 'Software Engineering',
                'description' => 'Methodologies and practices in software development',
                'units' => 3,
                'program' => 'Bachelor of Science in Computer Science',
                'year_level' => 4,
                'semester' => '1st Semester',
            ],
            // Information Technology
            [
                'code' => 'IT101',
                'name' => 'Information Technology Fundamentals',
                'description' => 'Overview of IT infrastructure and basic concepts',
                'units' => 3,
                'program' => 'Bachelor of Science in Information Technology',
                'year_level' => 1,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'IT102',
                'name' => 'Programming 1 (IT)',
                'description' => 'Introduction to programming logic for IT students',
                'units' => 3,
                'program' => 'Bachelor of Science in Information Technology',
                'year_level' => 1,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'IT201',
                'name' => 'Network Management',
                'description' => 'Setup and administration of computer networks',
                'units' => 3,
                'program' => 'Bachelor of Science in Information Technology',
                'year_level' => 2,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'IT301',
                'name' => 'System Analysis and Design',
                'description' => 'Analyzing IT requirements and designing solutions',
                'units' => 3,
                'program' => 'Bachelor of Science in Information Technology',
                'year_level' => 3,
                'semester' => '1st Semester',
            ],
            [
                'code' => 'IT401',
                'name' => 'Information Assurance and Security',
                'description' => 'Encryption, security protocols, and data protection',
                'units' => 3,
                'program' => 'Bachelor of Science in Information Technology',
                'year_level' => 4,
                'semester' => '1st Semester',
            ],
        ];

        foreach ($mockCourses as $course) {
            Course::updateOrCreate(['code' => $course['code']], $course);
        }
    }
}
