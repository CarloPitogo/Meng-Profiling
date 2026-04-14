import { createBrowserRouter } from "react-router";
import { Dashboard } from "./pages/Dashboard";
import { Students } from "./pages/Students";
import { StudentProfile } from "./pages/StudentProfile";
import { MyProfile } from "./pages/MyProfile";
import { MySchedule } from "./pages/MySchedule";
import { RegistrationForm } from "./pages/RegistrationForm";
import { Faculty } from "./pages/Faculty";
import { Instruction } from "./pages/Instruction";
import { Scheduling } from "./pages/Scheduling";
import { Announcements } from "./pages/Announcements";
import { Events } from "./pages/Events";
import { Search } from "./pages/Search";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { SystemLogs } from "./pages/SystemLogs";
import { Assignments } from "./pages/Assignments";
import { MyClasses } from "./pages/MyClasses";
import { MySubjects } from "./pages/MySubjects";
import { SubjectDetail } from "./pages/SubjectDetail";
import { ProtectedLayout } from "./components/ProtectedLayout";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/",
    Component: ProtectedLayout,
    children: [
      { index: true, Component: Dashboard },
      { path: "profile", Component: MyProfile },
      { path: "my-schedule", Component: MySchedule },
      { path: "my-subjects", Component: MySubjects },
      { path: "subjects/:code", Component: SubjectDetail },
      { path: "reg-form", Component: RegistrationForm },
      { path: "assignments", Component: Assignments },
      { path: "my-classes", Component: MyClasses },
      { path: "students", Component: Students },
      { path: "students/:id", Component: StudentProfile },
      { path: "faculty", Component: Faculty },
      { path: "instruction", Component: Instruction },
      { path: "scheduling", Component: Scheduling },
      { path: "announcements", Component: Announcements },
      { path: "events", Component: Events },
      { path: "search", Component: Search },
      { path: "logs", Component: SystemLogs },
    ],
  },
]);