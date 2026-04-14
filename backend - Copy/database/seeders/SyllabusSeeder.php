<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Syllabus;

class SyllabusSeeder extends Seeder
{
    public function run(): void
    {
        $mockSyllabi = [
            [
                'course_code' => 'CS301',
                'course_name' => 'Data Structures',
                'faculty_id' => '1',
                'semester' => '1st Semester 2023-2026',
                'description' => 'This course covers fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs.',
                'objectives' => [
                    'Understand various data structure implementations',
                    'Analyze time and space complexity',
                    'Apply appropriate data structures to solve problems',
                    'Implement data structures in programming language',
                ],
                'topics' => [
                    [
                        'week' => 1,
                        'title' => 'Introduction to Data Structures',
                        'description' => 'Overview of data structures and their importance',
                        'learningOutcomes' => ['Define data structures', 'Explain abstract data types'],
                    ],
                    [
                        'week' => 2,
                        'title' => 'Arrays and Linked Lists',
                        'description' => 'Static and dynamic data structures',
                        'learningOutcomes' => ['Implement arrays', 'Create linked lists', 'Compare performance'],
                    ],
                ],
                'grading_system' => [
                    ['component' => 'Quizzes', 'percentage' => 20],
                    ['component' => 'Projects', 'percentage' => 30],
                    ['component' => 'Midterm Exam', 'percentage' => 20],
                    ['component' => 'Final Exam', 'percentage' => 30],
                ],
            ],
        ];

        foreach ($mockSyllabi as $syllabus) {
            Syllabus::create($syllabus);
        }
    }
}
