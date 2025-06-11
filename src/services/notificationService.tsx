import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

// Notification Types
export type NotificationType = 
  | 'job_application' 
  | 'system_announcement' 
  | 'application_status_update'
  | 'job_recommendation'
  | 'interview_reminder';

// Metadata interfaces for different notification types
export interface ApplicationStatusMetadata {
  jobId: string;
  applicationId: string;
  previousStatus: string;
  newStatus: string;
  companyName: string;
  jobTitle: string;
}

export interface JobRecommendationMetadata {
  jobId: string;
  jobTitle: string;
  companyName: string;
  matchScore: number;
  matchingSkills: string[];
  salaryRange: string;
  location: string;
}

export interface InterviewReminderMetadata {
  interviewId: string;
  applicationId: string;
  jobId: string;
  companyName: string;
  interviewDate: string;
  interviewType: string;
  meetingLink: string;
  interviewerName: string;
  interviewerTitle: string;
}

export interface SystemAnnouncementMetadata {
  maintenanceStart?: string;
  maintenanceEnd?: string;
  [key: string]: any;
}

// Union type for all metadata types
export type NotificationMetadata = 
  | ApplicationStatusMetadata 
  | JobRecommendationMetadata 
  | InterviewReminderMetadata 
  | SystemAnnouncementMetadata;

// Interfaces for request parameters
export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  status?: 'unread' | 'read' | 'archived' | '';
  type?: NotificationType | '';
}

// Interface for creating a notification
export interface CreateNotificationDto {
  title: string;
  message: string;
  type: NotificationType;
  metadata: NotificationMetadata;
  actionUrl?: string;
  isPush?: boolean;
  isEmail?: boolean;
}

// Interface for notification response
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: 'unread' | 'read' | 'archived';
  metadata: NotificationMetadata;
  actionUrl?: string;
  readAt?: string;
  isPush: boolean;
  isEmail: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface NotificationCounts {
  unreadCount: number;
  readCount: number;
  archivedCount: number;
  totalCount: number;
}

interface NotificationsResponse {
  notifications: Notification[];
  pagination: PaginationInfo;
  counts: NotificationCounts;
}

interface SuccessResponse {
  message: string;
}

// Helper function to validate metadata based on notification type
const validateNotificationMetadata = (type: NotificationType, metadata: any): boolean => {
  switch (type) {
    case 'application_status_update':
      return !!(
        metadata.jobId &&
        metadata.applicationId &&
        metadata.previousStatus &&
        metadata.newStatus &&
        metadata.companyName &&
        metadata.jobTitle
      );
    case 'job_recommendation':
      return !!(
        metadata.jobId &&
        metadata.jobTitle &&
        metadata.companyName &&
        metadata.matchScore &&
        Array.isArray(metadata.matchingSkills)
      );
    case 'interview_reminder':
      return !!(
        metadata.interviewId &&
        metadata.applicationId &&
        metadata.jobId &&
        metadata.companyName &&
        metadata.interviewDate &&
        metadata.interviewType
      );
    case 'system_announcement':
      return true; // System announcements can have flexible metadata
    default:
      return false;
  }
};

const notificationServices = {
  async getAllNotifications(params: GetNotificationsParams = { page: 1, limit: 10 }): Promise<NotificationsResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const { page = 1, limit = 10, status, type } = params;
      
      // Build URL with query parameters
      const queryParams = new URLSearchParams();
      queryParams.set('page', page.toString());
      queryParams.set('limit', limit.toString());
      queryParams.set('status', status || '');
      queryParams.set('type', type || '');

      const response: AxiosResponse<NotificationsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/notifications?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to fetch notifications' };
    }
  },

  async getUnreadNotifications(page: number = 1, limit: number = 20): Promise<NotificationsResponse> {
    return this.getAllNotifications({ 
      status: 'unread', 
      page, 
      limit
    });
  },

  async getJobApplicationNotifications(page: number = 1, limit: number = 10): Promise<NotificationsResponse> {
    return this.getAllNotifications({ 
      type: 'job_application', 
      page, 
      limit
    });
  },

  async getSystemAnnouncements(page: number = 1, limit: number = 5): Promise<NotificationsResponse> {
    return this.getAllNotifications({ 
      type: 'system_announcement', 
      page, 
      limit
    });
  },

  async getSingleNotification(notificationId: string): Promise<Notification> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<Notification> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to fetch notification' };
    }
  },

  async markAsRead(notificationIds: string[]): Promise<SuccessResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<SuccessResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/notifications/mark-as-read/bulk`,
        { notificationIds },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to mark notifications as read' };
    }
  },

  async markAllAsRead(): Promise<SuccessResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<SuccessResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/notifications/mark-as-read/all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to mark all notifications as read' };
    }
  },

  async deleteNotification(notificationId: string): Promise<SuccessResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<SuccessResponse> = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to delete notification' };
    }
  },

  async deleteAllNotifications(): Promise<SuccessResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<SuccessResponse> = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to delete all notifications' };
    }
  },

  async createNotification(data: CreateNotificationDto): Promise<Notification> {
    try {
      // Validate metadata before sending
      if (!validateNotificationMetadata(data.type, data.metadata)) {
        throw new Error('Invalid metadata for notification type');
      }

      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<Notification> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/notifications`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to create notification' };
    }
  },
};

export default notificationServices;
