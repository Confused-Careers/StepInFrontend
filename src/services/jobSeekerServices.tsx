import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

// Profile interfaces
interface JobSeekerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  headline?: string;
  summary?: string;
  currentLocation?: string;
  preferredLocations?: string[];
  profilePictureUrl?: string;
  resumeUrl?: string;
  resumeMetadata?: any;
  createdAt: string;
  updatedAt: string;
}

interface UpdateProfileData {
  headline?: string;
  summary?: string;
  currentLocation?: string;
  preferredLocations?: string[];
}

interface ProfileResponse {
  message?: string;
  profile: JobSeekerProfile;
}

const jobSeekerServices = {
  async getProfile(): Promise<JobSeekerProfile> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<ProfileResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.profile;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to fetch profile' };
    }
  },

  async updateProfile(data: UpdateProfileData): Promise<JobSeekerProfile> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<ProfileResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/job-seeker/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.profile;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to update profile' };
    }
  },
};

export default jobSeekerServices; 