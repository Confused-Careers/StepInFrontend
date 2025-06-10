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
import notificationServices from '@/services/notificationService';
import { format } from 'date-fns';

export function NotificationDropdown() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage,] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState<any>(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'unread':
          response = await notificationServices.getUnreadNotifications(currentPage);
          break;
        case 'jobs':
          response = await notificationServices.getJobApplicationNotifications(currentPage);
          break;
        case 'system':
          response = await notificationServices.getSystemAnnouncements(currentPage);
          break;
        default:
          response = await notificationServices.getAllNotifications({ page: currentPage });
      }
      setNotifications(response.notifications);
      setUnreadCount(response.counts.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
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

  const handleNotificationClick = async (notification: any) => {
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
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="jobs" className="flex-1">Jobs</TabsTrigger>
                <TabsTrigger value="system" className="flex-1">Announcements</TabsTrigger>
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
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="flex flex-col items-start p-4 border-b last:border-b-0 cursor-pointer"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start justify-between w-full">
                          <div>
                            <h5 className="font-medium">{notification.title}</h5>
                            <p className="text-sm text-muted-foreground">
                              {notification.message}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(notification.createdAt), 'PPp')}
                            </span>
                          </div>
                          <div className="flex gap-2">
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
                    ))
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