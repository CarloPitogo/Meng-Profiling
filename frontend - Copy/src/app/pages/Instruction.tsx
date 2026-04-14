import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, FileText, Target } from 'lucide-react';
import { fetchWithAuth } from '../context/AuthContext';
import { Course, Syllabus, Faculty } from '../types';

export function Instruction() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [cRes, sRes, fRes] = await Promise.all([
          fetchWithAuth('/courses'),
          fetchWithAuth('/syllabi'),
          fetchWithAuth('/faculty')
        ]);
        const cData = cRes.ok ? await cRes.json() : { data: [] };
        const sData = sRes.ok ? await sRes.json() : { data: [] };
        const fData = fRes.ok ? await fRes.json() : { data: [] };

        setCourses(cData.data || []);
        setSyllabi(sData.data || []);
        setFacultyList(fData.data || []);
      } catch (error) {
        console.error('Error fetching instruction data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Instruction Information...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#FF7F11] tracking-tight">
              Instruction Management
            </h1>
            <p className="text-sm text-gray-500 font-medium font-sans mt-0.5">
              Curriculum, courses, and syllabi overview
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="syllabus">Syllabus</TabsTrigger>
          <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
        </TabsList>

        {/* Courses */}
        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <Card key={course.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {course.code} - {course.name}
                        </h3>
                        <Badge>{course.units} Units</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Program:</span>
                          <p className="text-gray-900">{course.program}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Year Level:</span>
                          <p className="text-gray-900">Year {course.yearLevel}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Semester:</span>
                          <p className="text-gray-900">{course.semester}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Syllabus */}
        <TabsContent value="syllabus" className="space-y-4">
          {syllabi.map((syllabus) => {
            const faculty = facultyList.find(f => ((f.id).toString() === (syllabus.facultyId).toString()));
            return (
              <Card key={syllabus.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {syllabus.courseCode} - {syllabus.courseName}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{syllabus.semester}</p>
                    </div>
                    {faculty && (
                      <Badge variant="outline">
                        {faculty.firstName} {faculty.lastName}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Course Description</h4>
                    <p className="text-sm text-gray-600">{syllabus.description}</p>
                  </div>

                  {/* Objectives */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Learning Objectives
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {syllabus.objectives.map((obj, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{obj}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Topics */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Course Topics</h4>
                    <div className="space-y-3">
                      {syllabus.topics.map((topic) => (
                        <div key={topic.week} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="bg-blue-100 text-blue-700 rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold">
                              {topic.week}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-900">{topic.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Learning Outcomes:</p>
                                <div className="flex flex-wrap gap-2">
                                  {topic.learningOutcomes.map((outcome, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {outcome}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Grading System */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Grading System</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 text-sm text-gray-600">Component</th>
                            <th className="text-right py-2 text-sm text-gray-600">Percentage</th>
                          </tr>
                        </thead>
                        <tbody>
                          {syllabus.gradingSystem.map((criteria, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="py-2 text-sm">{criteria.component}</td>
                              <td className="py-2 text-sm text-right font-semibold">{criteria.percentage}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        {/* Curriculum */}
        <TabsContent value="curriculum" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* BS Computer Science */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Bachelor of Science in Computer Science</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Units Required</p>
                      <p className="text-2xl font-bold text-blue-600">180</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Major Courses</p>
                      <p className="text-2xl font-bold text-green-600">60</p>
                    </div>
                  </div>
                </div>

                {/* BS Information Technology */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Bachelor of Science in Information Technology</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Units Required</p>
                      <p className="text-2xl font-bold text-purple-600">180</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-gray-600">Major Courses</p>
                      <p className="text-2xl font-bold text-orange-600">60</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
