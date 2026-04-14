import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Student, Schedule, Faculty } from '../types';

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
  onEnroll: (data: Partial<Student>) => void;
  schedules?: Schedule[];
  faculty?: Faculty[];
}

export function EnrollmentModal({ isOpen, onClose, student, onEnroll, schedules = [], faculty = [] }: EnrollmentModalProps) {
  const [program, setProgram] = useState(student?.program || '');
  const [yearLevel, setYearLevel] = useState(student?.yearLevel || 1);
  const [selectedSection, setSelectedSection] = useState('');

  // Sync state if student changes
  useEffect(() => {
    if (isOpen) {
      setProgram(student?.program || '');
      setYearLevel(student?.yearLevel || 1);
      setSelectedSection('');
    }
  }, [isOpen, student]);

  // Program mapping matching the seed data prefixes
  const getProgramPrefix = (prog: string) => {
    if (prog.includes('Computer Science')) return 'CS';
    if (prog.includes('Information Technology')) return 'IT';
    return '';
  };

  const prefix = getProgramPrefix(program);
  
  // Extract unique sections and filter based on Program and Year Level
  const uniqueSections = Array.from(new Set(schedules.map(s => s.section)))
    .filter(sec => {
      if (!program) return false;
      const matchesProgram = prefix ? sec.startsWith(prefix) : true;
      const matchesYear = sec.includes(yearLevel.toString());
      return matchesProgram && matchesYear;
    })
    .sort();

  // Reset selected section if it no longer fits the newly chosen program/year
  useEffect(() => {
    if (selectedSection && !uniqueSections.includes(selectedSection)) {
      setSelectedSection('');
    }
  }, [program, yearLevel, uniqueSections, selectedSection]);

  const getProfessorName = (facultyId: string) => {
    const prof = faculty.find(f => f.id === facultyId || f.id.toString() === facultyId);
    return prof ? `${prof.firstName} ${prof.lastName}` : 'TBA';
  };

  const selectedSchedules = schedules.filter(s => s.section === selectedSection);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!program) return;
    onEnroll({
      program,
      section: selectedSection,
      yearLevel,
      enrollmentDate: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-[#FF7F11]">Enrollment Application</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col overflow-y-auto pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
            <div className="space-y-2">
              <Label>Select Degree Program</Label>
              <Select value={program} onValueChange={setProgram} required>
                <SelectTrigger className="bg-white"><SelectValue placeholder="Select Academic Program" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bachelor of Science in Computer Science">BS in Computer Science (BSCS)</SelectItem>
                  <SelectItem value="Bachelor of Science in Information Technology">BS in Information Technology (BSIT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Year Level</Label>
              <Input type="number" min="1" max="5" value={yearLevel} onChange={(e) => setYearLevel(parseInt(e.target.value))} required className="bg-white" />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t shrink-0">
            <Label className="text-lg font-semibold text-gray-800">Block Section Scheduling</Label>
            <p className="text-xs text-gray-500 mb-2">Select a block section to preview the subjects, schedule, and professors you will be enrolled under.</p>
            <Select value={selectedSection} onValueChange={setSelectedSection} disabled={!program || uniqueSections.length === 0}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={!program ? "Please select a Program first" : uniqueSections.length === 0 ? "No sections available for this Program/Year" : "Select a Block Section to Preview"} />
              </SelectTrigger>
              <SelectContent>
                {uniqueSections.map(sec => (
                  <SelectItem key={sec} value={sec}>{sec}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSchedules.length > 0 && (
            <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden mt-4 shrink-0 shadow-inner">
              <div className="px-4 py-2 flex items-center bg-[#FF7F11]/10 border-b border-orange-100 font-semibold text-orange-800">
                <span>Classes for Section {selectedSection}</span>
              </div>
              <div className="max-h-60 overflow-y-auto relative">
                <table className="w-full text-sm text-left text-gray-600">
                  <thead className="text-xs text-gray-700 uppercase bg-white border-b sticky top-0 shadow-sm z-10">
                    <tr>
                      <th className="px-4 py-3">Subject</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Day/Time</th>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3">Professor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedSchedules.map((sched, idx) => (
                      <tr key={idx} className="border-b last:border-b-0 hover:bg-orange-50/50 transition-colors">
                        <td className="px-4 py-3 font-semibold text-gray-900 border-l-2 border-transparent hover:border-[#FF7F11]">{sched.courseCode}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${sched.type === 'Laboratory' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {sched.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="font-medium text-gray-800">{sched.day}</div>
                          <div className="text-[11px] text-gray-500">{sched.timeStart} - {sched.timeEnd}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{sched.room}</td>
                        <td className="px-4 py-3 font-medium text-orange-900">{getProfessorName(sched.facultyId)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="bg-orange-50 text-orange-800 p-3 rounded-md text-sm border border-orange-100 mt-6 shrink-0">
            By clicking <span className="font-semibold">Complete Enrollment</span>, you confirm that you wish to enroll in the selected program and section for Academic Year 2026-2027.
          </div>
          
          <DialogFooter className="mt-4 shrink-0 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} className="shadow-sm">Cancel</Button>
            <Button type="submit" className="bg-gradient-to-r from-[#FF7F11] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-none shadow-md">Complete Enrollment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
