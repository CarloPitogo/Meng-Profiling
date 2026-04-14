import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import {
  Users,
  BookOpen,
  MapPin,
  Clock,
  Search,
  ChevronRight,
  GraduationCap,
  ArrowLeft,
  CheckCircle,
  FileText,
  LayoutGrid,
  ClipboardList,
  ChevronDown,
  Trophy
} from 'lucide-react';
import { fetchWithAuth, useAuth, API_URL } from '../context/AuthContext';
import { Schedule, Student, Faculty, Course, Task, Submission } from '../types';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';

export function MyClasses() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [facultyInfo, setFacultyInfo] = useState<Faculty | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  // Detailed View State
  const [selectedClass, setSelectedClass] = useState<any | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // Get unique classes/sections for this faculty
  const mySchedules = schedules.filter(s => s.facultyId.toString() === facultyInfo?.id.toString());

  // Group by section and subject
  const myClasses = useMemo(() => {
    return mySchedules.reduce((acc: any[], current) => {
      const existing = acc.find(c => c.section === current.section && c.courseCode === current.courseCode);
      if (!existing) {
        const course = courses.find(cr => cr.code === current.courseCode);
        const studentsInSection = allStudents.filter(s => s.section === current.section);
        acc.push({
          ...current,
          courseName: course?.name || 'Unknown Course',
          studentCount: studentsInSection.length,
          students: studentsInSection
        });
      }
      return acc;
    }, []);
  }, [mySchedules, allStudents, courses]);

  const filteredClasses = myClasses.filter(c =>
    c.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const section = searchParams.get('section');
    const course = searchParams.get('course');
    const q = searchParams.get('search');

    if (q) setSearchTerm(q);

    // If we have specific class params, find and auto-select that class
    if (section && course && myClasses.length > 0) {
      const target = myClasses.find(c => c.section === section && c.courseCode === course);
      if (target) setSelectedClass(target);
    }
  }, [searchParams, myClasses]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [schRes, stuRes, facRes, crsRes] = await Promise.all([
          fetchWithAuth('/schedules'),
          fetchWithAuth('/students'),
          fetchWithAuth('/faculty'),
          fetchWithAuth('/courses')
        ]);

        if (schRes.ok && stuRes.ok && facRes.ok && crsRes.ok) {
          const schData = await schRes.json();
          const stuData = await stuRes.json();
          const facData = await facRes.json();
          const crsData = await crsRes.json();

          const list: Faculty[] = facData.data || [];
          const current = list.find(f => f.email === user?.email);

          setSchedules(schData.data || []);
          setAllStudents(stuData.data || []);
          setFacultyInfo(current || null);
          setCourses(crsData.data || []);

          // Also load tasks and submissions for grading view
          const [tasksRes, subRes] = await Promise.all([
            fetchWithAuth('/tasks'),
            fetchWithAuth('/submissions')
          ]);
          if (tasksRes.ok) {
            const data = await tasksRes.json();
            setTasks(data.data || []);
          }
          if (subRes.ok) {
            const data = await subRes.json();
            setSubmissions(data.data || []);
          }
        }
      } catch (error) {
        console.error('Error loading class data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  if (isLoading) return <div className="p-8 text-center text-xs font-black uppercase tracking-[0.3em] text-[#FF7F11] animate-pulse">Syncing Class Inventory...</div>;
  if (!facultyInfo) return <div className="p-8 text-center text-red-500 font-black uppercase">Faculty record not found.</div>;



  if (selectedClass) {
    const classTasks = tasks.filter(t => t.section === selectedClass.section && t.course_code === selectedClass.courseCode);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedClass(null)}
              className="rounded-xl border-gray-200 hover:bg-white hover:border-[#FF7F11] transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">
                {selectedClass.courseCode} - {selectedClass.courseName}
              </h1>
              <p className="text-xs font-black text-[#FF7F11] uppercase tracking-[0.2em] mt-1">Section {selectedClass.section} • Class Gradebook</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Summary Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: selectedClass.studentCount, icon: Users, color: 'blue' },
              { label: 'Assignments', value: classTasks.length, icon: FileText, color: 'orange' },
              { label: 'Compliance Rate', value: '85%', icon: CheckCircle, color: 'green' },
              { label: 'Class Average', value: '1.75', icon: Trophy, color: 'indigo' },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-sm bg-white p-4">
                <div className="flex items-center gap-4">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center",
                    stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                      stat.color === 'orange' ? "bg-orange-50 text-[#FF7F11]" :
                        stat.color === 'green' ? "bg-green-50 text-green-600" :
                          "bg-indigo-50 text-indigo-600"
                  )}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">{stat.label}</p>
                    <p className="text-xl font-black text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Student List & Grades */}
          <div className="lg:col-span-3">
            <Card className="border-none shadow-xl bg-white overflow-hidden rounded-[2rem]">
              <div className="bg-gray-50 border-b border-gray-100 p-6 flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Enrolled Student Performance</h3>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Synced Live</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">Student Name</th>
                      {classTasks.map(task => (
                        <th key={task.id} className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 min-w-[120px]">
                          {task.title.length > 15 ? task.title.substring(0, 15) + '...' : task.title}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selectedClass.students.map((student: Student) => (
                      <tr key={student.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center font-black text-indigo-600 text-[10px]">
                              {student.firstName[0]}{student.lastName[0]}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-gray-900">{student.firstName} {student.lastName}</p>
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{student.studentNumber}</p>
                            </div>
                          </div>
                        </td>
                        {classTasks.map(task => {
                          const sub = submissions.find(s => s.task_id?.toString() === task.id?.toString() && s.student_id?.toString() === student.id?.toString());
                          return (
                            <td key={task.id} className="py-4 px-6 text-center">
                              {sub ? (
                                <div className="flex flex-col items-center">
                                  <span className={cn(
                                    "text-sm font-black",
                                    sub.grade ? "text-green-600" : "text-orange-500"
                                  )}>
                                    {sub.grade || 'NG'}
                                  </span>
                                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">
                                    {sub.status}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center opacity-30">
                                  <span className="text-sm font-black text-gray-200">---</span>
                                  <span className="text-[8px] font-black text-gray-200 uppercase tracking-tighter">NO DATA</span>
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {selectedClass.students.length === 0 && (
                  <div className="py-20 text-center">
                    <Users className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">No students found for this section</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Classes & Sections</h1>
            <p className="text-sm text-gray-500 font-medium">Manage your active sections and student rosters</p>
          </div>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by section or subject code..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-[#FF7F11] focus:border-transparent transition-all outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClasses.map((cls, idx) => (
          <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-all overflow-hidden bg-white group">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white cursor-pointer" onClick={() => setSelectedClass(cls)}>
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/10">
                  {cls.courseCode}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-100">
                  <Users className="w-3.5 h-3.5" />
                  {cls.studentCount} Students
                </div>
              </div>
              <h3 className="text-xl font-black mb-1 group-hover:translate-x-1 transition-transform">{cls.courseName}</h3>
              <p className="text-blue-100 text-sm font-medium flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" />
                Section {cls.section}
              </p>
            </div>

            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Schedule</p>
                  <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5 pt-1">
                    <Clock className="w-3.5 h-3.5 text-[#FF7F11]" />
                    {cls.day} | {cls.timeStart}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Location</p>
                  <p className="text-xs font-bold text-gray-700 flex items-center gap-1.5 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF7F11]" />
                    {cls.room}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enrolled Students</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedClass(cls)}
                    className="h-6 text-[10px] font-black text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    VIEW ROSTER & GRADES
                  </Button>
                </div>
                <div className="flex -space-x-2">
                  {cls.students.slice(0, 5).map((s: Student, i: number) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600 shadow-sm" title={`${s.firstName} ${s.lastName}`}>
                      {s.firstName[0]}{s.lastName[0]}
                    </div>
                  ))}
                  {cls.studentCount > 5 && (
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-black text-[#FF7F11] shadow-sm">
                      +{cls.studentCount - 5}
                    </div>
                  )}
                  {cls.studentCount === 0 && (
                    <p className="text-[10px] text-gray-400 italic">No students enrolled yet</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredClasses.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <h3 className="text-gray-400 font-medium">No handled classes found Matching your search.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
