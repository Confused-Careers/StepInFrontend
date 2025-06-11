import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

// Interfaces
interface Education {
  id: string;
  jobSeekerId: string;
  degreeType: string;
  fieldOfStudy: string;
  institutionName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  gpaScale?: string;
  description?: string;
  thesisProject?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEducationData {
  degreeType: string;
  fieldOfStudy: string;
  institutionName: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: number;
  gpaScale?: string;
  description?: string;
  thesisProject?: string;
  displayOrder?: number;
}

export interface UpdateEducationData extends Partial<CreateEducationData> {}

interface EducationResponse {
  message?: string;
  data: Education;
}

interface EducationsResponse {
  message?: string;
  data: Education[];
}

const educationServices = {
  async createEducation(data: CreateEducationData): Promise<Education> {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Debug log
      console.log('Creating education with data:', {
        endpoint: `${SERVER_BASE_URL}/api/v1/job-seeker/education`,
        requestData: data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      
      const response: AxiosResponse<EducationResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/education`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Debug log
      console.log('Education creation response:', response.data);
      
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Education creation error:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers,
          requestData: data
        });
        throw error.response.data;
      }
      throw { message: 'Failed to create education' };
    }
  },

  async getAllEducation(): Promise<Education[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<EducationsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/education`,
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
      throw { message: 'Failed to fetch education records' };
    }
  },

  async getEducationById(id: string): Promise<Education> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<EducationResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/education/${id}`,
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
      throw { message: 'Failed to fetch education record' };
    }
  },

  async updateEducation(id: string, data: UpdateEducationData): Promise<Education> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<EducationResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/job-seeker/education/${id}`,
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
      throw { message: 'Failed to update education record' };
    }
  },

  async deleteEducation(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(
        `${SERVER_BASE_URL}/api/v1/job-seeker/education/${id}`,
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
      throw { message: 'Failed to delete education record' };
    }
  },
};

export default educationServices; 