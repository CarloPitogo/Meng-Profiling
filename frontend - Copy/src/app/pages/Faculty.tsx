import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Search, Mail, Phone, BookOpen, Eye, Filter, Plus, Users, UserCog } from 'lucide-react';
import { fetchWithAuth } from '../context/AuthContext';
import { Faculty as FacultyType } from '../types';

export function Faculty() {
  const [searchTerm, setSearchTerm] = useState('');
  const [facultyData, setFacultyData] = useState<FacultyType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await fetchWithAuth('/faculty');
        if (response.ok) {
          const data = await response.json();
          setFacultyData(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching faculty:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaculty();
  }, []);

  const filteredFaculty = facultyData.filter(faculty =>
    faculty.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Faculty Directory...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <UserCog className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#FF7F11] tracking-tight">
              Faculty Information
            </h1>
            <p className="text-sm text-gray-500 font-medium font-sans mt-0.5">
              Comprehensive directory of CCS faculty members
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search faculty by name, employee number, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredFaculty.map((faculty) => (
          <Card key={faculty.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {faculty.firstName[0]}{faculty.lastName[0]}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {faculty.firstName} {faculty.lastName}
                    </h3>
                    <Badge variant={faculty.status === 'Active' ? 'default' : 'secondary'}>
                      {faculty.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{faculty.position}</p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{faculty.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{faculty.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>{faculty.department}</span>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Specialization:</p>
                    <div className="flex flex-wrap gap-2">
                      {faculty.specialization.map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Courses Teaching */}
                  {faculty.coursesTeaching.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs text-gray-500 mb-2">Currently Teaching:</p>
                      <div className="flex flex-wrap gap-2">
                        {faculty.coursesTeaching.map((course) => (
                          <Badge key={course} className="text-xs bg-blue-100 text-blue-700">
                            {course}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
