<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $mockEvents = [
            [
                'name' => 'Programming Competition 2026',
                'type' => 'Curricular',
                'category' => 'Competition',
                'date' => '2026-03-15',
                'time' => '09:00',
                'venue' => 'CCS Building',
                'description' => 'Annual programming competition for all CS and IT students',
                'organizer' => 'Computer Science Department',
                'target_participants' => ['CS Students', 'IT Students'],
                'registration_required' => true,
            ],
            [
                'name' => 'Basketball Tryouts',
                'type' => 'Extra-Curricular',
                'category' => 'Sports',
                'date' => '2026-03-20',
                'time' => '14:00',
                'venue' => 'University Gymnasium',
                'description' => 'Tryouts for the CCS Basketball Varsity Team',
                'organizer' => 'CCS Sports Committee',
                'target_participants' => ['All CCS Students'],
                'registration_required' => true,
            ],
            [
                'name' => 'Volleyball Tournament',
                'type' => 'Extra-Curricular',
                'category' => 'Sports',
                'date' => '2026-04-05',
                'time' => '08:00',
                'venue' => 'University Gymnasium',
                'description' => 'Annual Inter-department Volleyball league',
                'organizer' => 'Sports Development Office',
                'target_participants' => ['All Students'],
                'registration_required' => true,
            ],
            [
                'name' => 'Badminton Open',
                'type' => 'Extra-Curricular',
                'category' => 'Sports',
                'date' => '2026-05-12',
                'time' => '13:00',
                'venue' => 'Sports Center',
                'description' => 'Badminton singles and doubles competition',
                'organizer' => 'Badminton Club',
                'target_participants' => ['All Students'],
                'registration_required' => false,
            ],
            [
                'name' => 'Tech Summit 2026',
                'type' => 'Extra-Curricular',
                'category' => 'Seminar',
                'date' => '2026-03-25',
                'time' => '10:00',
                'venue' => 'CCS Auditorium',
                'description' => 'Industry experts sharing insights on emerging technologies',
                'organizer' => 'ACM Student Chapter',
                'target_participants' => ['All Students'],
                'registration_required' => false,
            ],
            [
                'name' => 'Hackathon 2026',
                'type' => 'Curricular',
                'category' => 'Competition',
                'date' => '2026-04-10',
                'time' => '08:00',
                'venue' => 'CCS Building',
                'description' => '24-hour coding marathon to solve real-world problems',
                'organizer' => 'Computer Science Society',
                'target_participants' => ['CS Students', 'IT Students'],
                'registration_required' => true,
            ],
        ];

        foreach ($mockEvents as $event) {
            Event::create($event);
        }
    }
}
