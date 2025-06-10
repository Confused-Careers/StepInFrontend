import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

// Interfaces
interface WorkExperience {
  id: string;
  jobSeekerId: string;
  companyName: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  description?: string;
  achievements?: string[];
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateWorkExperienceData {
  companyName: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  description?: string;
  achievements?: string[];
  displayOrder?: number;
}

interface UpdateWorkExperienceData extends Partial<CreateWorkExperienceData> {}

interface WorkExperienceResponse {
  message?: string;
  data: WorkExperience;
}

interface WorkExperiencesResponse {
  message?: string;
  data: WorkExperience[];
}

const workExperienceServices = {
  async createWorkExperience(data: CreateWorkExperienceData): Promise<WorkExperience> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<WorkExperienceResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/work-experiences`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to create work experience' };
    }
  },

  async getAllWorkExperiences(): Promise<WorkExperience[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<WorkExperiencesResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/work-experiences`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to fetch work experiences' };
    }
  },

  async getWorkExperienceById(id: string): Promise<WorkExperience> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<WorkExperienceResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/work-experiences/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to fetch work experience' };
    }
  },

  async updateWorkExperience(id: string, data: UpdateWorkExperienceData): Promise<WorkExperience> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<WorkExperienceResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/job-seeker/work-experiences/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to update work experience' };
    }
  },

  async deleteWorkExperience(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(
        `${SERVER_BASE_URL}/api/v1/job-seeker/work-experiences/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to delete work experience' };
    }
  },
};

export default workExperienceServices; 