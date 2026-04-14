import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { fetchWithAuth } from '../context/AuthContext';
import { Student, SportSkill } from '../types';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Student | null;
  onSave: (data: Partial<Student>) => void;
}

const defaultFormData: Partial<Student> = {
  firstName: '',
  lastName: '',
  studentNumber: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  enrollmentDate: '',
  program: '',
  yearLevel: 1,
  status: 'Active',
  gpa: 0,
  technicalSkills: [],
  otherSkills: [],
  sportsSkills: [],
  affiliations: [],
  nonAcademicActivities: [],
  violations: [],
  academicHistory: [],
};

export function StudentModal({ isOpen, onClose, initialData, onSave }: StudentModalProps) {
  const [formData, setFormData] = useState<Partial<Student>>(defaultFormData);
  const [availableSports, setAvailableSports] = useState<string[]>([]);
  const [availableActivities, setAvailableActivities] = useState<{name: string, type: string, date: string}[]>([]);
  const [customSport, setCustomSport] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsRes, actsRes] = await Promise.all([
          fetchWithAuth('/events/available-sports'),
          fetchWithAuth('/events/available-activities')
        ]);
        const sportsData = await sportsRes.json();
        const actsData = await actsRes.json();
        
        setAvailableSports(sportsData.data || []);
        setAvailableActivities(actsData.data || []);
      } catch (error) {
        console.error('Failed to fetch dynamic event data', error);
      }
    };
    
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({ ...defaultFormData });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (field: keyof Student, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayStringChange = (field: keyof Student, value: string) => {
    const arrayValue = value.split(',').map((item) => item.trim()).filter(Boolean);
    handleChange(field, arrayValue);
  };

  const toggleSport = (sportName: string) => {
    const currentSports = formData.sportsSkills || [];
    const exists = currentSports.some(s => s.sport === sportName);
    
    if (exists) {
      handleChange('sportsSkills', currentSports.filter(s => s.sport !== sportName));
    } else {
      handleChange('sportsSkills', [...currentSports, { sport: sportName, level: 'Beginner' } as SportSkill]);
    }
  };

  const updateSportDetail = (sportName: string, field: keyof SportSkill, value: string) => {
    const currentSports = formData.sportsSkills || [];
    handleChange('sportsSkills', currentSports.map(s => 
      s.sport === sportName ? { ...s, [field]: value } : s
    ));
  };

  const toggleActivity = (act: {name: string, type: string, date: string}) => {
    const currentActs = formData.nonAcademicActivities || [];
    const exists = currentActs.some(a => a.name === act.name);
    
    if (exists) {
      handleChange('nonAcademicActivities', currentActs.filter(a => a.name !== act.name));
    } else {
      handleChange('nonAcademicActivities', [
        ...currentActs, 
        { name: act.name, type: act.type || 'Extra-Curricular', date: act.date || '', description: '', award: '' }
      ]);
    }
  };

  const updateActivityDetail = (actName: string, field: string, value: string) => {
    const currentActs = formData.nonAcademicActivities || [];
    handleChange('nonAcademicActivities', currentActs.map(a => 
      a.name === actName ? { ...a, [field]: value } : a
    ));
  };

  const addAffiliation = () => {
    const current = formData.affiliations || [];
    handleChange('affiliations', [...current, { organization: '', role: '', joinDate: '', status: 'Active' }]);
  };

  const removeAffiliation = (index: number) => {
    const current = formData.affiliations || [];
    handleChange('affiliations', current.filter((_, i) => i !== index));
  };

  const updateAffiliation = (index: number, field: string, value: string) => {
    const current = formData.affiliations || [];
    handleChange('affiliations', current.map((a, i) => 
      i === index ? { ...a, [field]: value } : a
    ));
  };

  const addViolation = () => {
    const current = formData.violations || [];
    handleChange('violations', [...current, { type: '', date: '', description: '', severity: 'Minor', resolution: '', suspendedUntil: '' }]);
  };

  const removeViolation = (index: number) => {
    const current = formData.violations || [];
    handleChange('violations', current.filter((_, i) => i !== index));
  };

  const updateViolation = (index: number, field: string, value: string) => {
    const current = formData.violations || [];
    handleChange('violations', current.map((v, i) => 
      i === index ? { ...v, [field]: value } : v
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Student' : 'Add Student'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto px-1 py-1">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="flex flex-wrap w-full mb-6 gap-2 bg-secondary/50 p-1 h-auto">
              <TabsTrigger value="basic" className="px-4 py-2">Basic Info</TabsTrigger>
              <TabsTrigger value="academic" className="px-4 py-2">Academic</TabsTrigger>
              <TabsTrigger value="skills" className="px-4 py-2">Skills</TabsTrigger>
              <TabsTrigger value="sports" className="px-4 py-2">Sports</TabsTrigger>
              <TabsTrigger value="affiliations" className="px-4 py-2">Affiliations</TabsTrigger>
              <TabsTrigger value="activities" className="px-4 py-2">Activities</TabsTrigger>
              <TabsTrigger value="violations" className="px-4 py-2">Violations</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name</Label>
                  <Input value={formData.firstName || ''} onChange={(e) => handleChange('firstName', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Last Name</Label>
                  <Input value={formData.lastName || ''} onChange={(e) => handleChange('lastName', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Student Number</Label>
                  <Input value={formData.studentNumber || ''} onChange={(e) => handleChange('studentNumber', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email || ''} onChange={(e) => handleChange('email', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone || ''} onChange={(e) => handleChange('phone', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input type="date" value={formData.dateOfBirth || ''} onChange={(e) => handleChange('dateOfBirth', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={formData.gender || ''} onValueChange={(val) => handleChange('gender', val)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Enrollment Date</Label>
                  <Input type="date" value={formData.enrollmentDate || ''} onChange={(e) => handleChange('enrollmentDate', e.target.value)} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Address</Label>
                  <Input value={formData.address || ''} onChange={(e) => handleChange('address', e.target.value)} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-500">Program *</Label>
                  <Select value={formData.program || ''} onValueChange={(val) => handleChange('program', val)} required>
                    <SelectTrigger className="bg-white"><SelectValue placeholder="Select Program" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bachelor of Science in Computer Science">BS in Computer Science (BSCS)</SelectItem>
                      <SelectItem value="Bachelor of Science in Information Technology">BS in Information Technology (BSIT)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Year Level</Label>
                  <Input type="number" min="1" max="5" value={formData.yearLevel || ''} onChange={(e) => handleChange('yearLevel', parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>GPA</Label>
                  <Input type="number" step="0.01" value={formData.gpa || ''} onChange={(e) => handleChange('gpa', parseFloat(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status || ''} onValueChange={(val) => handleChange('status', val)}>
                    <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Graduated">Graduated</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Technical Skills (comma-separated)</Label>
                  <Input 
                    value={formData.technicalSkills?.join(', ') || ''} 
                    onChange={(e) => handleArrayStringChange('technicalSkills', e.target.value)} 
                    placeholder="Python, React, Java"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Other Skills (comma-separated)</Label>
                  <Input 
                    value={formData.otherSkills?.join(', ') || ''} 
                    onChange={(e) => handleArrayStringChange('otherSkills', e.target.value)} 
                    placeholder="Public Speaking, Leadership"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sports" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Sports (Main Events This Year)</Label>
                <div className="text-sm text-gray-500 mb-4">Click to add or remove a sport from the student's profile.</div>
                
                {availableSports.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No sports events found for this year.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSports.map((sportName) => {
                      const isSelected = formData.sportsSkills?.some(s => s.sport === sportName);
                      return (
                        <div 
                          key={sportName}
                          onClick={() => toggleSport(sportName)}
                          className={`cursor-pointer px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                            isSelected 
                              ? 'bg-[#FF7F11] border-[#FF7F11] text-white shadow-sm' 
                              : 'bg-white border-gray-300 text-gray-700 hover:border-[#FF7F11] hover:text-[#FF7F11]'
                          }`}
                        >
                          {sportName}
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-2 max-w-sm">
                  <Input 
                    placeholder="Add other sport (e.g. Volleyball)" 
                    value={customSport}
                    onChange={(e) => setCustomSport(e.target.value)}
                    className="h-9"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        if (customSport.trim()) {
                          toggleSport(customSport.trim());
                          setCustomSport('');
                        }
                      }
                    }}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    className="border-[#FF7F11] text-[#FF7F11] hover:bg-orange-50 shrink-0"
                    onClick={() => {
                      if (customSport.trim()) {
                        toggleSport(customSport.trim());
                        setCustomSport('');
                      }
                    }}
                  >
                    + Add Sport
                  </Button>
                </div>
                
                {formData.sportsSkills && formData.sportsSkills.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <Label className="mb-4 block text-lg pb-2">Configure Selected Sports</Label>
                    <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-2">
                      {formData.sportsSkills.map((s: SportSkill, idx) => (
                        <div key={idx} className="bg-orange-50 p-4 rounded-lg border border-orange-100 shadow-sm relative">
                          <button type="button" onClick={() => toggleSport(s.sport)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">×</button>
                          <div className="font-semibold text-base text-[#FF7F11] mb-3">{s.sport} Details</div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">Skill Level</Label>
                              <Select value={s.level} onValueChange={(val) => updateSportDetail(s.sport, 'level', val)}>
                                <SelectTrigger className="bg-white text-sm h-8"><SelectValue placeholder="Level" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Beginner">Beginner</SelectItem>
                                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                                  <SelectItem value="Advanced">Advanced</SelectItem>
                                  <SelectItem value="Varsity">Varsity</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">Position/Role (optional)</Label>
                              <Input placeholder="e.g. Point Guard" className="bg-white text-sm h-8" value={s.position || ''} onChange={(e) => updateSportDetail(s.sport, 'position', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">Height (optional)</Label>
                              <Input placeholder="e.g. 5'10&quot;" className="bg-white text-sm h-8" value={s.height || ''} onChange={(e) => updateSportDetail(s.sport, 'height', e.target.value)} />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">Weight (optional)</Label>
                              <Input placeholder="e.g. 150 lbs" className="bg-white text-sm h-8" value={s.weight || ''} onChange={(e) => updateSportDetail(s.sport, 'weight', e.target.value)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="affiliations" className="space-y-4">
               <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <Label>Student Affiliations</Label>
                   <Button type="button" variant="outline" size="sm" onClick={addAffiliation}>+ Add Affiliation</Button>
                 </div>
                 
                 {(!formData.affiliations || formData.affiliations.length === 0) && (
                   <div className="text-sm text-gray-500 italic p-4 text-center border border-dashed rounded-lg">No affiliations recorded.</div>
                 )}
                 
                 <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
                   {formData.affiliations?.map((a: any, idx) => (
                     <div key={idx} className="p-4 border rounded-lg bg-gray-50 relative pr-10">
                       <button type="button" onClick={() => removeAffiliation(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold">×</button>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                           <Label className="text-xs text-gray-500">Organization Name *</Label>
                           <Input placeholder="e.g. CCS Student Council" value={a.organization || ''} onChange={(e) => updateAffiliation(idx, 'organization', e.target.value)} required className="h-9" />
                         </div>
                         <div className="space-y-1">
                           <Label className="text-xs text-gray-500">Role/Position (Optional)</Label>
                           <Input placeholder="e.g. President" value={a.role || ''} onChange={(e) => updateAffiliation(idx, 'role', e.target.value)} className="h-9" />
                         </div>
                         <div className="space-y-1">
                           <Label className="text-xs text-gray-500">Date Joined</Label>
                           <Input type="date" value={a.joinDate || ''} onChange={(e) => updateAffiliation(idx, 'joinDate', e.target.value)} className="h-9" />
                         </div>
                         <div className="space-y-1">
                           <Label className="text-xs text-gray-500">Status</Label>
                           <Select value={a.status || 'Active'} onValueChange={(val) => updateAffiliation(idx, 'status', val)}>
                             <SelectTrigger className="bg-white h-9"><SelectValue /></SelectTrigger>
                             <SelectContent>
                               <SelectItem value="Active">Active</SelectItem>
                               <SelectItem value="Inactive">Inactive</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <div className="space-y-2">
                <Label>Select Activities (Active Events This Year)</Label>
                <div className="text-sm text-gray-500 mb-4">Click to add or remove an activity from the student's profile.</div>
                
                {availableActivities.length === 0 ? (
                  <div className="text-sm text-gray-500 italic">No activity events found for this year.</div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableActivities.map((act) => {
                      const isSelected = formData.nonAcademicActivities?.some(a => a.name === act.name);
                      return (
                        <div 
                          key={act.name}
                          onClick={() => toggleActivity(act)}
                          className={`cursor-pointer px-4 py-2 border rounded-full text-sm font-medium transition-colors ${
                            isSelected 
                              ? 'bg-[#FF7F11] border-[#FF7F11] text-white shadow-sm' 
                              : 'bg-white border-gray-300 text-gray-700 hover:border-[#FF7F11] hover:text-[#FF7F11]'
                          }`}
                        >
                          {act.name}
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {formData.nonAcademicActivities && formData.nonAcademicActivities.length > 0 && (
                  <div className="mt-6 pt-4 border-t">
                    <Label className="mb-4 block text-lg pb-2">Configure Selected Activities</Label>
                    <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-2">
                      {formData.nonAcademicActivities.map((a: any, idx) => (
                        <div key={idx} className="bg-orange-50 p-4 rounded-lg border border-orange-100 shadow-sm relative">
                          <button type="button" onClick={() => toggleActivity(a)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 font-bold">×</button>
                          <div className="font-semibold text-base text-[#FF7F11] mb-3">{a.name}</div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">Date</Label>
                              <Input type="date" value={a.date || ''} onChange={(e) => updateActivityDetail(a.name, 'date', e.target.value)} className="bg-white text-sm h-8" />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-500">Type</Label>
                              <div className="flex h-8 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-1 text-sm text-gray-500 items-center cursor-not-allowed">
                                {a.type || 'Extra-Curricular'}
                              </div>
                            </div>
                            <div className="space-y-1 col-span-2">
                              <Label className="text-xs text-gray-500">Description (Optional)</Label>
                              <Input placeholder="Activity details..." className="bg-white text-sm h-8" value={a.description || ''} onChange={(e) => updateActivityDetail(a.name, 'description', e.target.value)} />
                            </div>
                            <div className="space-y-1 col-span-2">
                              <Label className="text-xs text-gray-500">Award/Recognition (Optional)</Label>
                              <Input placeholder="e.g. 1st Place, Best Presenter" className="bg-white text-sm h-8" value={a.award || ''} onChange={(e) => updateActivityDetail(a.name, 'award', e.target.value)} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="violations" className="space-y-4">
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                   <Label>Student Violations & Disciplinary Records</Label>
                   <Button type="button" variant="outline" size="sm" onClick={addViolation} className="border-red-200 text-red-600 hover:bg-red-50">+ Record Violation</Button>
                 </div>
                 
                 {(!formData.violations || formData.violations.length === 0) && (
                   <div className="text-sm text-gray-500 italic p-4 text-center border border-dashed rounded-lg">No disciplinary records found.</div>
                 )}
                 
                 <div className="flex flex-col gap-4 max-h-96 overflow-y-auto pr-2">
                   {formData.violations?.map((v: any, idx) => (
                     <div key={idx} className="p-4 border border-red-100 rounded-lg bg-red-50/50 relative pr-10">
                       <button type="button" onClick={() => removeViolation(idx)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold">×</button>
                       <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                           <Label className="text-xs text-gray-500">Violation Type *</Label>
                           <Input placeholder="e.g. Academic Dishonesty" value={v.type || ''} onChange={(e) => updateViolation(idx, 'type', e.target.value)} required className="h-9 bg-white" />
                         </div>
                         <div className="space-y-1">
                           <Label className="text-xs text-gray-500">Date of Incident *</Label>
                           <Input type="date" value={v.date || ''} onChange={(e) => updateViolation(idx, 'date', e.target.value)} required className="h-9 bg-white" />
                         </div>
                         <div className="space-y-1">
                           <Label className="text-xs text-gray-500">Severity</Label>
                           <Select value={v.severity || 'Minor'} onValueChange={(val) => updateViolation(idx, 'severity', val)}>
                             <SelectTrigger className="bg-white h-9"><SelectValue /></SelectTrigger>
                             <SelectContent>
                               <SelectItem value="Minor">Minor</SelectItem>
                               <SelectItem value="Major">Major</SelectItem>
                               <SelectItem value="Critical">Critical</SelectItem>
                             </SelectContent>
                           </Select>
                         </div>
                         <div className="space-y-1">
                           <Label className="text-xs text-gray-500">Suspended Until (Optional)</Label>
                           <Input type="date" value={v.suspendedUntil || ''} onChange={(e) => updateViolation(idx, 'suspendedUntil', e.target.value)} className="h-9 bg-white" />
                         </div>
                         <div className="space-y-1 col-span-2">
                           <Label className="text-xs text-gray-500">Description of Incident</Label>
                           <Input placeholder="Brief details about what happened..." value={v.description || ''} onChange={(e) => updateViolation(idx, 'description', e.target.value)} className="h-9 bg-white" />
                         </div>
                         <div className="space-y-1 col-span-2">
                           <Label className="text-xs text-gray-500">Resolution / Sanction Applied</Label>
                           <Input placeholder="e.g. 3 Days Suspension, Written Warning" value={v.resolution || ''} onChange={(e) => updateViolation(idx, 'resolution', e.target.value)} className="h-9 bg-white" />
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-8">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
