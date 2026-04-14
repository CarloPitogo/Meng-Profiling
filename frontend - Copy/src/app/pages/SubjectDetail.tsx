import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { 
  ClipboardList, 
  Megaphone, 
  Clock, 
  MapPin, 
  User as UserIcon,
  ChevronLeft,
  Calendar,
  BookOpen,
  Info,
  FileText,
  AlertCircle,
  Book,
  Video,
  LayoutGrid,
  Trophy,
  ArrowRight,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  X,
  Eye,
  Download,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { fetchWithAuth, useAuth, API_URL } from '../context/AuthContext';
import { Task, Announcement, Schedule, Course, Faculty, Student } from '../types';
import { cn } from '../components/ui/utils';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../components/ui/dialog";

export function SubjectDetail() {
  const { code } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ASSIGNMENTS');

  // Submission State (For Students)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionData, setSubmissionData] = useState({
    file: null as File | null,
    link: ''
  });

  // Review State (For Faculty)
  const [viewingSubmissionsTask, setViewingSubmissionsTask] = useState<Task | null>(null);
  const [taskSubmissions, setTaskSubmissions] = useState<any[]>([]);
  const [loadingTaskSubmissions, setLoadingTaskSubmissions] = useState(false);

  const tabs = [
    { id: 'ASSIGNMENTS', label: 'ASSIGNMENTS' },
    { id: 'QUIZZES', label: 'QUIZZES & EXAMS' },
    { id: 'ONLINE', label: 'ONLINE CLASSES' },
    { id: 'POSTS', label: 'CLASS POSTS' },
    { id: 'GRADES', label: 'POST GRADES' }
  ];

  const loadData = async () => {
    try {
      const [crsRes, tasksRes, annRes, schRes, facRes, stuRes, subRes] = await Promise.all([
        fetchWithAuth('/courses'),
        fetchWithAuth('/tasks'),
        fetchWithAuth('/announcements'),
        fetchWithAuth('/schedules'),
        fetchWithAuth('/faculty'),
        fetchWithAuth('/students'),
        fetchWithAuth('/submissions')
      ]);

      if (crsRes.ok && tasksRes.ok && annRes.ok && schRes.ok) {
        const crsData = await crsRes.json();
        const tasksData = await tasksRes.json();
        const annData = await annRes.json();
        const schData = await schRes.json();
        const facData = await facRes.json();
        const stuData = await stuRes.json();
        const subData = subRes.ok ? await subRes.json() : { data: [] };

        const currentCourse = (crsData.data || []).find((c: Course) => 
          c.code.toLowerCase() === code?.toLowerCase()
        );
        setCourse(currentCourse || null);

        setSubmissions(subData.data || []);

        let studentSection = '';
        if (user?.role === 'student') {
           const student = (stuData.data || []).find((s: Student) => s.email === user.email);
           studentSection = student?.section || '';
        }

        const courseTasks = (tasksData.data || []).filter((t: Task) => 
          t.course_code?.toLowerCase() === code?.toLowerCase() && 
          (user?.role === 'student' ? t.section === studentSection : true)
        ).map(t => {
          const faculty = (facData.data || []).find((f: any) => f.id.toString() === t.faculty_id.toString());
          return { ...t, faculty };
        });
        setTasks(courseTasks);
        setAnnouncements(annData.data || []); 

        const courseSchedules = (schData.data || []).filter((s: Schedule) => 
           s.courseCode.toLowerCase() === code?.toLowerCase() &&
           (user?.role === 'student' ? s.section === studentSection : true)
        ).map(s => {
           const fac = (facData.data || []).find((f: Faculty) => f.id.toString() === s.facultyId.toString());
           return { ...s, faculty: fac };
        });
        setSchedules(courseSchedules);
      }
    } catch (err) {
      console.error("Error loading subject details", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [code, user]);

  const fetchTaskSubmissions = async (taskId: string) => {
    setLoadingTaskSubmissions(true);
    try {
      const response = await fetchWithAuth(`/tasks/${taskId}/submissions`);
      if (response.ok) {
        const data = await response.json();
        setTaskSubmissions(data.data || []);
      }
    } catch (err) {
      toast.error("Failed to load submissions");
    } finally {
      setLoadingTaskSubmissions(false);
    }
  };

  const handleGrade = async (subId: number, grade: string) => {
    try {
      const response = await fetchWithAuth(`/submissions/${subId}`, {
        method: 'PUT',
        body: JSON.stringify({ grade, status: 'Graded' })
      });
      if (response.ok) {
        toast.success("Grade updated");
        setTaskSubmissions(taskSubmissions.map(s => s.id === subId ? { ...s, grade, status: 'Graded' } : s));
      }
    } catch (err) {
      toast.error("Grading failed");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubmissionData({ ...submissionData, file: e.target.files[0] });
    }
  };

  const handleSubmitWork = async () => {
    if (!selectedTask) return;
    if (!submissionData.file && !submissionData.link) {
      toast.error("Please provide a file or a link.");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('task_id', selectedTask.id);
    if (submissionData.file) formData.append('file', submissionData.file);
    if (submissionData.link) formData.append('submission_link', submissionData.link);

    try {
      const response = await fetchWithAuth('/submissions', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        toast.success("Assignment submitted successfully!");
        setIsSubmitModalOpen(false);
        setSubmissionData({ file: null, link: '' });
        loadData(); 
      } else {
        const err = await response.json();
        toast.error(err.message || "Failed to submit assignment.");
      }
    } catch (err) {
      toast.error("An error occurred during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-xs font-black uppercase tracking-[0.3em] text-[#FF7F11] animate-pulse">Accessing Course Repository...</div>;
  if (!course) return <div className="p-8 text-center text-gray-500 font-bold">Subject not found.</div>;

  const lecSched = schedules.find(s => s.type === 'Lecture');
  const labSched = schedules.find(s => s.type === 'Laboratory');

  return (
    <div className="min-h-screen bg-[#fcfcfc] font-sans">
      {/* Enhanced Subject Header */}
      <div className="relative h-[240px] bg-[#1a1a1a] overflow-hidden border-b-8 border-[#FF7F11]">
        <div className="absolute inset-0 z-0">
           <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-[#FF7F11]/30 opacity-90" />
           <div className="absolute top-0 right-[-5%] w-1/2 h-full border-l border-white/5 skew-x-[-15deg] bg-white/5 backdrop-blur-3xl" />
           <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#FF7F11]/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-between p-8 text-white max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
             <Link to="/my-subjects" className="px-4 py-2 border border-white/20 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all backdrop-blur-md">
                <ChevronLeft className="w-3 h-3" /> Back to Subject Inventory
             </Link>
          </div>

          <div className="flex flex-col items-start gap-1">
             <div className="flex items-center gap-3">
                <span className="text-[#FF7F11] text-xs font-black tracking-[0.4em] uppercase">{course.code}</span>
                <div className="h-1 w-8 bg-[#FF7F11]/30" />
                <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">{schedules[0]?.section}</span>
             </div>
             <h1 className="text-5xl font-black tracking-tighter uppercase leading-none">{course.name}</h1>
          </div>

          <div className="flex justify-between items-end border-t border-white/5 pt-4">
             <div className="flex gap-12">
                {lecSched && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-[#FF7F11] rounded-xl flex items-center justify-center bg-[#FF7F11]/10">
                       <LayoutGrid className="w-5 h-5 text-[#FF7F11]" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">LECTURE INSTRUCTOR</p>
                      <p className="text-xs font-bold text-white uppercase">{lecSched.faculty ? `${lecSched.faculty.firstName} ${lecSched.faculty.lastName}` : 'TBA'}</p>
                      <p className="text-[9px] font-bold text-[#FF7F11]">{lecSched.day} | {lecSched.timeStart} - {lecSched.timeEnd}</p>
                    </div>
                  </div>
                )}
                {labSched && (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border-2 border-orange-200/20 rounded-xl flex items-center justify-center bg-white/5">
                       <Clock className="w-5 h-5 text-orange-200/50" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-0.5">LABORATORY INSTRUCTOR</p>
                      <p className="text-xs font-bold text-white uppercase">{labSched.faculty ? `${labSched.faculty.firstName} ${labSched.faculty.lastName}` : 'TBA'}</p>
                      <p className="text-[9px] font-bold text-gray-400">{labSched.day} | {labSched.timeStart} - {labSched.timeEnd}</p>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white sticky top-0 z-20 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-8 flex gap-12 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={cn("relative py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all", activeTab === tab.id ? "text-[#FF7F11]" : "text-gray-400 hover:text-gray-600")}>
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF7F11] rounded-t-full shadow-[0_-2px_8_rgba(255,127,17,0.4)]" />}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-10">
        {activeTab === 'ASSIGNMENTS' && (
          <div className="grid grid-cols-1 gap-8">
            {tasks.map((task: any) => {
              const submission = submissions.find(s => s.task_id?.toString() === task.id?.toString());
              const isSubmitted = !!submission;

              return (
                <div key={task.id} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF7F11] to-orange-400 rounded-3xl blur opacity-0 group-hover:opacity-10 transition duration-500" />
                  <Card className="relative border border-gray-100 shadow-sm bg-white rounded-3xl overflow-hidden transition-all duration-300">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row h-full">
                         <div className="w-full md:w-32 bg-gray-50/50 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-gray-100">
                            <div className={cn("w-16 h-16 border-2 rounded-[2rem] flex items-center justify-center transition-all", isSubmitted ? "border-green-500 bg-green-50 text-green-500" : "border-[#FF7F11] bg-white text-[#FF7F11]")}>
                               {isSubmitted ? <CheckCircle2 className="w-8 h-8" /> : <Book className="w-8 h-8" />}
                            </div>
                         </div>
                         
                         <div className="flex-1 p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                               <div>
                                  <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1 group-hover:text-[#FF7F11] transition-colors uppercase">{task.title}</h3>
                                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{task.description.toLowerCase().includes('prelim') ? 'PRELIMINARY ASSESSMENT' : 'COURSE REQUIREMENT'}</p>
                               </div>
                               <div className="flex items-center gap-4">
                                  {isSubmitted ? (
                                    <Badge className="bg-green-100 text-green-700 border-none px-4 py-1 text-[10px] uppercase font-black tracking-widest">SUBMITTED</Badge>
                                  ) : (
                                    <div className="p-3 border border-red-50 rounded-2xl bg-red-50/10">
                                       <AlertCircle className="w-5 h-5 text-red-500 group-hover:rotate-12 transition-transform" />
                                    </div>
                                  )}
                               </div>
                            </div>

                            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-3xl line-clamp-2">{task.description}</p>

                            <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-gray-50 gap-6">
                               <div className="flex items-center gap-8">
                                  <div className="space-y-1">
                                     <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">DEADLINE</p>
                                     <div className="flex items-center gap-2 text-sm font-black text-gray-700">
                                        <Clock className="w-4 h-4 text-[#FF7F11]" />
                                        {new Date(task.due_date).toLocaleDateString()} | {new Date(task.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                     </div>
                                  </div>
                               </div>
                               
                               {/* Student Submission Button */}
                               {!isSubmitted && user?.role === 'student' && (
                                 <Button 
                                  onClick={() => { setSelectedTask(task); setIsSubmitModalOpen(true); }}
                                  className="bg-[#FF7F11] hover:bg-orange-600 rounded-2xl px-10 h-12 font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-orange-900/20"
                                 >
                                    Submit Work <ArrowRight className="w-4 h-4" />
                                 </Button>
                               )}

                               {/* Faculty Review Button */}
                               {user?.role === 'faculty' && (
                                 <Button 
                                  onClick={() => { setViewingSubmissionsTask(task); fetchTaskSubmissions(task.id); }}
                                  className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-10 h-12 font-black text-[10px] uppercase tracking-widest gap-2 shadow-lg shadow-blue-900/20"
                                 >
                                    View Submissions <Eye className="w-4 h-4" />
                                 </Button>
                               )}

                               {isSubmitted && user?.role === 'student' && (
                                 <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-widest">
                                    <CheckCircle2 className="w-4 h-4" /> Status: {submission.status}
                                 </div>
                               )}
                            </div>
                         </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'GRADES' && (
           <div className="space-y-6">
              <div className="bg-[#1a1a1a] p-8 rounded-[2.5rem] shadow-xl border-l-8 border-[#FF7F11] flex items-center justify-between overflow-hidden relative">
                 <div className="absolute top-0 right-0 w-64 h-full bg-[#FF7F11]/5 -skew-x-12 translate-x-32" />
                 <div className="relative z-10">
                    <h3 className="text-[10px] font-black text-[#FF7F11] uppercase tracking-[0.4em] mb-2">Academic Standing</h3>
                    <p className="text-3xl font-black text-white uppercase tracking-tighter">Subject Performance</p>
                 </div>
                 <div className="text-right relative z-10">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Graded Components</p>
                    <div className="flex items-center justify-end gap-3">
                       <span className="text-4xl font-black text-[#FF7F11] tracking-tighter">
                          {submissions.filter(s => s.grade).length} / {tasks.length}
                       </span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                 {tasks.map((task: any) => {
                    const submission = submissions.find(s => s.task_id?.toString() === task.id?.toString());
                    return (
                       <Card key={task.id} className="border border-gray-100 shadow-sm hover:shadow-lg transition-all rounded-3xl bg-white overflow-hidden group">
                          <CardContent className="p-0 flex flex-col md:flex-row items-stretch">
                             <div className={cn(
                                "w-full md:w-32 flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-gray-50 transition-colors",
                                submission?.grade ? "bg-green-50/50" : "bg-gray-50/30"
                             )}>
                                <div className={cn(
                                   "w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all",
                                   submission?.grade ? "border-green-500 bg-white text-green-500 shadow-lg shadow-green-900/10" : "border-gray-200 bg-white text-gray-300"
                                )}>
                                   {submission?.grade ? <Trophy className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                                </div>
                             </div>
                             
                             <div className="flex-1 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                   <h4 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-2 group-hover:text-[#FF7F11] transition-colors uppercase">{task.title}</h4>
                                   <div className="flex items-center gap-4">
                                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                         {submission ? (
                                            <>
                                               <CheckCircle2 className="w-3 h-3 text-green-500" />
                                               Submitted {new Date(submission.submitted_at).toLocaleDateString()}
                                            </>
                                         ) : (
                                            <>
                                               <Clock className="w-3 h-3" />
                                               Awaiting Submission
                                            </>
                                         )}
                                      </p>
                                      {submission && (
                                         <div className="flex gap-2">
                                            {submission.file_path && (
                                               <a href={`${API_URL.replace('/api', '')}/storage/${submission.file_path}`} target="_blank" rel="noreferrer" className="text-[9px] font-black text-blue-500 hover:underline uppercase tracking-widest">View File</a>
                                            )}
                                            {submission.submission_link && (
                                               <a href={submission.submission_link} target="_blank" rel="noreferrer" className="text-[9px] font-black text-blue-500 hover:underline uppercase tracking-widest">Open Link</a>
                                            )}
                                         </div>
                                      )}
                                   </div>
                                </div>

                                <div className="flex items-center gap-8">
                                   <div className="text-right">
                                      <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">OFFICIAL GRADE</p>
                                      <div className={cn(
                                         "text-3xl font-black tracking-tighter leading-none",
                                         submission?.grade ? "text-green-600" : "text-gray-100"
                                      )}>
                                         {submission?.grade || '0.0'}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </CardContent>
                       </Card>
                    );
                 })}
              </div>
           </div>
        )}

        {['QUIZZES', 'ONLINE', 'POSTS'].includes(activeTab) && (
          <div className="py-40 flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 border-4 border-[#FF7F11]/10 rounded-[3rem] p-10 mb-8 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-[#FF7F11]/5 rounded-[3rem] animate-pulse" />
              <Info className="w-full h-full text-orange-200" />
            </div>
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-2">Subject Sync in Progress</h3>
            <p className="text-sm font-bold text-gray-300 uppercase tracking-[0.3em]">Module status: Initializing Dynamic Feed</p>
          </div>
        )}
      </div>

      {/* Review Modal (Faculty) */}
      <Dialog open={!!viewingSubmissionsTask} onOpenChange={(open) => !open && setViewingSubmissionsTask(null)}>
        <DialogContent className="sm:max-w-[700px] border-none rounded-3xl overflow-hidden p-0 bg-white">
          <div className="p-8 bg-blue-600 text-white relative">
             <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                <GraduationCap className="w-8 h-8" />
                Review Submissions
             </DialogTitle>
             <DialogDescription className="text-blue-100 text-xs font-bold uppercase tracking-widest mt-1">
                {viewingSubmissionsTask?.title}
             </DialogDescription>
             <button onClick={() => setViewingSubmissionsTask(null)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                <X className="w-4 h-4" />
             </button>
          </div>

          <div className="p-8 max-h-[500px] overflow-y-auto">
             {loadingTaskSubmissions ? (
               <div className="py-20 text-center text-xs font-black uppercase tracking-widest text-gray-300 animate-pulse">Scanning Student Repository...</div>
             ) : taskSubmissions.length > 0 ? (
               <div className="space-y-4">
                  {taskSubmissions.map((sub: any) => (
                    <div key={sub.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xs">
                             {sub.student?.firstName[0]}{sub.student?.lastName[0]}
                          </div>
                          <div>
                             <p className="text-xs font-black text-gray-900 uppercase">{sub.student?.firstName} {sub.student?.lastName}</p>
                             <div className="flex gap-2 mt-1">
                                {sub.file_path && (
                                  <a href={`${API_URL.replace('/api', '')}/storage/${sub.file_path}`} target="_blank" rel="noreferrer" className="text-[9px] font-black text-orange-500 flex items-center gap-1">
                                     <Download className="w-3 h-3" /> VIEW FILE
                                  </a>
                                )}
                                {sub.submission_link && (
                                  <a href={sub.submission_link} target="_blank" rel="noreferrer" className="text-[9px] font-black text-blue-500 flex items-center gap-1">
                                     <ExternalLink className="w-3 h-3" /> OPEN LINK
                                  </a>
                                )}
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className={cn("text-[9px] font-black px-2 py-0.5 rounded-full uppercase", sub.status === 'Late' ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600")}>
                             {sub.status}
                          </div>
                          <Input 
                            type="number" 
                            className="w-16 h-10 text-center font-black rounded-xl border-gray-200"
                            placeholder="0.0"
                            defaultValue={sub.grade}
                            onBlur={(e) => handleGrade(sub.id, e.target.value)}
                          />
                       </div>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="py-20 text-center flex flex-col items-center">
                  <ClipboardList className="w-12 h-12 text-gray-100 mb-4" />
                  <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No work discovered for this task</p>
               </div>
             )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Submit Modal (Student) */}
      <Dialog open={isSubmitModalOpen} onOpenChange={setIsSubmitModalOpen}>
        <DialogContent className="sm:max-w-[500px] border-none rounded-3xl overflow-hidden p-0 bg-white">
          <div className="p-8 bg-gradient-to-br from-[#FF7F11] to-orange-600 text-white relative">
             <DialogTitle className="text-2xl font-black uppercase tracking-tight">Submit Assignment</DialogTitle>
             <DialogDescription className="text-orange-100 text-xs font-bold uppercase tracking-widest mt-1">
                {selectedTask?.title}
             </DialogDescription>
             <button onClick={() => setIsSubmitModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all">
                <X className="w-4 h-4" />
             </button>
          </div>

          <div className="p-8 space-y-8">
             <div className="space-y-3">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Attach Supporting File</Label>
                <div className="relative">
                   <input type="file" id="task-file" className="hidden" onChange={handleFileChange} />
                   <label htmlFor="task-file" className="w-full h-32 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-orange-50/30 hover:border-[#FF7F11]/30 transition-all group">
                      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-[#FF7F11] group-hover:text-white transition-all">
                         <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600">
                         {submissionData.file ? submissionData.file.name : 'Click to browse or drop file here'}
                      </span>
                   </label>
                </div>
             </div>

             <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100" /></div>
                <div className="relative flex justify-center text-[10px] uppercase font-black"><span className="bg-white px-2 text-gray-300">OR</span></div>
             </div>

             <div className="space-y-3">
                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Submission URL</Label>
                <div className="relative">
                   <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                   <Input 
                    placeholder="https://..." 
                    className="pl-10 h-11 rounded-xl" 
                    value={submissionData.link}
                    onChange={(e) => setSubmissionData({ ...submissionData, link: e.target.value })}
                   />
                </div>
             </div>

             <Button 
              disabled={submitting}
              onClick={handleSubmitWork}
              className="w-full h-14 bg-[#FF7F11] hover:bg-orange-600 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-orange-900/20"
             >
                {submitting ? 'PROCESSING...' : 'TURN IN ASSIGNMENT'}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
