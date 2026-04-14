import { useState, useEffect, useRef } from 'react';
import { fetchWithAuth } from '../context/AuthContext';
import { Student, Schedule, Faculty } from '../types';
import { useAuth } from '../context/AuthContext';
import { Printer, Download, GraduationCap, Clock, MapPin, User as UserIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';

export function RegistrationForm() {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

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
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) loadData();
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div className="p-8 text-center">Generating Registration Form...</div>;
  if (!student || !student.enrollmentDate) {
    return (
      <div className="p-8 text-center max-w-lg mx-auto">
        <div className="bg-orange-50 border border-orange-200 p-8 rounded-2xl shadow-sm">
          <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Registration Not Found</h2>
          <p className="text-gray-600 mb-6">You must complete your enrollment before you can view your Certificate of Registration.</p>
          <Button onClick={() => window.location.href = '/'} className="bg-[#FF7F11] hover:bg-orange-600">Back to Dashboard</Button>
        </div>
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
      <div className="flex items-center justify-between no-print mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Registration Form (COR)</h1>
          <p className="text-gray-500">Official Certificate of Registration for A.Y. 2026-2027</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      <style>
        {`
          @media print {
            .no-print { display: none !important; }
            
            /* Hide the sidebar and any other layout fixed elements */
            div.fixed.inset-y-0.left-0 { display: none !important; }
            
            /* Reset the margin of the main content area */
            div.ml-64 { margin-left: 0 !important; }
            
            /* Ensure the form takes full width */
            body { background: white !important; margin: 0; padding: 0; }
            .print-container { 
              width: 100% !important; 
              max-width: 100% !important;
              margin: 0 !important; 
              padding: 0 !important;
              box-shadow: none !important;
              border: none !important;
              border-radius: 0 !important;
            }
            main { padding: 0 !important; }
          }
        `}
      </style>

      <Card className="print-container max-w-[850px] mx-auto shadow-2xl border-gray-100 overflow-hidden bg-white">
        <CardContent className="p-10 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#FF7F11] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#FF7F11] rounded-2xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">CCS PROFILING SYSTEM</h2>
                <p className="text-sm font-bold text-[#FF7F11]">College of Computing Studies</p>
                <p className="text-[10px] text-gray-400 font-medium">Panpacific University | School Year 2026-2027</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase mb-2">
                OFFICIALLY ENROLLED
              </div>
              <p className="text-xs text-gray-500">Reference No: <span className="font-mono font-bold text-gray-800">PU-{student.id.toString().padStart(6, '0')}</span></p>
              <p className="text-xs text-gray-500 uppercase">Date: {new Date(student.enrollmentDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Student Info Grid */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-12">
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Student Name</p>
              <p className="text-sm font-bold text-gray-900 uppercase">{student.firstName} {student.middleName} {student.lastName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Student Number</p>
              <p className="text-sm font-bold text-gray-900">{student.studentNumber}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Academic Program</p>
              <p className="text-sm font-bold text-gray-900">{student.program}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] uppercase font-bold text-gray-400">Year Level & Section</p>
              <p className="text-sm font-bold text-gray-900">Year {student.yearLevel} - Block <span className="bg-orange-100 px-2 py-0.5 rounded text-[#FF7F11]">{student.section}</span></p>
            </div>
          </div>

          {/* Subjects Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-l-4 border-[#FF7F11] pl-3 py-1">
               <h3 className="font-bold text-gray-900 uppercase text-xs tracking-widest">Enrolled Subject Units</h3>
            </div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-y border-gray-100">
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase">Code</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase">Type</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase">Schedule & Room</th>
                  <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase">Professor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mySchedules.map((sched, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 text-xs font-bold text-gray-800">{sched.courseCode}</td>
                    <td className="py-3 px-4 text-[10px] font-medium text-gray-500 uppercase">{sched.type}</td>
                    <td className="py-3 px-4">
                      <div className="text-xs font-semibold text-gray-700">{sched.day} | {sched.timeStart} - {sched.timeEnd}</div>
                      <div className="text-[10px] text-[#FF7F11] font-bold uppercase">{sched.room}</div>
                    </td>
                    <td className="py-3 px-4 text-xs font-medium text-gray-700">{getProfessorName(sched.facultyId)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-bold">
                  <td colSpan={2} className="py-4 px-4 text-xs text-gray-600">Total Academic Subjects:</td>
                  <td colSpan={2} className="py-4 px-4 text-right text-xs text-gray-900">{mySchedules.length} Items Loaded</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Signatures / Footer */}
          <div className="pt-12 grid grid-cols-2 gap-20">
            <div className="text-center space-y-2">
              <div className="border-b border-gray-300 pb-2 font-bold text-sm uppercase">{student.firstName} {student.lastName}</div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Student's Signature</p>
            </div>
            <div className="text-center space-y-2">
              <div className="border-b border-gray-300 pb-2 font-bold text-sm uppercase">CCS REGISTRAR</div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Authorized Official Signature</p>
            </div>
          </div>

          <div className="pt-8 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] text-gray-400 font-medium italic">
               <CheckCircle2 className="w-3 h-3 text-green-500" />
               This document was system-generated and is officially validated for A.Y. 2026-2027.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
