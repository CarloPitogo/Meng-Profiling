import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Calendar, Clock, MapPin, Users, Info, PartyPopper } from 'lucide-react';
import { fetchWithAuth } from '../context/AuthContext';
import { Event } from '../types';

export function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetchWithAuth('/events');
        if (response.ok) {
          const data = await response.json();
          setEvents(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const curricularEvents = events.filter(e => e.type === 'Curricular');
  const extraCurricularEvents = events.filter(e => e.type === 'Extra-Curricular');

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Events...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <PartyPopper className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#FF7F11] tracking-tight">
              Events Management
            </h1>
            <p className="text-sm text-gray-500 font-medium font-sans mt-0.5">
              Curricular and extra-curricular CCS activities
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Curricular</p>
                <p className="text-2xl font-bold text-gray-900">{curricularEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Extra-Curricular</p>
                <p className="text-2xl font-bold text-gray-900">{extraCurricularEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all">All Events</TabsTrigger>
          <TabsTrigger value="curricular">Curricular</TabsTrigger>
          <TabsTrigger value="extra">Extra-Curricular</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <EventsList events={events} />
        </TabsContent>

        <TabsContent value="curricular" className="space-y-4">
          <EventsList events={curricularEvents} />
        </TabsContent>

        <TabsContent value="extra" className="space-y-4">
          <EventsList events={extraCurricularEvents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventsList({ events }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {events.map((event) => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                  <Badge variant={event.type === 'Curricular' ? 'default' : 'secondary'}>
                    {event.type}
                  </Badge>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
                <p className="text-sm text-gray-600">{event.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{new Date(event.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{event.organizer}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-xs text-gray-500 mb-1">Target Participants:</p>
                <div className="flex flex-wrap gap-2">
                  {event.targetParticipants.map((target) => (
                    <Badge key={target} variant="outline" className="text-xs">
                      {target}
                    </Badge>
                  ))}
                </div>
              </div>
              {event.registrationRequired && (
                <Badge className="bg-orange-100 text-orange-700">
                  Registration Required
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
