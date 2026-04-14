<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;
    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
        // Authenticate dummy user for the API endpoints
        $user = User::factory()->create();
        Sanctum::actingAs($user, ['*']);
    }

    public function test_faculty_endpoint_returns_data()
    {
        $response = $this->getJson('/api/faculty');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'firstName', 'lastName', 'email', 'department']
            ]
        ]);
        $this->assertNotEmpty($response->json('data'));
    }

    public function test_courses_endpoint_returns_data()
    {
        $response = $this->getJson('/api/courses');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'code', 'name', 'units']
            ]
        ]);
        $this->assertNotEmpty($response->json('data'));
    }

    public function test_syllabi_endpoint_returns_data()
    {
        $response = $this->getJson('/api/syllabi');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'courseCode', 'objectives', 'gradingSystem']
            ]
        ]);
        $this->assertNotEmpty($response->json('data'));
    }

    public function test_schedules_endpoint_returns_data()
    {
        $response = $this->getJson('/api/schedules');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'courseCode', 'room', 'timeStart']
            ]
        ]);
        $this->assertNotEmpty($response->json('data'));
    }

    public function test_events_endpoint_returns_data()
    {
        $response = $this->getJson('/api/events');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => ['id', 'name', 'type', 'date']
            ]
        ]);
        $this->assertNotEmpty($response->json('data'));
    }
}
