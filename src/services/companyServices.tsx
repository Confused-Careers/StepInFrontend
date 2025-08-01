import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

interface CompanyProfile {
  userId: any;
  data: CompanyProfile | PromiseLike<CompanyProfile>;
  location: string;
  description: string;
  website: string;
  companyName: string;
  industry: string;
  companySize: string;
  websiteUrl: string;
  companyDescription: string;
  city: string;
  logoUrl: string;
}

interface Job {
  personalityTraits: never[];
  type: string;
  responsibilities: string;
  payPeriod: string;
  totalApplications: any;
  department: string;
  data: Job | PromiseLike<Job>;
  id: string;
  title: string;
  description: string;
  requirements: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  applicationDeadline?: string;
  applicationsCount: number;
  status: string;
  requiredSkills: string[];
  requiredLanguages?: Array<{
    languageId: string;
    proficiencyLevel: string;
    isRequired: boolean;
  }>;
  requiredCertifications?: Array<{
    certificationId: string;
    isRequired: boolean;
    minimumYears?: number;
  }>;
  requiredEducation?: Array<{
    educationLevel: string;
    fieldOfStudy: string;
    isRequired: boolean;
  }>;
  company: {
    industry: string;
    companyName: string;
    logoUrl?: string;

  };
  createdAt: string;
}

interface CreateJobData {
  data?: CreateJobData | PromiseLike<CreateJobData>;
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  employmentType: string;
  experienceLevel: string;
  location: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  applicationDeadline?: string;
  requiredSkills?: string[];
  requiredLanguages?: Array<{
    languageId: string;
    proficiencyLevel: string;
    isRequired: boolean;
  }>;
  requiredCertifications?: Array<{
    certificationId: string;
    isRequired: boolean;
    minimumYears?: number;
  }>;
  requiredEducation?: Array<{
    educationLevel: string;
    fieldOfStudy: string;
    isRequired: boolean;
  }>;
  type: string; // 'public' | 'private';
}

interface JobInsights {
  data: JobInsights | PromiseLike<JobInsights>;
  jobId: string;
  title: string;
  totalApplications: number;
  viewsCount: number;
  applicationsByStatus: {
    applied: number;
    in_progress: number;
    interview: number;
    rejected: number;
    withdrawn: number;
    hired: number;
  };
  applicationsByExperience: {
    entry: number;
    mid: number;
    senior: number;
    lead: number;
    executive: number;
  };
  averageApplicationTime: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Application {
  data: Application | PromiseLike<Application>;
  id: string;
  jobSeeker: {
    id: string;
    firstName: string;
    lastName: string;
    education: Array<{
      degree: string;
      fieldOfStudy: string;
      institution: string;
    }>;
    currentEmployment: {
      companyName: string;
      position: string;
    } | null;
    skills: string[];
    experienceLevel: string;
    location: string;
  };
  status: string;
  matchScore: number;
  createdAt: string;
}

interface SearchApplicantsRequest {
  query: string;
  jobId?: string;
  limit?: number;
  filters?: {
    experienceYears?: {
      min?: number;
      max?: number;
    };
    location?: string;
    skills?: string[];
    education?: string[];
  };
}

interface ApplicantSearchResult {
  applicationId: string;
  jobSeekerId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  resumeUrl: string | null;
  currentPosition: string | null;
  currentCompany: string | null;
  location: string | null;
  applicationDate: Date | null;
  applicationStatus: string | null;
  matchPercentage: number;
  relevanceScore: number;
  matchingHighlights: string[];
  latestEducation: {
    degreeType: string;
    fieldOfStudy: string;
    institutionName: string;
    endDate: Date | null;
  } | null;
  latestExperience: {
    positionTitle: string;
    companyName: string;
    startDate: Date;
    endDate: Date | null;
    isCurrent: boolean;
  } | null;
  strengths: string[];
  weaknesses: string[];
  skillsScore?: number;
  cultureScore?: number;
  hasCultureData?: boolean;
}

interface SearchApplicantsResponse {
  data: ApplicantSearchResult[];
  totalMatches: number;
  searchQuery: string;
}

interface UploadResponse {
  logoUrl: string;
  message: string;
}

interface DeleteResponse {
  message: string;
}

interface ErrorResponse {
  message: string;
}

interface ApplicantStrengthsWeaknessesResponse {
  jobSeekerId: string;
  jobId: string;
  strengths: string[];
  weaknesses: string[];
  generatedAt: Date;
  cached: boolean;
}

export function handleAuthError(error: unknown) {
  if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
    window.location.href = '/company/login';
    return true;
  }
  return false;
}

const companyServices = {
  async getProfile(): Promise<CompanyProfile> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<CompanyProfile> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/profile`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to fetch company profile' } as ErrorResponse;
    }
  },

  async updateProfile(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<CompanyProfile> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/company/profile`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to update company profile' } as ErrorResponse;
    }
  },

  async uploadLogo(file: File): Promise<UploadResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('file', file);
      const response: AxiosResponse<{ data: UploadResponse }> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/company/logo/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to upload company logo' } as ErrorResponse;
    }
  },

  async createJob(data: CreateJobData): Promise<Job> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<Job> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/company/jobs`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to create job posting' } as ErrorResponse;
    }
  },

  async getCompanyJobs(): Promise<Job[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<{data: Job[]}> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/jobs`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to fetch company jobs' } as ErrorResponse;
    }
  },

  async getJob(jobId: string): Promise<Job> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<Job> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/jobs/${jobId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to fetch job details' } as ErrorResponse;
    }
  },

  async updateJob(jobId: string, data: Partial<CreateJobData>): Promise<Job> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<Job> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/company/jobs/${jobId}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to update job posting' } as ErrorResponse;
    }
  },

  async deleteJob(jobId: string): Promise<DeleteResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<DeleteResponse> = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/company/jobs/${jobId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to delete job posting' } as ErrorResponse;
    }
  },

  async getJobInsights(jobId: string): Promise<JobInsights> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<JobInsights> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/jobs/${jobId}/insights`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to fetch job insights' } as ErrorResponse;
    }
  },

  async getJobApplications(jobId: string): Promise<Application[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<Application[]> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/jobs/${jobId}/applications`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to fetch job applications' } as ErrorResponse;
    }
  },

  async searchApplicants(searchParams: SearchApplicantsRequest): Promise<SearchApplicantsResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<SearchApplicantsResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/company/applicants/search`,
        searchParams,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to search applicants' } as ErrorResponse;
    }
  },

  async getApplicantStrengthsWeaknesses(jobId: string, applicantId: string): Promise<ApplicantStrengthsWeaknessesResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<{ data: ApplicantStrengthsWeaknessesResponse }> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/jobs/${jobId}/applicants/${applicantId}/strengths-weaknesses`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: unknown) {
      if (handleAuthError(error)) {
        return Promise.reject('Unauthorized access, redirecting to login');
      }
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to fetch applicant strengths and weaknesses' } as ErrorResponse;
    }
  },
};

export default companyServices;