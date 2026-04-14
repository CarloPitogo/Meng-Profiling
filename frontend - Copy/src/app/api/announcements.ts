import { Announcement } from '../types';
import { fetchWithAuth } from '../context/AuthContext';

export const announcementsApi = {
  getAnnouncements: async (): Promise<Announcement[]> => {
    const response = await fetchWithAuth('/announcements');
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  createAnnouncement: async (data: Omit<Announcement, 'id'>): Promise<Announcement> => {
    const response = await fetchWithAuth('/announcements', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  updateAnnouncement: async (id: string, data: Partial<Announcement>): Promise<Announcement> => {
    const response = await fetchWithAuth(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },

  deleteAnnouncement: async (id: string): Promise<void> => {
    const response = await fetchWithAuth(`/announcements/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Network response was not ok');
  },
};
