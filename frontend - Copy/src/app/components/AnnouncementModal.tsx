import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Announcement } from '../types';

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Announcement, 'id'>) => Promise<void>;
  initialData?: Announcement | null;
}

export function AnnouncementModal({ isOpen, onClose, onSubmit, initialData }: AnnouncementModalProps) {
  const [formData, setFormData] = useState<Partial<Announcement>>({
    title: '',
    content: '',
    type: 'info',
    date: new Date().toISOString().split('T')[0],
    author: 'System Admin',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        content: '',
        type: 'info',
        date: new Date().toISOString().split('T')[0],
        author: 'System Admin',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (field: keyof Announcement, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.title || !formData.content) return;
      await onSubmit(formData as Omit<Announcement, 'id'>);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input 
              required 
              value={formData.title} 
              onChange={(e) => handleChange('title', e.target.value)} 
              placeholder="E.g., Midterm Examination Schedule"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(val) => handleChange('type', val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input 
                required 
                type="date" 
                value={formData.date?.split('T')[0]} 
                onChange={(e) => handleChange('date', e.target.value)} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Author</Label>
            <Input 
              value={formData.author} 
              onChange={(e) => handleChange('author', e.target.value)} 
              placeholder="E.g., Academic Office"
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea 
              required 
              value={formData.content} 
              onChange={(e) => handleChange('content', e.target.value)} 
              placeholder="Announcement details..."
              rows={5}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-[#FF7F11] to-orange-600 text-white">
              {isSubmitting ? 'Saving...' : 'Save Announcement'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
