import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Search, Eye, Filter, Plus, Users } from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithAuth } from '../context/AuthContext';
import { Student } from '../types';
import { StudentModal } from '../components/StudentModal';

export function Students() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [skillFilter, setSkillFilter] = useState('');

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (skillFilter.trim()) {
          queryParams.append('skill', skillFilter.trim());
        }

        const response = await fetchWithAuth(`/students?${queryParams.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch students');

        const data = await response.json();

        // 🔴 EXAM REQUIREMENT: Output the Raw Database Query 🔴
        if (data.meta && data.meta.executed_database_queries) {
          console.log("%c----- [LAB EXAM] BACKEND DATABASE QUERY EXECUTED -----", "color: #ff7f11; font-weight: bold; font-size: 14px;");
          console.log("Skill Filter Mode:", data.meta.is_active_skill_filter ? "ACTIVE" : "INACTIVE");
          console.log("Captured SQL Queries:", data.meta.executed_database_queries);
          console.log("-------------------------------------------------------");
        }

        setStudents(data.data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students');
      } finally {
        setIsLoading(false);
      }
    };

    // Tiny debounce for smooth typing query requests
    const timeoutId = setTimeout(() => {
      loadStudents();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [skillFilter]);

  // Levenshtein distance for fuzzy matching
  const levenshtein = (a: string, b: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        const cost = a[j - 1] === b[i - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return matrix[b.length][a.length];
  };

  const fuzzyMatchSkill = (skill: string, query: string): boolean => {
    const s = skill.toLowerCase();
    const q = query.toLowerCase().trim();
    if (!q) return false;
    // Exact substring match
    if (s.includes(q)) return true;
    // Fuzzy: allow up to 2 edits for short queries, scale for longer
    const tolerance = q.length <= 3 ? 1 : 2;
    // Check against the skill itself or each word in a multi-word skill
    const words = s.split(/\s+/);
    for (const word of words) {
      if (levenshtein(word, q) <= tolerance) return true;
    }
    // Also check if the full skill name is close enough
    if (levenshtein(s, q) <= tolerance) return true;
    return false;
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
    const matchesProgram = programFilter === 'All' || student.program === programFilter;

    // We removed the frontend matchesSkill because the backend directly manages the SQL data filtering

    return matchesSearch && matchesStatus && matchesProgram;
  });

  const programs = Array.from(new Set(students.map(s => s.program)));

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading students from database...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#FF7F11] tracking-tight">
              Student Management
            </h1>
            <p className="text-sm text-gray-500 font-medium font-sans mt-0.5">
              Manage and view all student records in the system
            </p>
          </div>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#FF7F11] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg px-6 py-6 rounded-xl font-bold transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Student
        </Button>
      </div>

      {/* Search and Filter */}
      <Card className="mb-6 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find students by name, ID, or program</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, student number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Filter by skill (e.g. React, Git)"
                value={skillFilter}
                onChange={(e) => setSkillFilter(e.target.value)}
                className="pl-10 w-56"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="Graduated">Graduated</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={programFilter} onValueChange={setProgramFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Programs</SelectItem>
                {programs.map(program => (
                  <SelectItem key={program} value={program}>{program}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredStudents.length} of {students.length} students
        </p>
      </div>

      {/* Student List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {student.firstName[0]}{student.lastName[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {student.firstName} {student.lastName}
                      </h3>
                      <Badge variant={student.status === 'Active' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Student Number:</span>
                        <span className="ml-2 text-gray-900">{student.studentNumber}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Program:</span>
                        <span className="ml-2 text-gray-900">{student.program}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Year Level:</span>
                        <span className="ml-2 text-gray-900">{student.yearLevel}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Enrollment:</span>
                        <span className={`ml-2 font-semibold ${student.enrollmentDate ? 'text-green-600' : 'text-orange-500'}`}>
                          {student.enrollmentDate ? 'Enrolled' : 'Not Enrolled'}
                        </span>
                      </div>
                      {student.enrollmentDate && student.section && (
                      <div>
                        <span className="text-gray-500">Section:</span>
                        <span className="ml-2 text-gray-900 font-semibold">{student.section}</span>
                      </div>
                      )}
                      <div>
                        <span className="text-gray-500">GPA:</span>
                        <span className="ml-2 font-semibold text-blue-600">{student.gpa.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <span className="ml-2 text-gray-900">{student.email}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2 text-gray-900">{student.phone}</span>
                      </div>
                    </div>

                    {/* Skills Preview */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {[...(student.technicalSkills || [])].slice(0, 6).map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className={`text-xs ${skillFilter.trim() && fuzzyMatchSkill(skill, skillFilter)
                              ? 'bg-green-100 border-green-400 text-green-700'
                              : ''
                            }`}
                        >
                          {skill}
                        </Badge>
                      ))}
                      {(student.technicalSkills || []).length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{student.technicalSkills.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <Link to={`/students/${student.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={async (data) => {
          toast.success('Adding student to database...');
          try {
            const response = await fetchWithAuth('/students', {
              method: 'POST',
              body: JSON.stringify(data)
            });

            if (response.status === 422) {
              const errData = await response.json();
              if (errData.errors) {
                // Laravel typically returns { message: "...", errors: { email: ["The email has already been taken."] } }
                const errorMessages = Object.values(errData.errors).flat().join(' ');
                toast.error(`Validation Error: ${errorMessages}`);
              } else {
                toast.error(errData.message || 'Validation failed.');
              }
              return;
            }

            if (!response.ok) throw new Error('Failed to create student in backend');

            const result = await response.json();
            setStudents((prev) => [result.data, ...prev]);
            setIsModalOpen(false);
            toast.success('Student added successfully!');
          } catch (error) {
            console.error('Error creating student:', error);
            toast.error('Failed to add student to the database');
          }
        }}
      />
    </div>
  );
}