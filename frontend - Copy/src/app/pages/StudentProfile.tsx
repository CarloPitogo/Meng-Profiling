import { useParams, Link, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  ArrowLeft, 
  User, 
  GraduationCap, 
  Code, 
  Trophy, 
  Users as UsersIcon, 
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { fetchWithAuth } from '../context/AuthContext';
import { Student } from '../types';
import { toast } from 'sonner';
import { StudentModal } from '../components/StudentModal';
import { ConfirmationModal } from '../components/ConfirmationModal';

export function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const response = await fetchWithAuth(`/students/${id}`);
        if (!response.ok) throw new Error('Failed to fetch student details');
        const data = await response.json();
        setStudent(data.data);
      } catch (error) {
        console.error('Error fetching student details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchStudentProfile();
  }, [id]);

  const executeDelete = async () => {
    try {
      const response = await fetchWithAuth(`/students/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success("Student profile deleted successfully.");
        navigate('/students');
      } else {
        toast.error("Failed to delete student profile.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An error occurred while deleting the profile.");
    }
  };

  if (isLoading) {
    return <div className="p-12 text-center text-gray-500">Loading student profile...</div>;
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Student not found</h2>
        <Link to="/students">
          <Button className="mt-4">Back to Students</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/students">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {student.firstName} {student.lastName}
            </h1>
            <p className="text-gray-600 mt-1">{student.studentNumber}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Badge variant={student.status === 'Active' ? 'default' : 'secondary'} className="text-sm px-3 py-1">
              {student.status}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(true)}>
              Edit Profile
            </Button>
          </div>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteModalOpen(true)} className="w-full">
            Delete Profile
          </Button>
        </div>
      </div>

      {/* Basic Info Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-3xl">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{student.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-gray-900">{student.gender}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">{student.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Enrollment Date</p>
                <p className="text-gray-900">{new Date(student.enrollmentDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current GPA</p>
                <p className="text-gray-900 font-semibold text-blue-600">{student.gpa.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="academic" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="sports">Sports</TabsTrigger>
          <TabsTrigger value="affiliations">Affiliations</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="violations">Violations</TabsTrigger>
        </TabsList>

        {/* Academic History */}
        <TabsContent value="academic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Academic History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Program</p>
                    <p className="font-semibold text-gray-900">{student.program}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year Level</p>
                    <p className="font-semibold text-gray-900">Year {student.yearLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cumulative GPA</p>
                    <p className="font-semibold text-blue-600">{student.gpa.toFixed(2)}</p>
                  </div>
                </div>

                {student.academicHistory.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{record.semester}</h4>
                      <Badge>GPA: {record.semesterGPA.toFixed(2)}</Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 text-sm text-gray-600">Course Code</th>
                            <th className="text-left py-2 text-sm text-gray-600">Course Name</th>
                            <th className="text-center py-2 text-sm text-gray-600">Units</th>
                            <th className="text-center py-2 text-sm text-gray-600">Grade</th>
                            <th className="text-center py-2 text-sm text-gray-600">Remarks</th>
                          </tr>
                        </thead>
                        <tbody>
                          {record.courses.map((course, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="py-2 text-sm">{course.courseCode}</td>
                              <td className="py-2 text-sm">{course.courseName}</td>
                              <td className="py-2 text-sm text-center">{course.units}</td>
                              <td className="py-2 text-sm text-center font-semibold">{course.grade.toFixed(2)}</td>
                              <td className="py-2 text-sm text-center">
                                <Badge variant={course.remarks === 'Passed' ? 'default' : 'destructive'}>
                                  {course.remarks}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Skills */}
        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.technicalSkills.map((skill) => (
                  <Badge key={skill} variant="outline" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Other Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {student.otherSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sports */}
        <TabsContent value="sports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                Sports Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.sportsSkills.map((sport, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{sport.sport}</h4>
                      <Badge 
                        variant={sport.level === 'Varsity' ? 'default' : 'secondary'}
                        className={sport.level === 'Varsity' ? 'bg-purple-600' : ''}
                      >
                        {sport.level}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      {sport.height && (
                        <div>
                          <span className="text-gray-500">Height:</span>
                          <span className="ml-2 text-gray-900">{sport.height} cm</span>
                        </div>
                      )}
                      {sport.weight && (
                        <div>
                          <span className="text-gray-500">Weight:</span>
                          <span className="ml-2 text-gray-900">{sport.weight} kg</span>
                        </div>
                      )}
                      {sport.position && (
                        <div>
                          <span className="text-gray-500">Position:</span>
                          <span className="ml-2 text-gray-900">{sport.position}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Affiliations */}
        <TabsContent value="affiliations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UsersIcon className="w-5 h-5" />
                Organizations & Affiliations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.affiliations.map((affiliation) => (
                  <div key={affiliation.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{affiliation.organization}</h4>
                        <p className="text-sm text-gray-600 mt-1">{affiliation.role}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Joined: {new Date(affiliation.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={affiliation.status === 'Active' ? 'default' : 'secondary'}>
                        {affiliation.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Non-Academic Activities */}
        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Non-Academic Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {student.nonAcademicActivities.map((activity) => (
                  <div key={activity.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                      <Badge variant="outline">{activity.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{new Date(activity.date).toLocaleDateString()}</span>
                      {activity.award && (
                        <>
                          <span>•</span>
                          <span className="text-yellow-600 font-semibold">🏆 {activity.award}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Violations */}
        <TabsContent value="violations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Violation Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              {student.violations.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No violations on record</p>
                  <p className="text-sm text-green-600 mt-2">✓ Clean disciplinary record</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {student.violations.map((violation) => (
                    <div key={violation.id} className="p-4 border border-red-200 rounded-lg bg-red-50">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{violation.type}</h4>
                        <Badge 
                          variant="destructive"
                          className={
                            violation.severity === 'Critical' ? 'bg-red-600' :
                            violation.severity === 'Major' ? 'bg-orange-600' :
                            'bg-yellow-600'
                          }
                        >
                          {violation.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{violation.description}</p>
                      <div className="text-xs text-gray-500 mb-2">
                        Date: {new Date(violation.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Resolution:</span>
                        <span className="ml-2 text-gray-900">{violation.resolution}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <StudentModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={student}
        onSave={async (data) => {
          // Optimistic local update
          setStudent({ ...student, ...data } as Student);
          setIsEditModalOpen(false);
          toast.success('Saving changes to backend...');
          
          try {
            const response = await fetchWithAuth(`/students/${student.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });
            
            if (response.status === 422) {
              const errData = await response.json();
              if (errData.errors) {
                const errorMessages = Object.values(errData.errors).flat().join(' ');
                toast.error(`Validation Error: ${errorMessages}`);
              } else {
                toast.error(errData.message || 'Validation failed.');
              }
              return;
            }

            if (!response.ok) throw new Error('Failed to update student in backend');
            
            toast.success('Student updated successfully!');
            // Optional: fetch actual updated data
            // const result = await response.json();
            // setStudent(result.data);
          } catch (error) {
            console.error('Error updating to backend:', error);
            toast.error('Failed to update student in the backend');
          }
        }}
      />

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Permanently Delete Profile"
        description={<>Are you absolutely sure you want to delete <strong>{student.firstName} {student.lastName}</strong> from the system? This action is permanent, completely wiping their academic history, skills, and disciplinary records, and cannot be undone.</>}
        confirmText="Yes, delete student"
        isDestructive={true}
      />
    </div>
  );
}