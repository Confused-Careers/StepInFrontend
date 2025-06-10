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
  applicationId: string | null;
  jobSeekerId: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  currentPosition: string | null;
  currentCompany: string | null;
  location: string | null;
  applicationDate: string | null;
  applicationStatus: string | null;
  matchPercentage: number;
  relevanceScore?: number;
  matchingHighlights?: string[];
  latestEducation: {
    degreeType: string;
    fieldOfStudy: string;
    institutionName: string;
    graduationYear: number | null;
  } | null;
  latestExperience: {
    positionTitle: string;
    companyName: string;
    duration: string | null;
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

export const ApplicantsService = {
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
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) return { data: [] };
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

  async searchJobApplicants(request: SearchApplicantsRequestDto): Promise<{ data: ApplicantCardDto[]; totalMatches: number }> {
    try {
      const response = await axios.post(`${SERVER_BASE_URL}/api/v1/company/applicants/search`, request, {
        headers: getAuthHeaders(),
      });
      return { data: response.data.data, totalMatches: response.data.totalMatches };
    } catch (error) {
      if (handleAuthError(error)) return { data: [], totalMatches: 0 };
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
};