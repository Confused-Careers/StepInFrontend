import axios from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';
import { handleAuthError, getAuthHeaders } from './applicantServices'; // Reuse auth utilities

export interface CreateChatDto {
  jobSeekerId: string;
  companyId: string;
}

export interface ChatResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  fileUrl?: string;
  fileName?: string;
  type: 'TEXT' | 'FILE' | 'SYSTEM';
  status: 'SENT' | 'DELIVERED' | 'READ';
  createdAt: string;
}

export interface Chat {
  id: string;
  jobSeeker: any;
  company: any;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleInterviewDto {
  chatId: string;
  scheduledAt: string;
  meetingLink: string;
  notes?: string;
}

export const ChatService = {
  async createChat(data: CreateChatDto): Promise<ChatResponse> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/chat/create`, data, {
        headers: getAuthHeaders(),
      });
      console.log('[DEBUG] createChat response:', response.data);
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error('Unauthorized');
      console.error('[DEBUG] createChat error:', error);
      throw error;
    }
  },

  async getUserChats(userId: string): Promise<Chat[]> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/chat/user-chats?userId=${userId}`, {
        headers: getAuthHeaders(),
      });
      console.log('[DEBUG] getUserChats response:', response.data);
      return response.data.data || [];
    } catch (error) {
      if (handleAuthError(error)) return [];
      console.error('[DEBUG] getUserChats error:', error);
      throw error;
    }
  },

  async getChatHistory(chatId: string): Promise<Message[]> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/chat/history?chatId=${chatId}`, {
        headers: getAuthHeaders(),
      });
      console.log('[DEBUG] getChatHistory response:', response.data);
      return response.data.data || [];
    } catch (error) {
      if (handleAuthError(error)) return [];
      console.error('[DEBUG] getChatHistory error:', error);
      throw error;
    }
  },

  async sendMessage({ chatId, senderId, content, file }: { chatId: string; senderId: string; content: string; file?: File }): Promise<Message> {
    try {
      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('senderId', senderId);
      formData.append('content', content);
      if (file) {
        console.log('[DEBUG] Uploading file:', file.name, `(${file.size} bytes, type: ${file.type})`);
        formData.append('file', file);
      }
      console.log('[DEBUG] Sending message to /api/v1/chat/message:', {
        chatId,
        senderId,
        content,
        file: file ? file.name : undefined,
      });
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/chat/message`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[DEBUG] sendMessage response:', response.data);
      if (file && (!response.data.data.fileUrl || !response.data.data.fileName)) {
        console.error('[DEBUG] sendMessage response missing fileUrl or fileName:', response.data.data);
        throw new Error('Server failed to process file metadata');
      }
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error('Unauthorized');
      console.error('[DEBUG] sendMessage error:', error);
      throw error;
    }
  },

  async uploadDocument({ chatId, file }: { chatId: string; file: File }): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('chatId', chatId);
      formData.append('file', file);
      console.log('[DEBUG] uploadDocument FormData:', {
        chatId,
        file: file.name,
        fileSize: file.size,
        fileType: file.type,
      });
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/chat/document`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[DEBUG] uploadDocument response:', response.data);
      if (!response.data.data.fileUrl) {
        console.error('[DEBUG] uploadDocument response missing fileUrl:', response.data);
        throw new Error('File upload failed: No fileUrl in response');
      }
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error('Unauthorized');
      console.error('[DEBUG] uploadDocument error:', error);
      throw error;
    }
  },

  async scheduleInterview({ chatId, scheduledAt, meetingLink, notes }: { chatId: string; scheduledAt: string; meetingLink: string; notes?: string }): Promise<any> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/chat/schedule`, { chatId, scheduledAt, meetingLink, notes }, {
        headers: getAuthHeaders(),
      });
      console.log('[DEBUG] scheduleInterview response:', response.data);
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error('Unauthorized');
      console.error('[DEBUG] scheduleInterview error:', error);
      throw error;
    }
  },

  async searchMessages(chatId: string, keyword: string): Promise<Message[]> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/chat/search-messages?chatId=${chatId}&keyword=${encodeURIComponent(keyword)}`, {
        headers: getAuthHeaders(),
      });
      console.log('[DEBUG] searchMessages response:', response.data);
      return response.data.data || [];
    } catch (error) {
      if (handleAuthError(error)) return [];
      console.error('[DEBUG] searchMessages error:', error);
      throw error;
    }
  },

  async getOnlineUsers(userIds: string[]): Promise<Record<string, boolean>> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/chat/online-users?userIds=${userIds.join(',')}`, {
        headers: getAuthHeaders(),
      });
      console.log('[DEBUG] getOnlineUsers response:', response.data);
      return response.data.data || {};
    } catch (error) {
      if (handleAuthError(error)) return {};
      console.error('[DEBUG] getOnlineUsers error:', error);
      throw error;
    }
  },

  async getChatByParticipants(params: { jobSeekerId: string; companyId: string }): Promise<Chat | null> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/chat/participants`, {
        headers: getAuthHeaders(),
        params,
      });
      console.log('[DEBUG] getChatByParticipants response:', response.data);
      return response.data.data || null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        console.log('[DEBUG] No chat found for participants:', params);
        return null; // No chat found
      }
      console.error('[DEBUG] getChatByParticipants error:', error);
      throw error;
    }
  },
};