import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Users, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { toast } from 'sonner';
import { fetchWithAuth } from '../context/AuthContext';
import { Student } from '../types';

export function Attendance() {
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock attendance data (API integration coming soon for this module)
  const attendanceStats = {
    present: 245,
    absent: 15,
    late: 12,
    excused: 8,
    totalStudents: 280,
    attendanceRate: 87.5,
  };

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const response = await fetchWithAuth('/students');
        if (!response.ok) throw new Error('Failed to fetch students');
        const data = await response.json();
        setStudents(data.data || []);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStudents();
  }, []);

  const recentAttendance = students.slice(0, 6).map(student => ({
    ...student,
    status: Math.random() > 0.2 ? 'present' : Math.random() > 0.5 ? 'absent' : 'late',
    time: `${Math.floor(Math.random() * 3) + 7}:${Math.random() > 0.5 ? '00' : '30'} AM`,
    date: selectedDate,
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      case 'absent':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'late':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-5 h-5" />;
      case 'absent':
        return <XCircle className="w-5 h-5" />;
      case 'late':
        return <Clock className="w-5 h-5" />;
      default:
        return null;
    }
  };
  
  const exportAttendanceReport = () => {
    if (students.length === 0) {
      toast.error('No students found to generate report');
      return;
    }

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(255, 127, 17); // #FF7F11
    doc.text('CCS Profiling System', 14, 20);
    
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Attendance Tracking Report', 14, 30);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 38);
    doc.text(`Report Date: ${selectedDate}`, 14, 44);
    
    // Statistics Section
    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text('Summary Statistics', 14, 55);
    
    const statsData = [
      ['Category', 'Count'],
      ['Total Students', attendanceStats.totalStudents.toString()],
      ['Present', attendanceStats.present.toString()],
      ['Absent', attendanceStats.absent.toString()],
      ['Late', attendanceStats.late.toString()],
      ['Average Attendance Rate', `${attendanceStats.attendanceRate}%`]
    ];
    
    autoTable(doc, {
      body: statsData,
      startY: 60,
      margin: { left: 14 },
      headStyles: { fillColor: [255, 127, 17] },
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold', fillColor: [250, 250, 250] } }
    });
    
    // Student List Section
    doc.setFontSize(13);
    doc.text('Detailed Student Attendance List', 14, (doc as any).lastAutoTable.finalY + 15);
    
    const tableColumn = ["Student Name", "Student ID", "Program", "Status", "Timestamp"];
    const tableRows = students.map(student => {
      // Re-using the logic from the page for consistency in the report
      const statusValue = Math.random() > 0.2 ? 'Present' : Math.random() > 0.5 ? 'Absent' : 'Late';
      const timeStr = `${Math.floor(Math.random() * 3) + 7}:${Math.random() > 0.5 ? '00' : '30'} AM`;
      return [
        `${student.firstName} ${student.lastName}`,
        student.studentNumber,
        student.program,
        statusValue,
        statusValue === 'Absent' ? '--' : timeStr
      ];
    });
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: (doc as any).lastAutoTable.finalY + 20,
      theme: 'grid',
      headStyles: { fillColor: [255, 127, 17], textColor: [255, 255, 255] },
      styles: { fontSize: 9 }
    });
    
    const fileName = `Attendance_Summary_${selectedDate}.pdf`;
    
    // Using a Data URI as a fallback which can be more reliable for naming in some contexts
    const pdfData = doc.output('datauristring');
    const link = document.createElement('a');
    link.href = pdfData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Attendance report exported successfully: ${fileName}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF7F11] to-orange-600 bg-clip-text text-transparent">
            Attendance Tracking
          </h1>
          <p className="text-gray-600 mt-1">Monitor student attendance and punctuality</p>
        </div>
        <Button 
          onClick={exportAttendanceReport}
          className="bg-gradient-to-r from-[#FF7F11] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-l-4 border-l-[#FF7F11] shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-[#FF7F11]">{attendanceStats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-[#FF7F11]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Present</p>
                <p className="text-2xl font-bold text-green-600">{attendanceStats.present}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-red-600">{attendanceStats.absent}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late</p>
                <p className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-blue-600">{attendanceStats.attendanceRate}%</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Attendance */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Today's Attendance</CardTitle>
              <CardDescription>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardDescription>
            </div>
            <Badge className="bg-gradient-to-r from-[#FF7F11] to-orange-600 text-white">
              Live Tracking
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {recentAttendance.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                    {record.firstName[0]}{record.lastName[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {record.firstName} {record.lastName}
                    </h3>
                    <p className="text-sm text-gray-600">{record.studentNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">{record.time}</p>
                    <p className="text-xs text-gray-500">Check-in Time</p>
                  </div>
                  <Badge className={`${getStatusColor(record.status)} min-w-[100px] justify-center gap-2`}>
                    {getStatusIcon(record.status)}
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary by Student */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-white border-b">
          <CardTitle>Student Attendance Summary</CardTitle>
          <CardDescription>Overall attendance records for all students</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {students.slice(0, 5).map((student, index) => {
              const totalDays = 120;
              const presentDays = Math.floor(Math.random() * 30) + 90;
              const rate = ((presentDays / totalDays) * 100).toFixed(1);
              
              return (
                <div key={student.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                      {student.firstName[0]}{student.lastName[0]}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{student.program}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{presentDays}</p>
                      <p className="text-xs text-gray-600">Present</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">{totalDays - presentDays}</p>
                      <p className="text-xs text-gray-600">Absent</p>
                    </div>
                    <div className="text-center min-w-[80px]">
                      <p className="text-2xl font-bold bg-gradient-to-r from-[#FF7F11] to-orange-600 bg-clip-text text-transparent">
                        {rate}%
                      </p>
                      <p className="text-xs text-gray-600">Rate</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
