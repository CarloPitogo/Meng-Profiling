<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $announcements = [
            [
                'title' => 'Midterm Examination Schedule Released',
                'content' => 'The midterm examination schedule for the 2nd semester has been posted. Please check your student portal for the complete schedule.',
                'type' => 'important',
                'date' => '2026-03-10',
                'author' => 'Academic Office',
            ],
            [
                'title' => 'IT Week 2026 - Call for Participants',
                'content' => 'Join us for IT Week 2026! Various competitions including programming contests, hackathons, and tech talks. Registration now open.',
                'type' => 'event',
                'date' => '2026-03-08',
                'author' => 'IT Society',
            ],
            [
                'title' => 'System Maintenance Notice',
                'content' => 'The student portal will undergo scheduled maintenance on March 15, 2026 from 12:00 AM to 6:00 AM. Services will be temporarily unavailable.',
                'type' => 'warning',
                'date' => '2026-03-07',
                'author' => 'IT Services',
            ],
            [
                'title' => 'Scholarship Application Deadline Extended',
                'content' => "Good news! The deadline for scholarship applications has been extended until March 20, 2026. Don't miss this opportunity!",
                'type' => 'success',
                'date' => '2026-03-05',
                'author' => 'Finance Office',
            ],
            [
                'title' => 'New Library Operating Hours',
                'content' => 'Starting March 15, the library will be open from 7:00 AM to 10:00 PM on weekdays and 8:00 AM to 6:00 PM on weekends.',
                'type' => 'info',
                'date' => '2026-03-03',
                'author' => 'Library Services',
            ]
        ];

        foreach ($announcements as $announcement) {
            \App\Models\Announcement::create($announcement);
        }
    }
}
