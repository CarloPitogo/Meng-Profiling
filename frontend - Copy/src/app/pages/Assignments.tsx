import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import {
  Plus,
  ClipboardList,
  Calendar,
  Users,
  Trash2,
  CheckCircle,
  Clock,
  LayoutGrid,
  FileText,
  Book
} from 'lucide-react';
import { fetchWithAuth, useAuth, API_URL } from '../context/AuthContext';
import { Task, Schedule, Faculty, Submission } from '../types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export function Assignments() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [facultyInfo, setFacultyInfo] = useState<Faculty | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Submissions State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isSubmissionsModalOpen, setIsSubmissionsModalOpen] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [gradingPayload, setGradingPayload] = useState<{ [key: string]: string }>({});

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSection, setNewSection] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksRes, schRes, facRes] = await Promise.all([
          fetchWithAuth('/tasks'),
          fetchWithAuth('/schedules'),
          fetchWithAuth('/faculty')
        ]);

        if (tasksRes.ok) {
          const data = await tasksRes.json();
          setTasks(data.data || []);
        }

        if (schRes.ok) {
          const data = await schRes.json();
          setSchedules(data.data || []);
        }

        if (facRes.ok) {
          const data = await facRes.json();
          const list: Faculty[] = data.data || [];
          const current = list.find(f => f.email === user?.email);
          setFacultyInfo(current || null);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newSection || !newCourseCode || !newDueDate) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetchWithAuth('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          section: newSection,
          courseCode: newCourseCode,
          due_date: newDueDate
        })
      });

      if (response.ok) {
        const result = await response.json();
        setTasks([result.data, ...tasks]);
        setIsModalOpen(false);
        setNewTitle('');
        setNewDesc('');
        setNewSection('');
        setNewCourseCode('');
        setNewDueDate('');
        toast.success('Assignment posted successfully!');
      } else {
        toast.error('Failed to post assignment');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'Open' ? 'Closed' : 'Open';
    try {
      const response = await fetchWithAuth(`/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        setTasks(tasks.map(t => t.id?.toString() === task.id?.toString() ? { ...t, status: newStatus } : t));
        toast.success(`Task marked as ${newStatus}`);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteTask = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;
    try {
      const response = await fetchWithAuth(`/tasks/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setTasks(tasks.filter(t => t.id?.toString() !== id?.toString()));
        toast.success('Assignment deleted');
      }
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleViewSubmissions = async (task: Task) => {
    setSelectedTask(task);
    setIsSubmissionsModalOpen(true);
    try {
      const response = await fetchWithAuth(`/tasks/${task.id}/submissions`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.data || []);
        // Initialize grading payload with existing grades
        const grades: { [key: string]: string } = {};
        (data.data || []).forEach((s: Submission) => {
          grades[s.id] = s.grade || '';
        });
        setGradingPayload(grades);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load submissions');
    }
  };

  const handleGradeSubmission = async (submissionId: string) => {
    const grade = gradingPayload[submissionId];
    if (!grade) {
      toast.error('Please enter a grade');
      return;
    }

    setIsGrading(true);
    try {
      const response = await fetchWithAuth(`/submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade, status: 'Graded' })
      });

      if (response.ok) {
        setSubmissions(submissions.map(s => s.id?.toString() === submissionId?.toString() ? { ...s, grade, status: 'Graded' } : s));
        toast.success('Grade saved successfully');
      } else {
        toast.error('Failed to save grade');
      }
    } catch (error) {
      toast.error('An error occurred while grading');
    } finally {
      setIsGrading(false);
    }
  };

  const isFaculty = user?.role === 'faculty';
  const mySections = [...new Set(schedules.filter(s => s.facultyId?.toString() === facultyInfo?.id?.toString()).map(s => s.section))];
  const myCourses = schedules.filter(s => s.facultyId?.toString() === facultyInfo?.id?.toString() && s.section === newSection);

  const displayTasks = isFaculty
    ? tasks.filter(t => t.faculty_id?.toString() === facultyInfo?.id?.toString())
    : tasks;

  if (isLoading) return <div className="p-8 text-center text-xs font-black uppercase tracking-widest text-gray-400">Loading Assignments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3">
            <ClipboardList className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Assignments</h1>
            <p className="text-sm text-gray-500 font-medium">{isFaculty ? 'Assign tasks to your sections' : 'View your current coursework'}</p>
          </div>
        </div>

        {isFaculty && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#FF7F11] hover:bg-orange-600 gap-2 h-11 rounded-xl px-6 font-bold text-xs uppercase tracking-widest">
                <Plus className="w-4 h-4" />
                New Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="font-black uppercase tracking-tight">Create New Assignment</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-gray-400">Assignment Title</Label>
                  <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="e.g. Final Project Proposal" className="text-xs" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-gray-400">Target Section</Label>
                    <select
                      className="w-full h-10 px-3 py-2 rounded-md border text-xs"
                      value={newSection}
                      onChange={(e) => {
                        setNewSection(e.target.value);
                        setNewCourseCode(''); // Reset course when section changes
                      }}
                    >
                      <option value="">Select Section</option>
                      {mySections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black text-gray-400">Subject / Course</Label>
                    <select
                      className="w-full h-10 px-3 py-2 rounded-md border text-xs"
                      value={newCourseCode}
                      onChange={(e) => setNewCourseCode(e.target.value)}
                      disabled={!newSection}
                    >
                      <option value="">Select Course</option>
                      {myCourses.map(s => <option key={s.id} value={s.courseCode}>{s.courseCode}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-gray-400">Due Date</Label>
                  <Input type="datetime-local" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} className="text-xs" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black text-gray-400">Instructions</Label>
                  <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="min-h-[120px] text-xs" placeholder="Provide detailed instructions here..." />
                </div>
                <Button type="submit" className="w-full bg-[#FF7F11] hover:bg-orange-600 font-bold uppercase tracking-widest text-xs h-11 rounded-xl">Post Assignment</Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTasks.map(task => (
          <Card key={task.id} className="border-none shadow-lg hover:shadow-xl transition-all overflow-hidden bg-white">
            <div className={`h-1.5 w-full ${task.status === 'Open' ? 'bg-indigo-500' : 'bg-gray-400'}`}></div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <Badge className={task.status === 'Open' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-500 hover:bg-gray-100'}>
                  {task.status}
                </Badge>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-[#FF7F11] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded">SECTION {task.section}</span>
                  <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase">COURSE: {task.course_code}</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-gray-900 mb-2 line-clamp-1">{task.title}</h3>
              <p className="text-gray-500 text-sm line-clamp-3 mb-6 leading-relaxed">{task.description}</p>

              <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Clock className="w-4 h-4 text-orange-400" />
                  Due: {new Date(task.due_date).toLocaleString()}
                </div>

                 {isFaculty ? (
                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase h-10 rounded-lg gap-2 shadow-sm"
                      onClick={() => handleViewSubmissions(task)}
                    >
                      <Users className="w-4 h-4" />
                      View Submissions
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 text-[10px] font-black uppercase h-9 gap-1.5" onClick={() => toggleStatus(task)}>
                        <CheckCircle className={`w-3.5 h-3.5 ${task.status === 'Closed' ? 'text-green-500' : ''}`} />
                        {task.status === 'Open' ? 'Close' : 'Reopen'}
                      </Button>
                      <Button variant="destructive" size="sm" className="px-3 h-9" onClick={() => deleteTask(task.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs gap-2 h-10 rounded-lg">
                    <FileText className="w-3.5 h-3.5" />
                    View Details & Submit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {displayTasks.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">No assignments posted yet</h3>
          </div>
        )}
      </div>

      {/* Submissions Modal */}
      <Dialog open={isSubmissionsModalOpen} onOpenChange={setIsSubmissionsModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-3 font-black uppercase tracking-tight text-xl">
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                Submissions
                <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest leading-none">
                  {selectedTask?.title} • SECTION {selectedTask?.section}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="py-6">
            {submissions.length === 0 ? (
              <div className="py-20 text-center">
                <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">No submissions yet</h3>
              </div>
            ) : (
              <div className="space-y-4">
                {submissions.map((sub) => (
                  <div key={sub.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center font-black text-indigo-600 text-xs text-center">
                          {sub.student?.firstName?.[0]}{sub.student?.lastName?.[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900">{sub.student?.firstName} {sub.student?.lastName}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-black text-gray-400 uppercase">{sub.student?.studentNumber}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className={`text-[10px] font-black uppercase ${sub.status === 'Late' ? 'text-red-500' : 'text-green-500'}`}>
                              {sub.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Submitted At</p>
                          <p className="text-[10px] font-bold text-gray-600">{new Date(sub.submitted_at).toLocaleString()}</p>
                        </div>

                        <div className="flex gap-2">
                          {sub.file_path && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-3 text-[10px] font-black uppercase gap-1.5"
                              onClick={() => {
                                const baseUrl = API_URL.replace('/api', '');
                                const fileUrl = `${baseUrl}/storage/${sub.file_path}`;
                                window.open(fileUrl, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Files
                            </Button>
                          )}
                          {sub.submission_link && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-3 text-[10px] font-black uppercase gap-1.5"
                              onClick={() => window.open(sub.submission_link, '_blank')}
                            >
                              <LayoutGrid className="w-3.5 h-3.5" />
                              Link
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 border-l pl-4 min-w-[180px]">
                        <div className="flex-1 space-y-1">
                          <Label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Grade</Label>
                          <Input
                            placeholder="Enter grade"
                            className="h-9 text-xs font-bold text-indigo-600 focus-visible:ring-indigo-500"
                            value={gradingPayload[sub.id] || ''}
                            onChange={(e) => setGradingPayload({ ...gradingPayload, [sub.id]: e.target.value })}
                          />
                        </div>
                        <Button
                          size="sm"
                          className="mt-5 h-9 bg-[#FF7F11] hover:bg-orange-600 disabled:opacity-50"
                          onClick={() => handleGradeSubmission(sub.id)}
                          disabled={isGrading}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
}
