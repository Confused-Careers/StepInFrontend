import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

// Profile completion interfaces
export interface ProfileCompletionDetails {
  overallPercentage: number;
  sections: {
    basicInfo: { percentage: number; completed: boolean };
    aboutMe: { percentage: number; completed: boolean };
    workExperience: { percentage: number; completed: boolean };
    education: { percentage: number; completed: boolean };
    skills: { percentage: number; completed: boolean };
    resume: { percentage: number; completed: boolean };
    mcqAnswers: { percentage: number; completed: boolean };
  };
  isEligibleForJobs: boolean;
  missingRequirements?: string[];
}

// Profile interfaces
interface JobSeekerProfile {
  data: <T>(data: T) => T;
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string;
  profilePictureUrl: string | null;
  resumeUrl: string | null;
  portfolioUrl: string | null;
  aboutMe: string | null;
  currentPosition: string | null;
  currentCompany: string | null;
  location: string | null;
  preferredLocation: string | null;
  expectedSalaryMin: number | null;
  expectedSalaryMax: number | null;
  availability: string | null;
  profileViewsCount: number;
  onboardingCompleted: boolean;
  currentTier: number;
  questionsAnsweredInCurrentTier: number;
  totalQuestionsAnswered: number;
  createdAt: string;
  updatedAt: string;
  personalityTraits?: string[];
  workPreferences?: string[];
  idealEnvironment?: string;
}

interface UpdateProfileData {
  aboutMe?: string;
  currentPosition?: string;
  currentCompany?: string;
  location?: string;
  preferredLocation?: string;
  expectedSalaryMin?: number;
  expectedSalaryMax?: number;
  availability?: string;
  portfolioUrl?: string;
  phone?: string;
  personalityTraits?: string[];
  workPreferences?: string[];
  idealEnvironment?: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const jobSeekerServices = {
  async getProfile(): Promise<JobSeekerProfile> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<ApiResponse<JobSeekerProfile>> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/profile`,
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
      throw { message: 'Failed to fetch profile' };
    }
  },

  async updateProfile(data: UpdateProfileData): Promise<JobSeekerProfile> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      if (data.expectedSalaryMin && data.expectedSalaryMax && 
          data.expectedSalaryMin > data.expectedSalaryMax) {
        throw new Error('Minimum salary cannot be greater than maximum salary');
      }

      const response: AxiosResponse<ApiResponse<JobSeekerProfile>> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/job-seeker/profile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to update profile' };
    }
  },

  getProfileCompletion: async (): Promise<ProfileCompletionDetails> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw { message: 'No access token found' };
    }

    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/profile/completion`,
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
      throw { message: 'Failed to fetch profile completion' };
    }
  },
};

export default jobSeekerServices; 