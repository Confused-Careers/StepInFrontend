import axios from "axios";
import { SERVER_BASE_URL } from "@/utils/config";

export function handleAuthError(error: unknown) {
  if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
    window.location.href = "/login";
    return true;
  }
  return false;
}

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export interface ApplicantCardDto {
  resumeUrl: string | null;
  applicationId: string;
  jobSeekerId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  currentPosition: string | null;
  currentCompany: string | null;
  location: string | null;
  applicationDate: string;
  applicationStatus: 'applied' | 'in_progress' | 'interview' | 'accepted' | 'rejected' | 'withdrawn' | 'hired' | 'not_interested' | 'not_suitable';
  matchPercentage: number;
  relevanceScore?: number;
  matchingHighlights?: string[];
  skillsScore?: number;
  cultureScore?: number;
  hasCultureData?: boolean;
  latestEducation: {
    degreeType: string;
    fieldOfStudy: string;
    institutionName: string;
    graduationYear?: number | null;
    endDate?: Date | null;
  } | null;
  latestExperience: {
    positionTitle: string;
    companyName: string;
    duration?: string | null;
    startDate?: Date;
    endDate?: Date | null;
    isCurrent: boolean;
  } | null;
  strengths: string[];
  weaknesses: string[];
}

export interface ListApplicantsRequestDto {
  jobId: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface SearchApplicantsRequestDto {
  query: string;
  jobId?: string;
  limit?: number;
  filters?: {
    location?: string;
    experienceYears?: { min: number; max: number };
    skills?: string[];
    education?: string[];
  };
}

export interface SearchApplicantsResponseDto {
  data: ApplicantCardDto[];
  totalMatches: number;
  searchQuery: string;
}

export interface ProvideFeedbackDto {
  applicationId: string;
  feedback: string;
}

export interface UpdateFeedbackDto {
  feedback: string;
}

export interface FeedbackResponseDto {
  applicationId: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationWithFeedbackDto {
  applicationId: string;
  jobId: string;
  jobSeekerId: string;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrengthsWeaknessesDto {
  jobSeekerId: string;
  jobId: string;
  strengths: string[];
  weaknesses: string[];
  generatedAt: Date;
  cached: boolean;
}

export interface WhyFitsDto {
  jobSeekerId: string;
  jobId: string;
  whyFits: string[];
  generatedAt: Date;
  cached: boolean;
}

export const ApplicantsService = {
  async getApplicantProfileByUserId(userId: string): Promise<ApplicantCardDto | null> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/job-seeker/profile/${userId}`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) return null;
      return null;
    }
  },
  async getJobApplicants(request: ListApplicantsRequestDto): Promise<{ data: ApplicantCardDto[] }> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/company/jobs/${request.jobId}/applicants`, {
        headers: getAuthHeaders(),
        params: {
          status: request.status,
          page: request.page,
          limit: request.limit,
          sortBy: request.sortBy,
          sortOrder: request.sortOrder,
        },
      });
      return { data: response.data.data.data || [] };
    } catch (error) {
      if (handleAuthError(error)) return { data: [] };
      throw error;
    }
  },
  async getCompanyProfile() {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/company/profile`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error('Unauthorized');
      throw error;
    }
  },
  async searchAllApplicants(request: SearchApplicantsRequestDto): Promise<{ data: ApplicantCardDto[] }> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/company/applicants/search`, request, {
        headers: getAuthHeaders(),
      });
      return { data: response.data.data };
    } catch (error) {
      if (handleAuthError(error)) return { data: [] };
      throw error;
    }
  },
  async searchJobApplicants(request: SearchApplicantsRequestDto): Promise<SearchApplicantsResponseDto> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/company/applicants/search`, request, {
        headers: getAuthHeaders(),
        timeout: 30000, // 30 seconds timeout for AI processing
      });
      // The backend returns the data nested in response.data.data
      return {
        data: response.data.data?.data || [],
        totalMatches: response.data.data?.totalMatches || 0,
        searchQuery: response.data.data?.searchQuery || request.query
      };
    } catch (error) {
      if (handleAuthError(error)) return { data: [], totalMatches: 0, searchQuery: request.query };
      throw error;
    }
  },
  async provideFeedback(feedback: ProvideFeedbackDto): Promise<FeedbackResponseDto> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/company/applications/feedback`, feedback, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  async updateFeedback(applicationId: string, feedback: UpdateFeedbackDto): Promise<FeedbackResponseDto> {
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/api/v1/company/applications/${applicationId}/feedback`,
        feedback,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  async getApplicationsWithFeedback(jobId?: string): Promise<ApplicationWithFeedbackDto[]> {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/company/applications/feedback`, {
        headers: getAuthHeaders(),
        params: { jobId },
      });
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) return [];
      throw error;
    }
  },
  async removeFeedback(applicationId: string): Promise<{ message: string }> {
    try {
      const response = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/company/applications/${applicationId}/feedback`,
        {
          headers: getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  async acceptApplication(applicationId: string): Promise<{ message: string; status: string }> {
    try {
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/company/applications/${applicationId}/status`,
        { status: "accepted" },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  async rejectApplication(applicationId: string): Promise<{ message: string; status: string }> {
    try {
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/company/applications/${applicationId}/status`,
        { status: "rejected" },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  async markNotSuitable(applicationId: string): Promise<{ message: string; status: string }> {
    try {
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/company/applications/${applicationId}/status`,
        { status: "not_suitable" },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  async hireApplicant(applicationId: string): Promise<{ message: string; status: string }> {
    try {
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/company/applications/${applicationId}/status`,
        { status: "hired" },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  async moveToInterview(applicationId: string): Promise<{ message: string; status: string }> {
    try {
      const response = await axios.patch(
        `${SERVER_BASE_URL}/api/v1/company/applications/${applicationId}/status`,
        { status: "interview" },
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  
  async getApplicantResume(applicationId: string): Promise<any> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/applications/${applicationId}/resume`,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  
  async getApplicantInsights(jobSeekerId: string, forceRegenerate: boolean = false): Promise<any> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/applicants/${jobSeekerId}/insights`,
        { 
          headers: getAuthHeaders(),
          params: { forceRegenerate }
        }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },

  async getApplicantStrengthsWeaknesses(jobId: string, applicantId: string): Promise<StrengthsWeaknessesDto> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/jobs/${jobId}/applicants/${applicantId}/strengths-weaknesses`,
        { 
          headers: getAuthHeaders(),
          timeout: 30000, // 30 seconds timeout for AI processing
        }
      );
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
  async getApplicantWhyFits(jobId: string, applicantId: string): Promise<WhyFitsDto> {
    try {
      const response = await axios.get(
        `${SERVER_BASE_URL}/api/v1/company/jobs/${jobId}/applicants/${applicantId}/why-fits`,
        { 
          headers: getAuthHeaders(),
          timeout: 30000, // 30 seconds timeout for AI processing
        }
      );
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error("Unauthorized");
      throw error;
    }
  },
};