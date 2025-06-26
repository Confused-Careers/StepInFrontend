import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

interface LoginData {
  email: string;
  password: string;
}

interface CompanyRegisterData {
  email: string;
  password: string;
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  description: string;
  location: string;
}

interface CompanyLoginData {
  email: string;
  password: string;
}

interface GoogleLoginData {
  idToken: string;
}

interface VerifyEmailData {
  email: string;
  otpCode: string;
}

interface ResendOtpData {
  email: string;
  otpType: string;
}

interface ForgotPasswordData {
  email: string;
}

interface ResetPasswordData {
  email: string;
  otpCode: string;
  newPassword: string;
}

interface AuthResponse {
  data?: AuthResponse;
  message: string;
  accessToken?: string;
  user?: {
    id: string;
    email: string;
    userType: string;
    isVerified: boolean;
    emailVerified: boolean;
    firstName?: string;
    lastName?: string;
    onboardingCompleted?: boolean;
  };
}

interface UploadResponse {
  resumeUrl: string;
  message: string;
}

interface Question {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  insight?: string;
}

interface JobMatch {
  jobId: string;
  title: string;
  company: string;
  location: string;
  matchPercentage: number;
  employmentType: string;
  salary?: string;
  category?: string;
}

interface JobMatchExplanation {
  jobId: string;
  overallMatchScore: number;
  skillsMatchScore: number;
  cultureFitScore: number;
  explanation: string;
}

const authServices = {
  async register(data: FormData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/register`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Registration failed');
      }
      throw new Error('Registration failed');
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/login`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Login failed');
      }
      throw new Error('Login failed');
    }
  },

  async registerCompany(data: CompanyRegisterData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/company/register`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Registration failed' };
    }
  },

  async companyLogin(data: CompanyLoginData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/company/login`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (!response.data.data) {
        throw new Error('Invalid response from server');
      }
      return response.data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Login failed' };
    }
  },

  async googleAuth(data: FormData): Promise<AuthResponse> {
    try {
      console.log('Google Auth Data:', Object.fromEntries(data));
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/google`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Google Sign-In failed');
      }
      throw new Error('Google Sign-In failed');
    }
  },

  async googleLogin(data: GoogleLoginData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/google/login`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Google Login failed');
      }
      throw new Error('Google Login failed');
    }
  },

  async verifyEmail(data: VerifyEmailData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/verify-email`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Email verification failed');
      }
      throw new Error('Email verification failed');
    }
  },

  async resendOtp(data: ResendOtpData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/resend-otp`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Authentication Code resend failed');
      }
      throw new Error('Authentication Code resend failed');
    }
  },

  async forgotPassword(data: ForgotPasswordData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/forgot-password`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Password reset request failed');
      }
      throw new Error('Password reset request failed');
    }
  },

  async resetPassword(data: ResetPasswordData): Promise<AuthResponse> {
    try {
      const response: AxiosResponse<AuthResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/auth/reset-password`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Password reset failed');
      }
      throw new Error('Password reset failed');
    }
  },

  async uploadResume(formData: FormData): Promise<UploadResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const response: AxiosResponse<UploadResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/resume/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Resume upload failed');
      }
      throw new Error('Resume upload failed');
    }
  },

  async getOnboardingQuestion(): Promise<{ questions: Question[] }> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const response: AxiosResponse<{ questions: Question[] }> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/questions/onboarding`,
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
        throw new Error(error.response.data.message || 'Failed to fetch onboarding questions');
      }
      throw new Error('Failed to fetch onboarding questions');
    }
  },

  async getJobMatches(params: {
    k?: number;
    location?: string;
    salaryMin?: number;
    salaryMax?: number;
    employmentType?: string;
    isRemote?: boolean;
    companyId?: string;
    categoryId?: string;
    experienceLevel?: string;
  }): Promise<{ matches: JobMatch[] }> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const response: AxiosResponse<{ matches: JobMatch[] }> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/jobs/matches/top`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          params: {
            k: params.k || 20,
            location: params.location || '',
            salaryMin: params.salaryMin || undefined,
            salaryMax: params.salaryMax || undefined,
            employmentType: params.employmentType || '',
            isRemote: params.isRemote || undefined,
            companyId: params.companyId || undefined,
            categoryId: params.categoryId || undefined,
            experienceLevel: params.experienceLevel || undefined,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch job matches');
      }
      throw new Error('Failed to fetch job matches');
    }
  },

  async getJobMatchExplanation(jobId: string): Promise<JobMatchExplanation> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No access token found');
      }
      const response: AxiosResponse<JobMatchExplanation> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/jobs/matches/${jobId}/explanation`,
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
        throw new Error(error.response.data.message || 'Failed to fetch job match explanation');
      }
      throw new Error('Failed to fetch job match explanation');
    }
  },
};

export default authServices;