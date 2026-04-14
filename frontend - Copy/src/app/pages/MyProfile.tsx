import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, ShieldCheck, MapPin, Calendar, Lock, Edit3 } from 'lucide-react';
import { ChangePasswordModal } from '../components/ChangePasswordModal';
import { EditProfileModal } from '../components/EditProfileModal';

export function MyProfile() {
  const { user } = useAuth();
  const initials = user?.name?.substring(0, 2).toUpperCase() || 'ST';
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      
      {/* Standard Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF7F11] to-orange-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-600 mt-1">View and manage your personal account details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Details */}
        <Card className="lg:col-span-2 shadow-sm border-gray-100">
          <CardHeader>
            <div className="flex items-center justify-between w-full">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#FF7F11]" />
                Account Information
              </CardTitle>
              <Button onClick={() => setIsEditModalOpen(true)} variant="outline" size="sm" className="h-8 shadow-sm">
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-100 pb-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-orange-100 text-[#FF7F11] flex items-center justify-center text-3xl font-bold shadow-sm shrink-0">
                {initials}
              </div>
              <div className="text-center md:text-left mt-2">
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <div className="flex items-center gap-2 justify-center md:justify-start mt-2">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold capitalize">
                    {user?.role} Access
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-gray-900 font-medium truncate">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <ShieldCheck className="w-5 h-5 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">Portal Privileges</p>
                  <p className="text-gray-900 font-medium capitalize truncate">{user?.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-gray-900 font-medium truncate">College of Computing Studies</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">Academic Term</p>
                  <p className="text-gray-900 font-medium truncate">1st Semester 2026-2027</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <User className="w-5 h-5 text-gray-400" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-500">Gender</p>
                  <p className="text-gray-900 font-medium truncate">{user?.gender || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aside/Security */}
        <Card className="shadow-sm border-gray-100 h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-700" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-100 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-gray-900">Account Secured</p>
                <p className="text-xs text-gray-600 mt-1">Your data is governed by the system guidelines and protected.</p>
              </div>
            </div>
            
            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-4">Update your login credentials to ensure account security.</p>
              <Button 
                onClick={() => setIsPasswordModalOpen(true)} 
                className="w-full bg-[#FF7F11] hover:bg-orange-600 text-white shadow-md"
              >
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
      />
    </div>
  );
}
