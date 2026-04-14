import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { History, Shield, User, Clock, Terminal } from 'lucide-react';
import { fetchWithAuth } from '../context/AuthContext';

interface SystemLog {
  id: number;
  user_id: number | null;
  action: string;
  module: string;
  description: string;
  old_values: any;
  new_values: any;
  ip_address: string | null;
  created_at: string;
  user: {
    name: string;
    email: string;
  } | null;
}

export function SystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const response = await fetchWithAuth('/system-logs');
        if (!response.ok) throw new Error('Failed to fetch logs');
        const data = await response.json();
        setLogs(data.data || []);
      } catch (error) {
        console.error('Error fetching system logs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadLogs();
  }, []);

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'bg-green-100 text-green-700 border-green-200';
      case 'UPDATE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'DELETE': return 'bg-red-100 text-red-700 border-red-200';
      case 'LOGIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'LOGOUT': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading system activity logs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF7F11] to-orange-600 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <History className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-[#FF7F11] tracking-tight">
              System Audit Logs
            </h1>
            <p className="text-sm text-gray-500 font-medium font-sans mt-0.5">
              Real-time tracking of all administrative activities
            </p>
          </div>
        </div>
        <Badge variant="outline" className="px-3 py-1 flex items-center gap-2 border-orange-200 bg-orange-50 text-orange-700">
          <Shield className="w-4 h-4" />
          Security Active
        </Badge>
      </div>

      <Card className="shadow-lg border-t-4 border-t-[#FF7F11]">
        <CardHeader className="bg-gradient-to-r from-orange-50/50 to-transparent">
          <CardTitle className="text-lg flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#FF7F11]" />
            Activity Log
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Module</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic">
                      No system activities recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-[#FF7F11] font-bold text-xs">
                            {log.user ? log.user.name[0] : 'S'}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{log.user ? log.user.name : 'System'}</p>
                            <p className="text-xs text-gray-500">{log.user ? log.user.email : 'Automated'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${getActionColor(log.action)} border`}>
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                        {log.module}
                      </td>
                      <td className="px-6 py-4 max-w-xs truncate text-gray-600">
                        {log.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-mono text-gray-400">
                        {log.ip_address || 'Localhost'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
