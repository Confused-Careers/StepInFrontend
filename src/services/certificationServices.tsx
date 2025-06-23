import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

interface Certification {
  id: string;
  jobSeekerId: string;
  certificationName: string;
  issuingOrganization: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateCertificationData {
  certificationName: string;
  issuingOrganization: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  description?: string;
  displayOrder?: number;
}

export interface UpdateCertificationData extends Partial<CreateCertificationData> {}

interface CertificationResponse {
  message?: string;
  data: Certification;
}

interface CertificationsResponse {
  message?: string;
  data: Certification[];
}

const certificationServices = {
  async createCertification(data: CreateCertificationData): Promise<Certification> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<CertificationResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/certifications`,
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
        console.error('Certification creation error:', {
          status: error.response.status,
          data: error.response.data,
          requestData: data,
        });
        throw error.response.data;
      }
      throw { message: 'Failed to create certification' };
    }
  },

  async getAllCertifications(): Promise<Certification[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<CertificationsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/certifications`,
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
      throw { message: 'Failed to fetch certifications' };
    }
  },

  async getCertificationById(id: string): Promise<Certification> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<CertificationResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/certifications/${id}`,
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
      throw { message: 'Failed to fetch certification' };
    }
  },

  async updateCertification(id: string, data: UpdateCertificationData): Promise<Certification> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<CertificationResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/job-seeker/certifications/${id}`,
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
      throw { message: 'Failed to update certification' };
    }
  },

  async deleteCertification(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${SERVER_BASE_URL}/api/v1/job-seeker/certifications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to delete certification' };
    }
  },
};

export default certificationServices;