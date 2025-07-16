import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, User as UserIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/types/chat.type';
import axiosInstance from '@/config/axios.config';

interface TutorWithCourse {
  
  _id: string;
  name: string;
  userEmail: string;
  profileImage?: string;
  onlineStatus: boolean;
  lastSeen: Date;
  courses?: Array<{
    id: string;
    name: string;
  }>;
}

interface NewChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUser: User;
  onCreateChat: (tutorId: string) => Promise<void>;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  open,
  onOpenChange,
  onCreateChat
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<TutorWithCourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState<string | null>(null);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch contacts from enrolled courses
  const fetchEnrolledCourseTutors = useCallback(async () => {
    if (!open) return;
    
    setLoading(true);
    try {

        setLoading(true);
        const response = await axiosInstance.post('api/v1/chat/search', { searchTerm:'' });
        setContacts(response.data.map((contact: TutorWithCourse) => ({
            ...contact,
            lastSeen: new Date(contact.lastSeen),
        })));
        console.log(contacts, 'contacts');
        setLoading(false);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    } finally {
      setLoading(false);
    }
  },[contacts, open]);

  const handleContactSelect = async (tutorId: string) => {
    setCreating(tutorId);
    try {
      await onCreateChat(tutorId);
      onOpenChange(false);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to create chat:', error);
    } finally {
      setCreating(null);
    }
  };

  const formatLastSeen = (lastSeen: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  useEffect(() => {
    fetchEnrolledCourseTutors();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Start New Chat
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tutors or courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Tutors from your enrolled courses
            </p>

            <div className="max-h-80 overflow-y-auto space-y-2">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))
              ) : filteredContacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <UserIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No contacts found</p>
                  <p className="text-sm">Try adjusting your search query</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <button
                    key={contact.name}
                    onClick={() => handleContactSelect(contact._id)}
                    disabled={creating === contact._id}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={contact.profileImage} alt={contact.name} />
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div 
                        className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-background ${
                          contact.onlineStatus ? 'bg-green-500' : 'bg-gray-400'
                        }`} 
                      />
                    </div>

                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{contact.name}</p>
                        {!contact.onlineStatus && (
                          <span className="text-xs text-muted-foreground">
                            {formatLastSeen(contact.lastSeen)}
                          </span>
                        )}
                      </div>
                      {/* <div className="flex flex-wrap gap-1 mt-1">
                        {contact.courses.slice(0, 2).map((course) => (
                          <Badge key={course.id} variant="secondary" className="text-xs">
                            {course.name}
                          </Badge>
                        ))}
                        {contact.courses.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{contact.courses.length - 2} more
                          </Badge>
                        )}
                      </div> */}
                    </div>

                    {creating === contact._id && (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};