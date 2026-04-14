import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  BookMarked, 
  Search, 
  MapPin, 
  Clock, 
  User as UserIcon,
  Info,
  BookOpen
} from 'lucide-react';
import { fetchWithAuth, useAuth } from '../context/AuthContext';
import { Student, Schedule, Course, Faculty } from '../types';

export function MySubjects() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [schRes, stuRes, crsRes, facRes] = await Promise.all([
          fetchWithAuth('/schedules'),
          fetchWithAuth('/students'),
          fetchWithAuth('/courses'),
          fetchWithAuth('/faculty')
        ]);

        if (schRes.ok && stuRes.ok && crsRes.ok && facRes.ok) {
          const schData = await schRes.json();
          const stuData = await stuRes.json();
          const crsData = await crsRes.json();
          const facData = await facRes.json();

          const current = (stuData.data || []).find((s: Student) => s.email === user?.email);
          setStudent(current || null);
          setSchedules(schData.data || []);
          setCourses(crsData.data || []);
          setFaculty(facData.data || []);
        }
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  if (isLoading) return <div className="p-8 text-center text-gray-400 text-xs uppercase font-black tracking-widest">Loading Academic Portfolio...</div>;
  if (!student) return <div className="p-8 text-center">Student profile not found.</div>;

  const mySchedules = schedules.filter(s => s.section === student.section);
  
  // Map schedules to unique courses with extra info
  const mySubjects = mySchedules.reduce((acc: any[], sched) => {
    const exists = acc.find(s => s.code === sched.courseCode);
    if (!exists) {
      const courseInfo = courses.find(c => c.code === sched.courseCode);
      const prof = faculty.find(f => f.id.toString() === sched.facultyId.toString());
      acc.push({
        ...courseInfo,
        code: sched.courseCode,
        type: sched.type,
        schedules: mySchedules.filter(s => s.courseCode === sched.courseCode),
        facultyName: prof ? `${prof.firstName} ${prof.lastName}` : 'TBA'
      });
    }
    return acc;
  }, []);

  const filteredSubjects = mySubjects.filter(s => 
    s.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <BookMarked className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Subjects</h1>
            <p className="text-sm text-gray-500 font-medium">Your academic course load for <span className="text-[#FF7F11] font-bold">A.Y. 2026-2027</span></p>
          </div>
        </div>
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search course code or name..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-[#FF7F11] outline-none transition-all placeholder:text-gray-300 font-medium text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSubjects.map((sub, idx) => (
          <Card key={idx} className="border-none shadow-lg hover:shadow-xl transition-all rounded-2xl overflow-hidden group bg-white border-l-4 border-l-[#FF7F11]">
            <CardContent className="p-0">
               <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-3">
                     <Badge className="bg-orange-100 text-[#FF7F11] border-none px-3 py-1 text-[10px] font-black uppercase tracking-widest">{sub.code}</Badge>
                     <div className="flex items-center gap-1.5 text-xs font-black text-gray-400">
                        <BookOpen className="w-3.5 h-3.5" />
                        {sub.units || 3} UNITS
                     </div>
                  </div>
                  <h3 className="text-xl font-black text-gray-900 group-hover:text-[#FF7F11] transition-colors mb-2 line-clamp-1">{sub.name || 'Subject Name'}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed h-[40px] mb-4">
                    {sub.description || 'No course description available at this moment. Please check the course syllabus for more information.'}
                  </p>
               </div>
               
               <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-50 space-y-3">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg border border-gray-100">
                           <UserIcon className="w-3.5 h-3.5 text-blue-500" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Instructor</span>
                           <span className="text-xs font-bold text-gray-700">{sub.facultyName}</span>
                        </div>
                     </div>
                     <Badge variant="outline" className="text-[9px] font-bold uppercase">{sub.type}</Badge>
                  </div>

                  <div className="space-y-2">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Schedule Details</p>
                     <div className="grid grid-cols-1 gap-1.5">
                        {sub.schedules.map((s: any, si: number) => (
                           <div key={si} className="bg-white p-2 rounded-lg border border-gray-50 flex items-center justify-between shadow-sm">
                              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-600">
                                 <Clock className="w-3 h-3 text-[#FF7F11]" />
                                 {s.day.substring(0,3)} {s.timeStart} - {s.timeEnd}
                              </div>
                              <div className="flex items-center gap-1 text-[10px] font-bold text-[#FF7F11]">
                                 <MapPin className="w-3 h-3" />
                                 {s.room}
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            </CardContent>
          </Card>
        ))}
        {filteredSubjects.length === 0 && (
          <div className="col-span-full py-20 text-center flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Info className="w-8 h-8 text-gray-200" />
             </div>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No subjects found in your curriculum</p>
          </div>
        )}
      </div>
    </div>
  );
}
