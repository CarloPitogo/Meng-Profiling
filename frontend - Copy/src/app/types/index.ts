export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  email: string;
  phone: string;
  photo?: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  enrollmentDate: string;
  program: string;
  section?: string;
  yearLevel: number;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
  
  // Academic
  gpa: number;
  academicHistory: AcademicRecord[];
  
  // Skills
  technicalSkills: string[];
  sportsSkills: SportSkill[];
  otherSkills: string[];
  
  // Affiliations
  affiliations: Affiliation[];
  
  // Violations
  violations: Violation[];
  
  // Non-academic
  nonAcademicActivities: Activity[];
}

export interface AcademicRecord {
  id: string;
  semester: string;
  courses: CourseGrade[];
  semesterGPA: number;
}

export interface CourseGrade {
  courseCode: string;
  courseName: string;
  units: number;
  grade: number;
  remarks: string;
}

export interface SportSkill {
  sport: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Varsity' | string;
  height?: number | string; // e.g. 180 or "5'11"
  weight?: number | string; // e.g. 75 or "160 lbs"
  position?: string;
}

export interface Affiliation {
  id?: string;
  organization: string;
  role: string;
  joinDate: string;
  status: 'Active' | 'Inactive';
}

export interface Violation {
  id?: string;
  date: string;
  type: string;
  description: string;
  severity: 'Minor' | 'Major' | 'Critical' | string;
  resolution: string;
  suspendedUntil?: string;
}

export interface Activity {
  id: string;
  name: string;
  type: string;
  date: string;
  description: string;
  award?: string;
}

export interface Faculty {
  id: string;
  firstName: string;
  lastName: string;
  employeeNumber: string;
  email: string;
  phone: string;
  photo?: string;
  department: string;
  position: string;
  specialization: string[];
  status: 'Active' | 'On Leave' | 'Inactive';
  coursesTeaching: string[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  units: number;
  program: string;
  yearLevel: number;
  semester: string;
}

export interface Syllabus {
  id: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  semester: string;
  description: string;
  objectives: string[];
  topics: Topic[];
  gradingSystem: GradingCriteria[];
}

export interface Topic {
  week: number;
  title: string;
  description: string;
  learningOutcomes: string[];
}

export interface GradingCriteria {
  component: string;
  percentage: number;
}

export interface Schedule {
  id: string;
  courseCode: string;
  section: string;
  facultyId: string;
  room: string;
  day: string;
  timeStart: string;
  timeEnd: string;
  type: 'Lecture' | 'Laboratory';
}

export interface Event {
  id: string;
  name: string;
  type: 'Curricular' | 'Extra-Curricular';
  category: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  organizer: string;
  targetParticipants: string[];
  registrationRequired: boolean;
}

export interface Announcement {
  id?: string;
  title: string;
  content: string;
  type: 'important' | 'event' | 'warning' | 'success' | 'info' | string;
  date: string;
  author: string;
  created_at?: string;
  updated_at?: string;
}

export interface Task {
  id: string;
  faculty_id: string;
  section: string;
  course_code: string;
  title: string;
  description: string;
  due_date: string;
  status: 'Open' | 'Closed';
  faculty?: Faculty;
  created_at: string;
}

export interface Submission {
  id: string;
  task_id: string;
  student_id: string;
  file_path?: string;
  submission_link?: string;
  submitted_at: string;
  status: 'Submitted' | 'Late' | 'Graded';
  grade?: string;
  student?: Student;
  task?: Task;
}
