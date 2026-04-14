<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $mockSchedules = [
            [
                'course_code' => 'CS301',
                'section' => 'CS3A',
                'faculty_id' => '1',
                'room' => 'CCS-401',
                'day' => 'Monday',
                'time_start' => '08:00',
                'time_end' => '11:00',
                'type' => 'Lecture',
            ],
            [
                'course_code' => 'CS302',
                'section' => 'CS3A',
                'faculty_id' => '2',
                'room' => 'CCS-402',
                'day' => 'Tuesday',
                'time_start' => '13:00',
                'time_end' => '16:00',
                'type' => 'Lecture',
            ],
            [
                'course_code' => 'CS303',
                'section' => 'CS3A',
                'faculty_id' => '2',
                'room' => 'CCS-Lab1',
                'day' => 'Wednesday',
                'time_start' => '08:00',
                'time_end' => '11:00',
                'type' => 'Laboratory',
            ],
            // BSCS 1st Year Section A
            [
                'course_code' => 'CS101',
                'section' => 'CS1A',
                'faculty_id' => '1',
                'room' => 'CCS-101',
                'day' => 'Monday',
                'time_start' => '09:00',
                'time_end' => '12:00',
                'type' => 'Lecture',
            ],
            [
                'course_code' => 'CS102',
                'section' => 'CS1A',
                'faculty_id' => '2',
                'room' => 'CCS-Lab2',
                'day' => 'Thursday',
                'time_start' => '13:00',
                'time_end' => '16:00',
                'type' => 'Laboratory',
            ],
            // BSCS 2nd Year Section A
            [
                'course_code' => 'CS201',
                'section' => 'CS2A',
                'faculty_id' => '1',
                'room' => 'CCS-202',
                'day' => 'Tuesday',
                'time_start' => '08:00',
                'time_end' => '10:00',
                'type' => 'Lecture',
            ],
            // BSCS 4th Year Section A
            [
                'course_code' => 'CS401',
                'section' => 'CS4A',
                'faculty_id' => '1',
                'room' => 'CCS-405',
                'day' => 'Friday',
                'time_start' => '09:00',
                'time_end' => '12:00',
                'type' => 'Lecture',
            ],
            // BSIT 1st Year Section A
            [
                'course_code' => 'IT101',
                'section' => 'IT1A',
                'faculty_id' => '2',
                'room' => 'CCS-105',
                'day' => 'Wednesday',
                'time_start' => '10:00',
                'time_end' => '13:00',
                'type' => 'Lecture',
            ],
            [
                'course_code' => 'IT102',
                'section' => 'IT1A',
                'faculty_id' => '1',
                'room' => 'CCS-Lab3',
                'day' => 'Friday',
                'time_start' => '14:00',
                'time_end' => '17:00',
                'type' => 'Laboratory',
            ],
            // BSIT 2nd Year Section A
            [
                'course_code' => 'IT201',
                'section' => 'IT2A',
                'faculty_id' => '2',
                'room' => 'CCS-205',
                'day' => 'Monday',
                'time_start' => '13:00',
                'time_end' => '16:00',
                'type' => 'Lecture',
            ],
            // BSIT 3rd Year Section A
            [
                'course_code' => 'IT301',
                'section' => 'IT3A',
                'faculty_id' => '1',
                'room' => 'CCS-301',
                'day' => 'Tuesday',
                'time_start' => '09:00',
                'time_end' => '12:00',
                'type' => 'Lecture',
            ],
            // BSIT 4th Year Section A
            [
                'course_code' => 'IT401',
                'section' => 'IT4A',
                'faculty_id' => '2',
                'room' => 'CCS-Lab4',
                'day' => 'Thursday',
                'time_start' => '08:00',
                'time_end' => '12:00',
                'type' => 'Laboratory',
            ],
        ];

        foreach ($mockSchedules as $schedule) {
            Schedule::create($schedule);
        }
    }
}
