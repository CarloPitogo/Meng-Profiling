import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Users, 
  GraduationCap, 
  Award, 
  TrendingUp, 
  Calendar, 
  Megaphone,
  CheckCircle2,
  AlertCircle,
  PartyPopper,
  Clock,
  ArrowRight,
  MapPin,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { useAuth, fetchWithAuth } from '../context/AuthContext';
import { Student, Schedule, Faculty } from '../types';
import { EnrollmentModal } from '../components/EnrollmentModal';
import { toast } from 'sonner';

export function Dashboard() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [studentsRes, schedulesRes, facultyRes] = await Promise.all([
          fetchWithAuth('/students'),
          fetchWithAuth('/schedules'),
          fetchWithAuth('/faculty')
        ]);
        if (studentsRes.ok) {
          const data = await studentsRes.json();
          setStudents(data.data || []);
        }
        if (schedulesRes.ok) {
          const data = await schedulesRes.json();
          setSchedules(data.data || []);
        }
        if (facultyRes.ok) {
          const data = await facultyRes.json();
          setFaculty(data.data || []);
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const activeStudents = students.filter((s) => s.status === "Active");
  const stats = [
    {
      title: "Total Students",
      value: students.length,
      icon: Users,
      trend: "+4.5%",
      description: "Active enrollment",
      color: "blue"
    },
    {
      title: "Graduation Rate",
      value: "94%",
      icon: GraduationCap,
      trend: "+2.1%",
      description: "Academic success",
      color: "green"
    },
    {
      title: "Active Skills",
      value: "156",
      icon: Award,
      trend: "+12",
      description: "Technical competencies",
      color: "purple"
    },
    {
      title: "Avg. GPA",
      value: students.length > 0
        ? (students.reduce((sum, s) => sum + s.gpa, 0) / students.length).toFixed(2)
        : "0.00",
      icon: TrendingUp,
      trend: "+0.2",
      description: "Overall performance",
      color: "orange"
    },
  ];

  const announcements = [
    {
      id: 1,
      title: "Midterm Examinations",
      content: "Examination schedule for midterm has been released. Please check your portals.",
      date: "2026-04-15",
      author: "Registrar"
    },
    {
      id: 2,
      title: "CCS Week 2026",
      content: "Join us for a week of tech talks, competitions, and networking events!",
      date: "2026-04-20",
      author: "CCS Student Council"
    }
  ];

  const events = [
    {
      id: 1,
      name: "Hackathon 2026",
      date: "Apr 25",
      venue: "CCS Lab 1",
      type: "Competition"
    },
    {
      id: 2,
      name: "IT Seminar",
      date: "May 2",
      venue: "University Hall",
      type: "Seminar"
    }
  ];

  const currentStudentProfile = user?.role === 'student' ? students.find(s => s.email === user?.email) : null;
  const isEnrolled = !!currentStudentProfile?.enrollmentDate;

  const handleEnroll = async (data: Partial<Student>) => {
    if (!currentStudentProfile) return;
    toast.success('Processing enrollment application...');
    try {
      const response = await fetchWithAuth(`/students/${currentStudentProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...currentStudentProfile, ...data })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to complete enrollment processing in backend');
      }
      
      const result = await response.json();
      setStudents(students.map(s => s.id === result.data.id ? result.data : s));
      setIsEnrollModalOpen(false);
      toast.success('Successfully Enrolled for the Academic Year!');
    } catch (error: any) {
      toast.error(error.message || 'Enrollment failed. Please try again.');
    }
  };

  const AnnouncementsAndEvents = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b py-3 px-4">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <Megaphone className="w-4 h-4 text-[#FF7F11]" />
            Recent Announcements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-3 bg-white rounded-lg border border-gray-100 hover:border-orange-200 transition-all cursor-default">
                <p className="font-bold text-gray-900 text-sm">{ann.title}</p>
                <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">{ann.content}</p>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">By {ann.author}</p>
                  <p className="text-[9px] text-gray-400 font-medium">{new Date(ann.date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b py-3 px-4">
          <CardTitle className="flex items-center gap-2 text-sm font-bold">
            <PartyPopper className="w-5 h-5 text-purple-600" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
                <div className="w-10 h-10 bg-purple-50 rounded-md flex flex-col items-center justify-center border border-purple-100 shrink-0">
                  <span className="text-[8px] font-bold text-purple-400 uppercase">{event.date.split(' ')[0]}</span>
                  <span className="text-xs font-black text-purple-600 leading-none">{event.date.split(' ')[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 text-xs truncate">{event.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-500 font-medium">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-400"/> {event.venue}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[8px] uppercase">{event.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return <div className="p-8 text-center text-gray-400 text-sm">Synchronizing portal...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Compact Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 flex-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-orange-50 text-orange-600 rounded-md text-[9px] font-black tracking-widest uppercase mb-3 border border-orange-100">
            <Sparkles className="w-3 h-3" />
            Active
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-1">
            Welcome back, <span className="bg-gradient-to-r from-[#FF7F11] to-orange-600 bg-clip-text text-transparent">{user?.name}!</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium max-w-lg opacity-80">
            {user?.role === 'admin' 
              ? "Administrator Dashboard | College of Computing Studies"
              : user?.role === 'faculty'
              ? "Manage your classes and student academic performance."
              : "Access your academic records and departmental activities."}
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
          <div className="text-right">
            <span className="block text-[8px] uppercase font-black text-gray-400 tracking-widest mb-0.5">AY 2026-2027</span>
            <span className="text-sm font-bold text-gray-800 tracking-tight">First Semester</span>
          </div>
          <div className="w-[1px] h-6 bg-gray-200"></div>
          <Clock className="w-5 h-5 text-orange-400" />
        </div>
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-48 h-48 bg-orange-50/50 rounded-full blur-3xl"></div>
      </div>

      {user?.role === 'student' && (
        <div className="space-y-6">
           {/* Compact Enrollment Card */}
           <Card className={`relative overflow-hidden border border-gray-100 shadow-sm rounded-2xl ${isEnrolled ? 'bg-green-50/30' : 'bg-orange-50/30'}`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isEnrolled ? 'bg-green-500 text-white' : 'bg-[#FF7F11] text-white'}`}>
                    {isEnrolled ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {isEnrolled ? 'Officially Enrolled' : 'Ready to Enroll?'}
                    </h2>
                    <p className="text-gray-500 font-medium text-xs mt-0.5">
                      {isEnrolled 
                        ? `Section ${currentStudentProfile?.section} • ${currentStudentProfile?.program}` 
                        : 'Submit your enrollment for A.Y. 2026-2027 today.'}
                    </p>
                  </div>
                </div>
                {!isEnrolled && (
                  <Button 
                    onClick={() => setIsEnrollModalOpen(true)}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-2 h-10 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                  >
                    Start Enrollment
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
          <AnnouncementsAndEvents />
        </div>
      )}

      {user?.role === 'faculty' && (
        <div className="space-y-6">
          <AnnouncementsAndEvents />
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="space-y-6">
          {/* Compact Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title} className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl cursor-default group bg-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${
                      stat.color === 'blue' ? 'bg-blue-50 text-blue-500' : 
                      stat.color === 'green' ? 'bg-green-50 text-green-500' : 
                      stat.color === 'purple' ? 'bg-purple-50 text-purple-500' : 
                      'bg-orange-50 text-orange-500'
                    }`}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider">{stat.trend}</span>
                  </div>
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.title}</h3>
                  <p className="text-xl font-bold text-gray-900 leading-none mt-1">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="shadow-sm border-gray-100 rounded-2xl overflow-hidden bg-white">
            <CardHeader className="bg-gray-50/50 border-b py-3 px-6">
              <CardTitle className="text-sm font-bold text-gray-700">Active Student Roster</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-xs">
                    <thead className="bg-gray-50/50 text-[9px] uppercase tracking-widest font-bold text-gray-400">
                      <tr>
                        <th className="px-6 py-3">Student Name</th>
                        <th className="px-6 py-3">Course</th>
                        <th className="px-6 py-3 text-center">GPA</th>
                        <th className="px-6 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {activeStudents.slice(0, 5).map(s => (
                        <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                               <div className="w-6 h-6 rounded-full bg-orange-100 text-[#FF7F11] flex items-center justify-center text-[9px] font-bold">
                                 {s.firstName[0]}{s.lastName[0]}
                               </div>
                               <span className="font-semibold text-gray-800">{s.firstName} {s.lastName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 uppercase font-medium text-[10px]">{s.program}</td>
                          <td className="px-6 py-4 font-bold text-gray-900 text-center">{s.gpa.toFixed(2)}</td>
                          <td className="px-6 py-4 text-right">
                             <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 text-[9px] font-bold uppercase rounded-md">
                               <div className="w-1 h-1 rounded-full bg-green-500"></div>
                               Active
                             </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                 </table>
               </div>
            </CardContent>
          </Card>
        </div>
      )}

      {user?.role === 'student' && (
        <EnrollmentModal
          isOpen={isEnrollModalOpen}
          onClose={() => setIsEnrollModalOpen(false)}
          student={currentStudentProfile || null}
          onEnroll={handleEnroll}
          schedules={schedules}
          faculty={faculty}
        />
      )}
    </div>
  );
}