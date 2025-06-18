/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { Bell, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import notificationServices, { 
  Notification, 
  NotificationType,
  NotificationMetadata,
  ApplicationStatusMetadata,
  JobRecommendationMetadata,
  InterviewReminderMetadata,
  SystemAnnouncementMetadata
} from '@/services/notificationService';
import { format } from 'date-fns';

type ActiveTabType = 'all' | 'unread' | 'jobs' | 'system';

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<ActiveTabType>('all');
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      const currentLimit = activeTab === 'unread' ? 20 : activeTab === 'system' ? 5 : 10;
      
      switch (activeTab) {
        case 'unread':
          response = await notificationServices.getAllNotifications({ 
            status: 'unread',
            page: currentPage,
            limit: currentLimit
          });
          break;
        case 'jobs':
          response = await notificationServices.getAllNotifications({ 
            type: 'job_application',
            page: currentPage,
            limit: currentLimit
          });
          break;
        case 'system':
          response = await notificationServices.getAllNotifications({ 
            type: 'system_announcement',
            page: currentPage,
            limit: currentLimit
          });
          break;
        default:
          response = await notificationServices.getAllNotifications({ 
            page: currentPage,
            limit: currentLimit
          });
      }

      if (response?.notifications) {
        setNotifications(prev => 
          currentPage === 1 ? response.notifications : [...prev, ...response.notifications]
        );
        setUnreadCount(response.counts?.unreadCount || 0);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Polling for updates every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationServices.markAsRead([notificationId]);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationServices.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await notificationServices.deleteNotification(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      const details = await notificationServices.getSingleNotification(notification.id);
      setSelectedNotification(details);
      if (details.status === 'unread') {
        await handleMarkAsRead(details.id);
      }
    } catch (error) {
      console.error('Failed to fetch notification details:', error);
    }
  };

  const renderMetadata = (type: NotificationType, metadata: NotificationMetadata) => {
    switch (type) {
      case 'application_status_update': {
        const data = metadata as ApplicationStatusMetadata;
        return (
          <>
            <p>Company: {data.companyName}</p>
            <p>Job Title: {data.jobTitle}</p>
            <p>Status Change: {data.previousStatus} → {data.newStatus}</p>
          </>
        );
      }
      case 'job_recommendation': {
        const data = metadata as JobRecommendationMetadata;
        return (
          <>
            <p>Company: {data.companyName}</p>
            <p>Job Title: {data.jobTitle}</p>
            <p>Match Score: {Math.round(data.matchScore)}%</p>
            <p>Location: {data.location}</p>
            <p>Salary: {data.salaryRange}</p>
            <p>Matching Skills: {data.matchingSkills.join(', ')}</p>
          </>
        );
      }
      case 'interview_reminder': {
        const data = metadata as InterviewReminderMetadata;
        return (
          <>
            <p>Company: {data.companyName}</p>
            <p>Interview Type: {data.interviewType}</p>
            <p>Date: {format(new Date(data.interviewDate), 'PPp')}</p>
            <p>Interviewer: {data.interviewerName}</p>
            <p>Interviewer Title: {data.interviewerTitle}</p>
            {data.meetingLink && (
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => window.open(data.meetingLink, '_blank')}
              >
                Join Meeting
              </Button>
            )}
          </>
        );
      }
      case 'system_announcement': {
        const data = metadata as SystemAnnouncementMetadata;
        return data.maintenanceStart && data.maintenanceEnd ? (
          <>
            <p>Start: {format(new Date(data.maintenanceStart), 'PPp')}</p>
            <p>End: {format(new Date(data.maintenanceEnd), 'PPp')}</p>
          </>
        ) : null;
      }
      default:
        return null;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        {selectedNotification ? (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">Notification Details</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedNotification(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <h5 className="font-medium text-lg mb-2">{selectedNotification.title}</h5>
              <p className="text-sm text-muted-foreground mb-4">{selectedNotification.message}</p>
              <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                <p>Type: {selectedNotification.type}</p>
                <p>Status: {selectedNotification.status}</p>
                {renderMetadata(selectedNotification.type, selectedNotification.metadata)}
                <p>Created: {format(new Date(selectedNotification.createdAt), 'PPp')}</p>
                {selectedNotification.readAt && (
                  <p>Read: {format(new Date(selectedNotification.readAt), 'PPp')}</p>
                )}
              </div>
              {selectedNotification.actionUrl && (
                <Button
                  variant="default"
                  className="w-full mt-4"
                  onClick={() => window.open(selectedNotification.actionUrl, '_blank')}
                >
                  View Details
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b">
              <h4 className="font-semibold">Notifications</h4>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-sm"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTabType)}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">Unread</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              <TabsContent value={activeTab}>
                <div className="max-h-[400px] overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center">Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No notifications
                    </div>
                  ) : (
                    <>
                      {notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className="flex flex-col items-start p-4 border-b last:border-b-0 cursor-pointer"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start justify-between w-full">
                            <div className="flex-1 mr-4">
                              <h5 className="font-medium">{notification.title}</h5>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(notification.createdAt), 'PPp')}
                              </span>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              {notification.status === 'unread' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                >
                                  Mark as read
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(notification.id);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                      >
                        Load More
                      </Button>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 