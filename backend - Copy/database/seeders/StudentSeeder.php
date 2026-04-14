<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Student;
use App\Models\StudentAcademicHistory;
use App\Models\StudentSportsSkill;
use App\Models\StudentAffiliation;
use App\Models\StudentViolation;
use App\Models\StudentActivity;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $mockStudents = [
            [
                'first_name' => 'John', 'last_name' => 'Dela Cruz', 'student_number' => '2021-00001-MN',
                'email' => 'john.delacruz@student.edu', 'phone' => '+63 912 345 6789', 'date_of_birth' => '2003-05-15',
                'gender' => 'Male', 'address' => '123 Main St, Manila', 'enrollment_date' => '2021-08-01',
                'program' => 'Bachelor of Science in Computer Science', 'year_level' => 3, 'status' => 'Active', 'gpa' => 3.75,
                'technical_skills' => ['Python', 'JavaScript', 'React', 'Java', 'SQL', 'Git'],
                'other_skills' => ['Public Speaking', 'Leadership', 'Event Management'],
                'academic_histories' => [
                    ['semester' => '1st Semester 2023-2026', 'semester_gpa' => 3.8, 'courses' => [
                        ['courseCode' => 'CS301', 'courseName' => 'Data Structures', 'units' => 3, 'grade' => 1.5, 'remarks' => 'Passed'],
                        ['courseCode' => 'CS302', 'courseName' => 'Algorithms', 'units' => 3, 'grade' => 1.75, 'remarks' => 'Passed'],
                        ['courseCode' => 'CS303', 'courseName' => 'Web Development', 'units' => 3, 'grade' => 1.25, 'remarks' => 'Passed'],
                    ]]
                ],
                'sports_skills' => [
                    ['sport' => 'Basketball', 'level' => 'Advanced', 'height' => 185, 'weight' => 78, 'position' => 'Point Guard'],
                    ['sport' => 'Volleyball', 'level' => 'Intermediate', 'height' => 185, 'weight' => 78, 'position' => null]
                ],
                'affiliations' => [
                    ['organization' => 'Computer Science Society', 'role' => 'Vice President', 'join_date' => '2022-09-01', 'status' => 'Active'],
                    ['organization' => 'CCS Basketball Team', 'role' => 'Team Captain', 'join_date' => '2021-10-01', 'status' => 'Active']
                ],
                'violations' => [],
                'activities' => [
                    ['name' => 'Hackathon 2023', 'type' => 'Competition', 'date' => '2023-11-15', 'description' => 'Participated in national coding competition', 'award' => '2nd Place'],
                    ['name' => 'Community Outreach', 'type' => 'Volunteer', 'date' => '2023-09-20', 'description' => 'Taught basic programming to high school students', 'award' => null]
                ]
            ],
            [
                'first_name' => 'Maria', 'last_name' => 'Santos', 'student_number' => '2021-00002-MN',
                'email' => 'maria.santos@student.edu', 'phone' => '+63 917 234 5678', 'date_of_birth' => '2003-08-22',
                'gender' => 'Female', 'address' => '456 Oak Ave, Quezon City', 'enrollment_date' => '2021-08-01',
                'program' => 'Bachelor of Science in Computer Science', 'year_level' => 3, 'status' => 'Active', 'gpa' => 3.92,
                'technical_skills' => ['Python', 'C++', 'Java', 'Machine Learning', 'TensorFlow', 'PyTorch', 'React', 'Node.js'],
                'other_skills' => ['Research', 'Technical Writing', 'Mentoring'],
                'academic_histories' => [
                    ['semester' => '1st Semester 2023-2026', 'semester_gpa' => 3.95, 'courses' => [
                        ['courseCode' => 'CS301', 'courseName' => 'Data Structures', 'units' => 3, 'grade' => 1.0, 'remarks' => 'Passed'],
                        ['courseCode' => 'CS302', 'courseName' => 'Algorithms', 'units' => 3, 'grade' => 1.25, 'remarks' => 'Passed'],
                        ['courseCode' => 'CS303', 'courseName' => 'Web Development', 'units' => 3, 'grade' => 1.0, 'remarks' => 'Passed'],
                    ]]
                ],
                'sports_skills' => [
                    ['sport' => 'Swimming', 'level' => 'Advanced', 'height' => null, 'weight' => null, 'position' => null],
                    ['sport' => 'Table Tennis', 'level' => 'Intermediate', 'height' => null, 'weight' => null, 'position' => null]
                ],
                'affiliations' => [
                    ['organization' => 'ACM Student Chapter', 'role' => 'President', 'join_date' => '2022-09-01', 'status' => 'Active'],
                    ['organization' => 'Women in Tech Club', 'role' => 'Founder', 'join_date' => '2022-06-01', 'status' => 'Active']
                ],
                'violations' => [],
                'activities' => [
                    ['name' => 'Google Code Jam', 'type' => 'Competition', 'date' => '2026-01-10', 'description' => 'International programming competition', 'award' => 'Qualifier'],
                    ['name' => 'Tech Talk Speaker', 'type' => 'Seminar', 'date' => '2023-10-05', 'description' => 'Spoke about AI and Machine Learning', 'award' => null]
                ]
            ],
            [
                'first_name' => 'Carlos', 'last_name' => 'Reyes', 'student_number' => '2022-00015-MN',
                'email' => 'carlos.reyes@student.edu', 'phone' => '+63 919 876 5432', 'date_of_birth' => '2004-03-10',
                'gender' => 'Male', 'address' => '789 Pine Rd, Makati', 'enrollment_date' => '2022-08-01',
                'program' => 'Bachelor of Science in Information Technology', 'year_level' => 2, 'status' => 'Active', 'gpa' => 3.45,
                'technical_skills' => ['JavaScript', 'PHP', 'MySQL', 'HTML/CSS', 'WordPress'],
                'other_skills' => ['Graphic Design', 'Video Editing'],
                'academic_histories' => [
                    ['semester' => '1st Semester 2023-2026', 'semester_gpa' => 3.5, 'courses' => [
                        ['courseCode' => 'IT201', 'courseName' => 'Database Systems', 'units' => 3, 'grade' => 1.75, 'remarks' => 'Passed'],
                        ['courseCode' => 'IT202', 'courseName' => 'Network Fundamentals', 'units' => 3, 'grade' => 2.0, 'remarks' => 'Passed'],
                    ]]
                ],
                'sports_skills' => [
                    ['sport' => 'Football', 'level' => 'Varsity', 'height' => 175, 'weight' => 70, 'position' => 'Midfielder'],
                    ['sport' => 'Basketball', 'level' => 'Beginner', 'height' => 175, 'weight' => 70, 'position' => null]
                ],
                'affiliations' => [
                    ['organization' => 'CCS Football Team', 'role' => 'Player', 'join_date' => '2022-09-01', 'status' => 'Active'],
                    ['organization' => 'IT Society', 'role' => 'Member', 'join_date' => '2022-08-15', 'status' => 'Active']
                ],
                'violations' => [
                    ['date' => '2023-10-15', 'type' => 'Late Submission', 'description' => 'Submitted project 2 days late', 'severity' => 'Minor', 'resolution' => 'Warning issued'],
                    ['date' => '2026-01-20', 'type' => 'Absence', 'description' => 'Unexcused absence from laboratory class', 'severity' => 'Minor', 'resolution' => 'Warning issued']
                ],
                'activities' => [
                    ['name' => 'Inter-College Football League', 'type' => 'Sports', 'date' => '2023-11-25', 'description' => 'Participated in annual football tournament', 'award' => 'Champions']
                ]
            ],
            [
                'first_name' => 'Sarah', 'last_name' => 'Lim', 'student_number' => '2022-00023-MN',
                'email' => 'sarah.lim@student.edu', 'phone' => '+63 920 111 2233', 'date_of_birth' => '2004-07-18',
                'gender' => 'Female', 'address' => '321 Elm St, Pasig', 'enrollment_date' => '2022-08-01',
                'program' => 'Bachelor of Science in Computer Science', 'year_level' => 2, 'status' => 'Active', 'gpa' => 3.65,
                'technical_skills' => ['Java', 'Python', 'C#', 'Unity', 'Game Development', 'Blender'],
                'other_skills' => ['3D Modeling', 'Animation', 'Game Design'],
                'academic_histories' => [
                    ['semester' => '1st Semester 2023-2026', 'semester_gpa' => 3.7, 'courses' => [
                        ['courseCode' => 'CS201', 'courseName' => 'Object-Oriented Programming', 'units' => 3, 'grade' => 1.5, 'remarks' => 'Passed'],
                        ['courseCode' => 'CS202', 'courseName' => 'Discrete Mathematics', 'units' => 3, 'grade' => 1.75, 'remarks' => 'Passed'],
                    ]]
                ],
                'sports_skills' => [
                    ['sport' => 'Badminton', 'level' => 'Advanced', 'height' => null, 'weight' => null, 'position' => null],
                    ['sport' => 'Chess', 'level' => 'Varsity', 'height' => null, 'weight' => null, 'position' => null]
                ],
                'affiliations' => [
                    ['organization' => 'Game Development Club', 'role' => 'Creative Director', 'join_date' => '2022-09-01', 'status' => 'Active'],
                    ['organization' => 'Chess Club', 'role' => 'Player', 'join_date' => '2022-08-15', 'status' => 'Active']
                ],
                'violations' => [],
                'activities' => [
                    ['name' => 'Game Jam 2026', 'type' => 'Competition', 'date' => '2026-02-14', 'description' => 'Created a game in 48 hours', 'award' => 'Best Visuals'],
                    ['name' => 'Chess Tournament', 'type' => 'Competition', 'date' => '2023-12-08', 'description' => 'Inter-college chess championship', 'award' => '3rd Place']
                ]
            ],
            [
                'first_name' => 'Miguel', 'last_name' => 'Torres', 'student_number' => '2023-00007-MN',
                'email' => 'miguel.torres@student.edu', 'phone' => '+63 918 444 5555', 'date_of_birth' => '2005-01-30',
                'gender' => 'Male', 'address' => '654 Maple Dr, Taguig', 'enrollment_date' => '2023-08-01',
                'program' => 'Bachelor of Science in Information Technology', 'year_level' => 1, 'status' => 'Active', 'gpa' => 3.25,
                'technical_skills' => ['Python', 'HTML/CSS', 'JavaScript'],
                'other_skills' => ['Team Leadership', 'Fitness Training'],
                'academic_histories' => [
                    ['semester' => '1st Semester 2023-2026', 'semester_gpa' => 3.25, 'courses' => [
                        ['courseCode' => 'IT101', 'courseName' => 'Introduction to Computing', 'units' => 3, 'grade' => 2.0, 'remarks' => 'Passed'],
                        ['courseCode' => 'IT102', 'courseName' => 'Programming Fundamentals', 'units' => 3, 'grade' => 1.75, 'remarks' => 'Passed'],
                    ]]
                ],
                'sports_skills' => [
                    ['sport' => 'Basketball', 'level' => 'Varsity', 'height' => 195, 'weight' => 88, 'position' => 'Center'],
                    ['sport' => 'Volleyball', 'level' => 'Advanced', 'height' => 195, 'weight' => 88, 'position' => 'Middle Blocker']
                ],
                'affiliations' => [
                    ['organization' => 'CCS Basketball Team', 'role' => 'Player', 'join_date' => '2023-09-01', 'status' => 'Active'],
                    ['organization' => 'CCS Volleyball Team', 'role' => 'Player', 'join_date' => '2023-09-15', 'status' => 'Active']
                ],
                'violations' => [],
                'activities' => [
                    ['name' => 'Freshmen Welcome Game', 'type' => 'Sports', 'date' => '2023-09-05', 'description' => 'Exhibition basketball game', 'award' => null]
                ]
            ],
            [
                'first_name' => 'Andrea', 'last_name' => 'Fernandez', 'student_number' => '2022-00030-MN',
                'email' => 'andrea.fernandez@student.edu', 'phone' => '+63 915 222 3333', 'date_of_birth' => '2004-11-05',
                'gender' => 'Female', 'address' => '987 Cedar Ave, Paranaque', 'enrollment_date' => '2022-08-01',
                'program' => 'Bachelor of Science in Computer Science', 'year_level' => 2, 'status' => 'Active', 'gpa' => 2.85,
                'technical_skills' => ['Java', 'Python', 'HTML/CSS'],
                'other_skills' => ['Photography', 'Social Media Management'],
                'academic_histories' => [
                    ['semester' => '1st Semester 2023-2026', 'semester_gpa' => 2.9, 'courses' => [
                        ['courseCode' => 'CS201', 'courseName' => 'Object-Oriented Programming', 'units' => 3, 'grade' => 2.25, 'remarks' => 'Passed'],
                        ['courseCode' => 'CS202', 'courseName' => 'Discrete Mathematics', 'units' => 3, 'grade' => 2.5, 'remarks' => 'Passed'],
                    ]]
                ],
                'sports_skills' => [['sport' => 'Volleyball', 'level' => 'Beginner', 'height' => null, 'weight' => null, 'position' => null]],
                'affiliations' => [['organization' => 'Photography Club', 'role' => 'Member', 'join_date' => '2022-09-01', 'status' => 'Active']],
                'violations' => [
                    ['date' => '2023-09-12', 'type' => 'Plagiarism', 'description' => 'Submitted copied code', 'severity' => 'Major', 'resolution' => 'Required to retake'],
                    ['date' => '2023-11-08', 'type' => 'Disruptive Behavior', 'description' => 'Using phone during lecture', 'severity' => 'Minor', 'resolution' => 'Verbal warning issued']
                ],
                'activities' => [['name' => 'Campus Photo Exhibit', 'type' => 'Exhibition', 'date' => '2026-02-20', 'description' => 'Showcased photography work', 'award' => null]]
            ],
            [
                'first_name' => 'Mark', 'last_name' => 'Villanueva', 'student_number' => '2021-00045-MN',
                'email' => 'mark.villanueva@student.edu', 'phone' => '+63 916 333 4444', 'date_of_birth' => '2003-04-28',
                'gender' => 'Male', 'address' => '234 Willow St, Pasay', 'enrollment_date' => '2021-08-01',
                'program' => 'Bachelor of Science in Information Technology', 'year_level' => 3, 'status' => 'Active', 'gpa' => 3.15,
                'technical_skills' => ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Docker'],
                'other_skills' => ['DevOps', 'Cloud Computing'],
                'academic_histories' => [
                    ['semester' => '1st Semester 2023-2026', 'semester_gpa' => 3.2, 'courses' => [
                        ['courseCode' => 'IT301', 'courseName' => 'Systems Analysis and Design', 'units' => 3, 'grade' => 2.0, 'remarks' => 'Passed'],
                        ['courseCode' => 'IT302', 'courseName' => 'Web Technologies', 'units' => 3, 'grade' => 1.75, 'remarks' => 'Passed'],
                    ]]
                ],
                'sports_skills' => [
                    ['sport' => 'Table Tennis', 'level' => 'Advanced', 'height' => null, 'weight' => null, 'position' => null],
                    ['sport' => 'Badminton', 'level' => 'Intermediate', 'height' => null, 'weight' => null, 'position' => null]
                ],
                'affiliations' => [['organization' => 'IT Society', 'role' => 'Technical Officer', 'join_date' => '2022-08-01', 'status' => 'Active']],
                'violations' => [['date' => '2026-02-14', 'type' => 'Academic Dishonesty', 'description' => 'Unauthorized collaboration', 'severity' => 'Major', 'resolution' => 'Zero grade on assignment, academic probation']],
                'activities' => [['name' => 'DevOps Workshop', 'type' => 'Workshop', 'date' => '2023-12-15', 'description' => 'Conducted workshop on Docker and Kubernetes', 'award' => null]]
            ],
            [
                'first_name' => 'Patricia', 'last_name' => 'Cruz', 'student_number' => '2023-00018-MN',
                'email' => 'patricia.cruz@student.edu', 'phone' => '+63 917 444 5555', 'date_of_birth' => '2005-06-12',
                'gender' => 'Female', 'address' => '567 Birch Ln, Las Pinas', 'enrollment_date' => '2023-08-01',
                'program' => 'Bachelor of Science in Computer Science', 'year_level' => 1, 'status' => 'Suspended', 'gpa' => 2.25,
                'technical_skills' => ['Python', 'C++'],
                'other_skills' => ['Writing', 'Digital Art'],
                'academic_histories' => [
                    ['semester' => '1st Semester 2023-2026', 'semester_gpa' => 2.25, 'courses' => [
                        ['courseCode' => 'CS101', 'courseName' => 'Introduction to Programming', 'units' => 3, 'grade' => 2.75, 'remarks' => 'Passed'],
                        ['courseCode' => 'CS102', 'courseName' => 'Computer Fundamentals', 'units' => 3, 'grade' => 2.5, 'remarks' => 'Passed'],
                    ]]
                ],
                'sports_skills' => [],
                'affiliations' => [],
                'violations' => [
                    ['date' => '2026-01-25', 'type' => 'Cheating', 'description' => 'Caught using unauthorized materials during final exam', 'severity' => 'Critical', 'resolution' => 'Failed exam, suspended for one semester']
                ],
                'activities' => []
            ],
        ];

        foreach ($mockStudents as $data) {
            $student = Student::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'student_number' => $data['student_number'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'date_of_birth' => $data['date_of_birth'],
                'gender' => $data['gender'],
                'address' => $data['address'],
                'enrollment_date' => $data['enrollment_date'],
                'program' => $data['program'],
                'year_level' => $data['year_level'],
                'status' => $data['status'],
                'gpa' => $data['gpa'],
                'technical_skills' => $data['technical_skills'],
                'other_skills' => $data['other_skills'],
            ]);

            foreach ($data['academic_histories'] as $history) {
                $student->academicHistories()->create($history);
            }

            foreach ($data['sports_skills'] as $skill) {
                $student->sportsSkills()->create($skill);
            }

            foreach ($data['affiliations'] as $affil) {
                $student->affiliations()->create($affil);
            }

            foreach ($data['violations'] as $violation) {
                $student->violations()->create($violation);
            }

            foreach ($data['activities'] as $activity) {
                $student->activities()->create($activity);
            }
        }
    }
}
