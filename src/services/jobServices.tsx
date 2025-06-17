import axios from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

export function handleAuthError(error: unknown) {
  if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
    window.location.href = '/login';
    return true;
  }
  return false;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Utility to validate and sanitize sortOrder
const sanitizeSortOrder = (sortOrder?: string): 'ASC' | 'DESC' => {
  return sortOrder && ['ASC', 'DESC'].includes(sortOrder.toUpperCase())
    ? sortOrder.toUpperCase() as 'ASC' | 'DESC'
    : 'ASC';
};

// Utility to validate page and limit
const sanitizePagination = (page?: number, limit?: number): { page: number; limit: number } => {
  const safePage = typeof page === 'number' ? page : 1;
  const safeLimit = typeof limit === 'number' ? limit : 10;
  return {
    page: Number.isInteger(safePage) && safePage > 0 ? safePage : 1,
    limit: Number.isInteger(safeLimit) && safeLimit > 0 ? safeLimit : 10,
  };
};

export const jobServices = {
  getJobs: async (filters: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    search?: string;
    employmentType?: string;
    experienceLevel?: string;
    categoryId?: string;
    postedWithinDays?: number;
    salaryMin?: number;
    salaryMax?: number;
    location?: string;
    isRemote?: boolean;
    skills?: string[];
    languages?: string[];
    languageProficiency?: string;
    educationLevel?: string;
    fieldOfStudy?: string;
    useVectorSearch?: boolean;
    vectorWeight?: number;
  } = {}) => {
    try {
      const sanitizedFilters = {
        ...filters,
        ...sanitizePagination(filters.page, filters.limit),
        sortOrder: sanitizeSortOrder(filters.sortOrder),
        useVectorSearch: filters.useVectorSearch ?? true, // Enable vector search by default
      };

      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/jobs/matches/top`, {
        headers: getAuthHeaders(),
        params: sanitizedFilters,
      });
      console.log('Jobs response:', response.data);
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) return;
      throw error;
    }
  },

  getJobById: async (jobId: string) => {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/jobs/${jobId}`, {
        headers: getAuthHeaders(),
      });
      console.log('Job details response:', response.data);
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) return;
      throw error;
    }
  },

  getMatchExplanation: async (jobId: string) => {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/jobs/matches/${jobId}/explanation`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) return;
      throw error;
    }
  },

  getMySavedJobs: async (filters: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    companyId?: string;
    categoryId?: string;
    savedAfter?: string;
    savedBefore?: string;
  } = {}) => {
    try {
      const sanitizedFilters = {
        ...filters,
        ...sanitizePagination(filters.page, filters.limit),
        sortOrder: sanitizeSortOrder(filters.sortOrder),
      };

      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/jobs/saved/my`, {
        headers: getAuthHeaders(),
        params: sanitizedFilters,
      });
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) return;
      throw error;
    }
  },

  getMyApplications: async (filters: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    status?: string;
    companyId?: string;
    appliedAfter?: string;
    appliedBefore?: string;
  } = {}) => {
    try {
      const sanitizedFilters = {
        ...filters,
        ...sanitizePagination(filters.page, filters.limit),
        sortOrder: sanitizeSortOrder(filters.sortOrder),
      };

      const response = await axios.get(`${SERVER_BASE_URL}/api/v1/jobs/applications/my`, {
        headers: getAuthHeaders(),
        params: sanitizedFilters,
      });
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) return;
      throw error;
    }
  },

  saveJob: async (jobId: string, payload: { notes?: string } = {}) => {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/jobs/${jobId}/save`,
        payload,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) return;
      throw error;
    }
  },

  unsaveJob: async (jobId: string) => {
    try {
      const response = await axios.delete(`${SERVER_BASE_URL}/api/v1/jobs/${jobId}/save`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) return;
      throw error;
    }
  },

  updateSavedJob: async (savedJobId: string, payload: { notes?: string }) => {
    try {
      const response = await axios.put(
        `${SERVER_BASE_URL}/api/v1/jobs/saved/${savedJobId}`,
        payload,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) return;
      throw error;
    }
  },

  applyToJob: async (jobId: string, payload: { coverLetter?: string; notes?: string } = {}) => {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/jobs/${jobId}/apply`,
        payload,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (handleAuthError(error)) return;
      throw error;
    }
  },
};