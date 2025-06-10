import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

// Interfaces for request parameters
interface GetNotificationsParams {
  page?: number;
  limit?: number;
  status?: 'unread' | 'read' | 'archived';
  type?: 'job_application' | 'system_announcement';
}


// Interfaces for response data
interface NotificationMetadata {
  [key: string]: string | number | boolean | object | null | undefined;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  status: string;
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

const notificationServices = {
  async getAllNotifications(params: GetNotificationsParams = { page: 1, limit: 10 }): Promise<NotificationsResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<NotificationsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/notifications`,
        {
          params,
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
      throw { message: 'Failed to fetch notifications' };
    }
  },

  async getUnreadNotifications(page: number = 1, limit: number = 20): Promise<NotificationsResponse> {
    return this.getAllNotifications({ status: 'unread', page, limit });
  },

  async getJobApplicationNotifications(page: number = 1, limit: number = 10): Promise<NotificationsResponse> {
    return this.getAllNotifications({ type: 'job_application', page, limit });
  },

  async getSystemAnnouncements(page: number = 1, limit: number = 5): Promise<NotificationsResponse> {
    return this.getAllNotifications({ type: 'system_announcement', page, limit });
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
};

export default notificationServices;
