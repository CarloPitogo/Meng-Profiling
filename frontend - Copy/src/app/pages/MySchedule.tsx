import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { fetchWithAuth } from '../context/AuthContext';
import { Student, Schedule, Faculty } from '../types';
import { useAuth } from '../context/AuthContext';
import { Clock, Calendar as CalendarIcon, AlertCircle, MapPin, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const START_HOUR = 7; // 7 AM
const END_HOUR = 21; // 9 PM
const ROW_HEIGHT = 45; // Reduced from 60px to 45px for better fit

export function MySchedule() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsRes, schedulesRes, facultyRes] = await Promise.all([
          fetchWithAuth('/students'),
          fetchWithAuth('/schedules'),
          fetchWithAuth('/faculty')
        ]);

        if (studentsRes.ok && schedulesRes.ok && facultyRes.ok) {
          const studentsData = await studentsRes.json();
          const schedulesData = await schedulesRes.json();
          const facultyData = await facultyRes.json();

          const currentStudentProfile = studentsData.data.find((s: Student) => s.email === user?.email);
          setStudent(currentStudentProfile || null);
          setSchedules(schedulesData.data || []);
          setFaculty(facultyData.data || []);
        } else {
          toast.error("Failed to fetch schedule data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  const parseTime = (timeStr: string) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours + minutes / 60;
  };

  const calculatePosition = (startTime: string, endTime: string) => {
    const start = parseTime(startTime);
    const end = parseTime(endTime);
    const top = (start - START_HOUR) * ROW_HEIGHT;
    const height = (end - start) * ROW_HEIGHT;
    return { top, height };
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading your schedule...</div>;
  }

  if (!student) {
    return <div className="p-8 text-center text-gray-500">Student profile not found. Please contact administration.</div>;
  }

  const isEnrolled = !!student.enrollmentDate;
  
  if (!isEnrolled || !student.section) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <CalendarIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#FF7F11] tracking-tight">
              My Schedule
            </h1>
            <p className="text-sm text-gray-500 font-medium font-sans mt-0.5">
              View your enrolled block section and subjects
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-l-4 border-l-orange-500">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <AlertCircle className="w-16 h-16 text-orange-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Yet Enrolled</h2>
            <p className="text-gray-600 max-w-md">
              You are currently not enrolled in any block section for the active semester. Please head over to your Dashboard to process your enrollment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const mySchedules = schedules.filter(s => s.section === student.section);

  const getProfessorName = (facultyId: string) => {
    const prof = faculty.find(f => f.id === facultyId || f.id.toString() === facultyId);
    return prof ? `${prof.firstName} ${prof.lastName}` : 'TBA';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <CalendarIcon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#FF7F11] tracking-tight">
              My Schedule
            </h1>
            <p className="text-sm text-gray-500 font-medium font-sans mt-0.5">
              A.Y. 2026-2027 | Block Section: <span className="font-bold text-gray-800">{student.section}</span>
            </p>
          </div>
        </div>
      </div>

      <Card className="shadow-2xl overflow-hidden border-none rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-[#FF7F11] to-orange-600 text-white p-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Clock className="w-5 h-5" />
            Weekly Academic Calendar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          <div className="overflow-x-auto">
            <div className="w-full min-w-[700px] relative">
              {/* Header: Days */}
              <div className="grid grid-cols-[70px_repeat(7,1fr)] border-b bg-gray-50">
                <div className="p-2 border-r"></div>
                {DAYS.map(day => (
                  <div key={day} className="p-2 text-center text-xs font-bold text-gray-700 border-r last:border-r-0">
                    {day.substring(0, 3)}
                  </div>
                ))}
              </div>

              {/* Grid Body */}
              <div className="relative" style={{ height: (END_HOUR - START_HOUR) * ROW_HEIGHT }}>
                {/* Time Labels & Horizontal Lines */}
                {Array.from({ length: END_HOUR - START_HOUR + 1 }).map((_, i) => {
                  const hour = START_HOUR + i;
                  const displayHour = hour > 12 ? hour - 12 : hour;
                  const ampm = hour >= 12 ? 'PM' : 'AM';
                  return (
                    <div key={hour} className="absolute w-full border-b flex" style={{ top: i * ROW_HEIGHT, height: ROW_HEIGHT }}>
                      <div className="w-[70px] -mt-2 pr-2 text-right text-[10px] font-semibold text-gray-400">
                        {displayHour} {ampm}
                      </div>
                      <div className="flex-1 border-l grid grid-cols-7">
                        {Array.from({ length: 7 }).map((_, j) => (
                           <div key={j} className="border-r last:border-r-0 h-full bg-gray-50/10"></div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Schedule Blocks */}
                {mySchedules.map((sched, idx) => {
                  const dayOffset = DAYS.indexOf(sched.day);
                  if (dayOffset === -1) return null;

                  const { top, height } = calculatePosition(sched.timeStart, sched.timeEnd);
                  const columnWidth = `calc((100% - 70px) / 7)`;
                  const left = `calc(70px + (${dayOffset} * ${columnWidth}))`;

                  return (
                    <div 
                      key={idx}
                      className="absolute p-1 overflow-hidden transition-all hover:scale-[1.01] hover:z-20 group"
                      style={{ 
                        top: top + 1, 
                        height: height - 2, 
                        left: left, 
                        width: `calc(${columnWidth} - 2px)`,
                        marginLeft: '1px'
                      }}
                    >
                      <div className={`h-full w-full rounded-lg border shadow-sm p-2 flex flex-col justify-between ${
                        sched.type === 'Laboratory' 
                          ? 'bg-purple-50 border-purple-200 text-purple-900 shadow-purple-100' 
                          : 'bg-blue-50 border-blue-200 text-blue-900 shadow-blue-100'
                      }`}>
                        <div>
                          <p className="font-extrabold text-[8px] mb-0.5 uppercase tracking-wider opacity-60 line-clamp-1">{sched.type}</p>
                          <h4 className="font-bold text-[10px] leading-tight group-hover:underline line-clamp-2">{sched.courseCode}</h4>
                        </div>
                        
                        <div className="space-y-0.5 mt-auto">
                          <div className="flex items-center gap-1 text-[9px] font-medium opacity-80">
                            <MapPin className="w-2.5 h-2.5 text-orange-500" />
                            <span className="truncate">{sched.room}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] font-medium opacity-80">
                            <UserIcon className="w-2.5 h-2.5 text-orange-500" />
                            <span className="truncate">{getProfessorName(sched.facultyId)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full text-blue-700 text-xs font-bold">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
          Lecture Classes
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-100 rounded-full text-purple-700 text-xs font-bold">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
          Laboratory Classes
        </div>
      </div>
    </div>
  );
}
