import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { 
  Megaphone, Plus, Bell, AlertCircle, Info, 
  CheckCircle2, Calendar, Pencil, Trash2 
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { announcementsApi } from '../api/announcements';
import { Announcement } from '../types';
import { AnnouncementModal } from '../components/AnnouncementModal';


export function Announcements() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementsApi.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      toast.error('Failed to load announcements');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSubmit = async (data: Omit<Announcement, 'id'>) => {
    try {
      if (editingAnnouncement?.id) {
        await announcementsApi.updateAnnouncement(editingAnnouncement.id, data);
        toast.success('Announcement updated successfully');
      } else {
        await announcementsApi.createAnnouncement(data);
        toast.success('Announcement created successfully');
      }
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to save announcement');
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id || !confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await announcementsApi.deleteAnnouncement(id);
      toast.success('Announcement deleted');
      fetchAnnouncements();
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'important':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white';
      case 'event':
        return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white';
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-green-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'important':
        return <AlertCircle className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      case 'warning':
        return <Bell className="w-5 h-5" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const filteredAnnouncements = filter === 'all' 
    ? announcements 
    : announcements.filter(a => a.type === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF7F11] to-orange-600 bg-clip-text text-transparent">
              Announcements
            </h1>
            <p className="text-gray-600 mt-1">Stay updated with the latest news and updates</p>
          </div>
          {user?.role === 'admin' && (
            <Button 
              onClick={() => { setEditingAnnouncement(null); setIsModalOpen(true); }}
              className="bg-gradient-to-r from-[#FF7F11] to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Announcement
            </Button>
          )}
        </div>

        {/* Filters and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card 
          className={`cursor-pointer transition-all shadow-lg hover:shadow-xl ${filter === 'all' ? 'ring-2 ring-[#FF7F11]' : ''}`}
          onClick={() => setFilter('all')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-[#FF7F11]" />
              </div>
              <div>
                <p className="text-sm text-gray-600">All</p>
                <p className="text-xl font-bold">{announcements.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all shadow-lg hover:shadow-xl ${filter === 'important' ? 'ring-2 ring-red-500' : ''}`}
          onClick={() => setFilter('important')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Important</p>
                <p className="text-xl font-bold text-red-600">
                  {announcements.filter(a => a.type === 'important').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all shadow-lg hover:shadow-xl ${filter === 'event' ? 'ring-2 ring-purple-500' : ''}`}
          onClick={() => setFilter('event')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Events</p>
                <p className="text-xl font-bold text-purple-600">
                  {announcements.filter(a => a.type === 'event').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all shadow-lg hover:shadow-xl ${filter === 'warning' ? 'ring-2 ring-yellow-500' : ''}`}
          onClick={() => setFilter('warning')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-xl font-bold text-yellow-600">
                  {announcements.filter(a => a.type === 'warning').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all shadow-lg hover:shadow-xl ${filter === 'info' ? 'ring-2 ring-blue-500' : ''}`}
          onClick={() => setFilter('info')}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Info</p>
                <p className="text-xl font-bold text-blue-600">
                  {announcements.filter(a => a.type === 'info').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredAnnouncements.map((announcement) => (
          <Card key={announcement.id} className="shadow-lg hover:shadow-xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(announcement.type)} shadow-lg`}>
                  {getTypeIcon(announcement.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">{announcement.title}</h3>
                      <p className="text-sm text-gray-600">
                        By {announcement.author} • {new Date(announcement.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <Badge className={`${getTypeColor(announcement.type)} gap-1`}>
                      {getTypeIcon(announcement.type)}
                      {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mt-3 whitespace-pre-wrap">{announcement.content}</p>
                  
                  {user?.role === 'admin' && (
                    <div className="flex justify-end gap-2 mt-4 opacity-50 hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" onClick={() => { setEditingAnnouncement(announcement); setIsModalOpen(true); }}>
                        <Pencil className="w-4 h-4 mr-1" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(announcement.id)}>
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <Megaphone className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p>No announcements found.</p>
          </div>
        )}
      </div>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingAnnouncement(null); }}
        onSubmit={handleSubmit}
        initialData={editingAnnouncement}
      />
    </div>
  );
}
