import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  UserCog,
  BookOpen,
  Calendar,
  PartyPopper,
  Search as SearchIcon,
  GraduationCap,
  LogOut,
  User,
  ClipboardCheck,
  Megaphone,
  Presentation,
  Settings,
  Clock,
  FileText,
  ClipboardList,
  BookMarked,
  History as LogsIcon,
  ChevronDown,
  ChevronRight,
  Book
} from "lucide-react";
import { cn } from "./ui/utils";
import { useAuth, fetchWithAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Schedule, Student, Faculty } from "../types";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard, roles: ['admin', 'faculty', 'student'] },
  { name: "My Schedule", href: "/my-schedule", icon: Clock, roles: ['student'] },
  { name: "My Subjects", href: "/my-subjects", icon: BookMarked, roles: ['student'], hasDropdown: true },
  { name: "Reg Form", href: "/reg-form", icon: FileText, roles: ['student'] },
  { name: "Assignments", href: "/assignments", icon: ClipboardList, roles: ['student', 'faculty'] },
  { name: "My Classes", href: "/my-classes", icon: Presentation, roles: ['faculty'], hasDropdown: true },
  { name: "Students", href: "/students", icon: Users, roles: ['admin'] },
  { name: "Faculty", href: "/faculty", icon: UserCog, roles: ['admin'] },
  { name: "Instruction", href: "/instruction", icon: BookOpen, roles: ['admin'] },
  { name: "Scheduling", href: "/scheduling", icon: Calendar, roles: ['admin', 'faculty'] },
  { name: "Announcements", href: "/announcements", icon: Megaphone, roles: ['admin', 'faculty', 'student'] },
  { name: "Events", href: "/events", icon: PartyPopper, roles: ['admin', 'faculty', 'student'] },
  { name: "Search & Reports", href: "/search", icon: SearchIcon, roles: ['admin'] },
  { name: "System Logs", href: "/logs", icon: LogsIcon, roles: ['admin'] },
  { name: "My Profile", href: "/profile", icon: User, roles: ['student', 'faculty'] },
];

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);
  const [studentSubjects, setStudentSubjects] = useState<{ code: string; name: string }[]>([]);
  const [facultyClasses, setFacultyClasses] = useState<{ section: string; courseCode: string }[]>([]);

  useEffect(() => {
    const loadSidebarData = async () => {
      if (!user) return;
      try {
        if (user.role === 'student') {
          const [schRes, stuRes, crsRes] = await Promise.all([
            fetchWithAuth('/schedules'),
            fetchWithAuth('/students'),
            fetchWithAuth('/courses')
          ]);
          if (schRes.ok && stuRes.ok && crsRes.ok) {
            const schData = await schRes.json();
            const stuData = await stuRes.json();
            const crsData = await crsRes.json();
            const currentStudent = (stuData.data || []).find((s: Student) => s.email === user.email);
            if (currentStudent) {
              const myScheds = (schData.data || []).filter((s: Schedule) => s.section === currentStudent.section);
              const uniqueSubjects = myScheds.reduce((acc: any[], s: Schedule) => {
                if (!acc.find(item => item.code === s.courseCode)) {
                  const course = (crsData.data || []).find((c: any) => c.code === s.courseCode);
                  acc.push({ code: s.courseCode, name: course?.name || s.courseCode });
                }
                return acc;
              }, []);
              setStudentSubjects(uniqueSubjects);
            }
          }
        } else if (user.role === 'faculty') {
          const [schRes, facRes] = await Promise.all([
            fetchWithAuth('/schedules'),
            fetchWithAuth('/faculty')
          ]);
          if (schRes.ok && facRes.ok) {
            const schData = await schRes.json();
            const facData = await facRes.json();
            const currentFaculty = (facData.data || []).find((f: Faculty) => f.email === user.email);
            if (currentFaculty) {
              const myClasses = (schData.data || []).filter((s: Schedule) => s.facultyId.toString() === currentFaculty.id.toString());
              const uniqueClasses = myClasses.reduce((acc: any[], s: Schedule) => {
                if (!acc.find(item => item.section === s.section && item.courseCode === s.courseCode)) {
                  acc.push({ section: s.section, courseCode: s.courseCode });
                }
                return acc;
              }, []);
              setFacultyClasses(uniqueClasses);
            }
          }
        }
      } catch (err) {
        console.error("Sidebar data load error", err);
      }
    };
    loadSidebarData();
  }, [user]);

  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    toast.success("Logged out successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-[#FF7F11] via-orange-600 to-orange-700 shadow-2xl z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-6 border-b border-orange-600/30 bg-gradient-to-r from-orange-500/20 to-transparent">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg leading-tight tracking-tight">CCS Profiling</h1>
              <p className="text-[10px] text-orange-100 font-black uppercase tracking-[0.2em]">Management System</p>
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="px-4 py-4 mx-2 my-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-white to-orange-100 rounded-lg flex items-center justify-center text-[#FF7F11] font-black text-sm shadow-inner overflow-hidden">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-white truncate uppercase tracking-wide">{user.name}</p>
                  <p className="text-[9px] text-orange-100 font-black uppercase tracking-widest bg-orange-500/30 px-2 py-0.5 rounded-md inline-block mt-0.5 border border-white/10">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto no-scrollbar">
            {navigation.filter(item => item.roles.includes(user?.role || 'admin')).map((item) => {
              const isActive = location.pathname === item.href;
              const isDropdownOpen = openDropdowns.includes(item.name);
              const hasSubItems = item.hasDropdown;

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center">
                    <Link
                      to={item.href}
                      className={cn(
                        "flex-1 flex items-center gap-3 px-3 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 group relative",
                        isActive
                          ? "bg-white text-[#FF7F11] shadow-2xl shadow-orange-900/20 translate-x-1"
                          : "text-orange-100 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4", isActive ? "text-[#FF7F11]" : "text-orange-200 group-hover:text-white")} />
                      {item.name}
                      {isActive && (
                        <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-[#FF7F11] animate-pulse" />
                      )}
                    </Link>
                    {hasSubItems && (
                      <button
                        onClick={(e) => { e.preventDefault(); toggleDropdown(item.name); }}
                        className="p-2 text-orange-100 hover:text-white transition-colors"
                      >
                        {isDropdownOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>

                  {/* Dropdown Content */}
                  {isDropdownOpen && hasSubItems && (
                    <div className="ml-9 space-y-1 py-1 border-l border-white/10 pl-2">
                      {item.name === "My Subjects" && studentSubjects.map(sub => (
                        <Link
                          key={sub.code}
                          to={`/subjects/${sub.code}`}
                          className="flex items-center gap-2 py-1.5 text-[10px] font-bold text-orange-100/70 hover:text-white transition-colors truncate"
                        >
                          <Book className="w-3 h-3 flex-shrink-0" />
                          {sub.code}: {sub.name}
                        </Link>
                      ))}
                      {item.name === "My Classes" && facultyClasses.map((cls, idx) => (
                        <Link
                          key={idx}
                          to={`/my-classes?section=${encodeURIComponent(cls.section)}&course=${encodeURIComponent(cls.courseCode)}`}
                          className="flex items-center gap-2 py-1.5 text-[10px] font-bold text-orange-100/70 hover:text-white transition-colors truncate"
                        >
                          <Presentation className="w-3 h-3 flex-shrink-0" />
                          {cls.section} - {cls.courseCode}
                        </Link>
                      ))}
                      {((item.name === "My Subjects" && studentSubjects.length === 0) || (item.name === "My Classes" && facultyClasses.length === 0)) && (
                        <div className="text-[9px] italic text-orange-100/40 py-1">No active records...</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Footer / Settings */}
          <div className="p-4 bg-orange-950/20">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 text-xs font-black text-orange-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 group brightness-110"
            >
              <LogOut className="w-4 h-4 text-orange-300 group-hover:rotate-12 transition-transform" />
              LOGOUT SYSTEM
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64 min-h-screen">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}