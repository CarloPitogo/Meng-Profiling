<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;

class StudentTest extends TestCase
{
    use RefreshDatabase;

    public function test_students_endpoint_returns_expected_data(): void
    {
        // 1. Create a user to pass sanctum authentication
        $user = User::factory()->create();

        // 2. Seed the database with our custom StudentSeeder (the transposed mock data)
        $this->seed(\Database\Seeders\StudentSeeder::class);

        // 3. Make GET request to /api/students
        $response = $this->actingAs($user, 'sanctum')->getJson('/api/students');

        // 4. Assert 200 OK
        $response->assertStatus(200);

        // 5. Assert the precise JSON structure (Reconnaissance protection check)
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'id',
                    'firstName',
                    'lastName',
                    'studentNumber',
                    'email',
                    'phone',
                    'dateOfBirth',
                    'gender',
                    'address',
                    'enrollmentDate',
                    'program',
                    'yearLevel',
                    'status',
                    'gpa',
                    'technicalSkills',
                    'otherSkills',
                    'academicHistory',
                    'sportsSkills',
                    'affiliations',
                    'violations',
                    'nonAcademicActivities'
                ]
            ]
        ]);

        // 6. Assert specific mocked data is present
        $response->assertJsonFragment([
            'firstName' => 'John',
            'lastName' => 'Dela Cruz',
            'studentNumber' => '2021-00001-MN',
            'program' => 'Bachelor of Science in Computer Science',
            // Check nested relation formatting
            'sport' => 'Basketball', 
            'level' => 'Advanced'
        ]);
        
        $response->assertJsonFragment([
            'firstName' => 'Maria',
            'lastName' => 'Santos',
            'email' => 'maria.santos@student.edu'
        ]);
    }
}
