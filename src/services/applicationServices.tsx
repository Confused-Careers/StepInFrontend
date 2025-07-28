import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

export enum ApplicationStatus {
  APPLIED = 'applied',
  IN_PROGRESS = 'in_progress',
  INTERVIEW = 'interview',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  HIRED = 'hired',
}

export interface Application {
  id: string;
  job: {
    matchScore: any;
    company: { companyName: string; logoUrl?: string; industry?: string };
    id: string;
    title: string;
    employmentType: string;
    location: string;
    isRemote: boolean;
    salaryMin?: number;
    salaryMax?: number;
    payPeriod?: string;
    requiredSkills?: string[];
    department?: string;
    description?: string;
    requirements?: string;
    responsibilities?: string;
    experienceLevel?: string;
    applicationDeadline?: string;
    category?: {
      categoryName: string;
      description?: string | null;
    };
    requiredLanguages?: Array<{
      id: string;
      languageName: string;
      languageCode: string;
      proficiencyLevel: string;
      isRequired: boolean;
    }>;
    requiredCertifications?: Array<{
      id: string;
      certificationName: string;
      isRequired: boolean;
    }>;
    requiredEducation?: Array<{
      id: string;
      educationLevel: string;
      fieldOfStudy: string;
      isRequired: boolean;
    }>;
    hasApplied?: boolean;
    isSaved?: boolean;
  };
  company: {
    companyName: string;
    logoUrl?: string;
    industry?: string;
  };
  applicationDate: string;
  status: ApplicationStatus | 'first-round' | 'under-review' | 'offer';
  nextStep?: string;
  nextStepDate?: string;
  feedback?: string;
  matchScore?: number;
  jobSeekerUserId?: string;
  companyUserId?: string;
}

interface SavedJob {
  id: string;
  job: {
    id: string;
    title: string;
    employmentType: string;
    location: string;
    isRemote: boolean;
    salaryMin?: number;
    salaryMax?: number;
    requiredSkills?: string[];
    department?: string;
    description?: string;
  };
  company: {
    companyName: string;
    logoUrl?: string;
    industry?: string;
  };
  savedDate: string;
  notes?: string;
  matchScore?: number;
}

interface ApplicationsListResponse {
  applications: Application[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  summary: {
    totalApplications: number;
    statusCounts: {
      applied: number;
      in_progress: number;
      interview: number;
      rejected: number;
      withdrawn: number;
      hired: number;
    };
  };
}

interface SavedJobsResponse {
  savedJobs: SavedJob[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface ErrorResponse {
  message: string;
}

// --- API response types for mapping ---
interface ApiCompany {
  id?: string;
  companyName?: string;
  logoUrl?: string;
  industry?: string;
}

interface ApiJob {
  id?: string;
  title?: string;
  employmentType?: string;
  isRemote?: boolean;
  location?: string;
  company?: ApiCompany;
  salaryMin?: string;
  salaryMax?: string;
  payPeriod?: string;
  industry?: string;
  requiredSkills?: Array<{
    id: string;
    skillName: string;
    isRequired: boolean;
    proficiencyLevel: string;
    yearsOfExperience?: number | null;
  }>;
  department?: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  experienceLevel?: string;
  applicationDeadline?: string;
  category?: {
    id: string;
    categoryName: string;
    description?: string | null;
  };
  requiredLanguages?: Array<{
    id: string;
    languageName: string;
    languageCode: string;
    proficiencyLevel: string;
    isRequired: boolean;
  }>;
  requiredCertifications?: Array<{
    id: string;
    certificationName: string;
    isRequired: boolean;
  }>;
  requiredEducation?: Array<{
    id: string;
    educationLevel: string;
    fieldOfStudy: string;
    isRequired: boolean;
  }>;
  hasApplied?: boolean;
  isSaved?: boolean;
  matchScore?: number;
}

interface ApiApplication {
  id?: string;
  job?: ApiJob;
  jobId?: string;
  jobSeekerId?: string;
  jobSeekerUserId?: string;
  companyUserId?: string;
  applicationDate?: string;
  lastUpdated?: string;
  status?: ApplicationStatus;
  interviewScheduledAt?: string;
  notes?: string;
  coverLetter?: string;
  matchScore?: number;
}

interface ApiSavedJob {
  id?: string;
  job?: ApiJob;
  company?: ApiCompany;
  savedDate?: string;
  notes?: string;
  matchScore?: number;
}

// Updated API response interface for getUserApplications
interface ApiResponse {
  statusCode: number;
  message: string;
  data: {
    applications?: ApiApplication[];
    pagination?: ApplicationsListResponse['pagination'];
    summary?: ApplicationsListResponse['summary'];
  };
}

// API response interface for getJobDetails
interface ApiJobResponse {
  statusCode: number;
  message: string;
  data: ApiJob;
}

const applicationServices = {
  async getUserApplications(filters: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    status?: ApplicationStatus;
    companyId?: string;
    appliedAfter?: string;
    appliedBefore?: string;
  } = {}): Promise<ApplicationsListResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const query = new URLSearchParams({
        page: filters.page?.toString() ?? '1',
        limit: filters.limit?.toString() ?? '10',
        sortBy: filters.sortBy ?? 'applicationDate',
        sortOrder: filters.sortOrder ?? 'desc',
        ...(filters.status ? { status: filters.status } : {}),
        ...(filters.companyId ? { companyId: filters.companyId } : {}),
        ...(filters.appliedAfter ? { appliedAfter: filters.appliedAfter } : {}),
        ...(filters.appliedBefore ? { appliedBefore: filters.appliedBefore } : {}),
      }).toString();

      const response: AxiosResponse<ApiResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/jobs/applications/my?${query}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data.data || response.data;
      const applications = responseData.applications || [];

      // Fetch detailed job information for each application to get matchScore and other fields
      const enrichedApplications = await Promise.all(
        applications.map(async (app): Promise<Application> => {
          try {
            const jobDetails = await applicationServices.getJobDetails(app?.job?.id ?? app?.jobId ?? '');
            return {
              id: app?.id ?? '',
              job: {
                id: jobDetails?.id ?? '',
                title: jobDetails?.title ?? 'Unknown',
                employmentType: jobDetails?.employmentType ?? 'Unknown',
                location: jobDetails?.isRemote ? 'Remote' : jobDetails?.location ?? 'Unknown',
                isRemote: jobDetails?.isRemote ?? false,
                salaryMin: jobDetails?.salaryMin,
                salaryMax: jobDetails?.salaryMax,
                payPeriod: jobDetails?.payPeriod ?? undefined,
                requiredSkills: jobDetails?.requiredSkills ?? [],
                department: jobDetails?.department ?? undefined,
                description: jobDetails?.description ?? '',
                requirements: jobDetails?.requirements ?? undefined,
                responsibilities: jobDetails?.responsibilities ?? undefined,
                experienceLevel: jobDetails?.experienceLevel ?? undefined,
                applicationDeadline: jobDetails?.applicationDeadline,
                category: jobDetails?.category,
                requiredLanguages: jobDetails?.requiredLanguages ?? [],
                requiredCertifications: jobDetails?.requiredCertifications ?? [],
                requiredEducation: jobDetails?.requiredEducation ?? [],
                hasApplied: jobDetails?.hasApplied ?? false,
                isSaved: jobDetails?.isSaved ?? false,
                company: {
                  companyName: jobDetails?.company?.companyName ?? 'Unknown',
                  logoUrl: jobDetails?.company?.logoUrl ?? undefined,
                  industry: jobDetails?.company?.industry ?? undefined,
                },
                matchScore: app?.matchScore ?? jobDetails?.matchScore ?? undefined
              },
              company: {
                companyName: jobDetails?.company?.companyName ?? 'Unknown',
                logoUrl: jobDetails?.company?.logoUrl ?? undefined,
                industry: jobDetails?.company?.industry ?? undefined,
              },
              applicationDate: app?.applicationDate
                ? new Date(app.applicationDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Unknown',
              status: mapStatus(app?.status ?? ApplicationStatus.APPLIED),
              nextStep: deriveNextStep(app?.status ?? ApplicationStatus.APPLIED, app?.interviewScheduledAt),
              nextStepDate: app?.interviewScheduledAt
                ? new Date(app.interviewScheduledAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })
                : undefined,
              feedback: app?.notes ?? app?.coverLetter ?? 'No feedback provided',
              matchScore: app?.matchScore ?? (jobDetails?.matchScore ? Number(jobDetails.matchScore) : undefined),
              jobSeekerUserId: app?.jobSeekerUserId,
              companyUserId: app?.companyUserId,
            };
          } catch (error) {
            console.error(`Error fetching job details for job ${app?.job?.id ?? app?.jobId}:`, error);
            return {
              id: app?.id ?? '',
              job: {
                id: app?.job?.id ?? app?.jobId ?? '',
                title: app?.job?.title ?? 'Unknown',
                employmentType: app?.job?.employmentType ?? 'Unknown',
                location: app?.job?.isRemote ? 'Remote' : app?.job?.location ?? 'Unknown',
                isRemote: app?.job?.isRemote ?? false,
                salaryMin: app?.job?.salaryMin ? Number(app.job.salaryMin) : undefined,
                salaryMax: app?.job?.salaryMax ? Number(app.job.salaryMax) : undefined,
                payPeriod: app?.job?.payPeriod ?? undefined,
                requiredSkills: app?.job?.requiredSkills?.map((skill: any) => skill.skillName) ?? [],
                department: app?.job?.department ?? undefined,
                description: app?.job?.description ?? '',
                requirements: undefined,
                responsibilities: undefined,
                experienceLevel: undefined,
                applicationDeadline: undefined,
                category: undefined,
                requiredLanguages: [],
                requiredCertifications: [],
                requiredEducation: [],
                hasApplied: false,
                isSaved: false,
                company: {
                  companyName: app?.job?.company?.companyName ?? 'Unknown',
                  logoUrl: app?.job?.company?.logoUrl ?? undefined,
                  industry: app?.job?.company?.industry ?? undefined,
                },
                matchScore: app?.matchScore
              },
              company: {
                companyName: app?.job?.company?.companyName ?? 'Unknown',
                logoUrl: app?.job?.company?.logoUrl ?? undefined,
                industry: app?.job?.company?.industry ?? undefined,
              },
              applicationDate: app?.applicationDate
                ? new Date(app.applicationDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Unknown',
              status: mapStatus(app?.status ?? ApplicationStatus.APPLIED),
              nextStep: deriveNextStep(app?.status ?? ApplicationStatus.APPLIED, app?.interviewScheduledAt),
              nextStepDate: app?.interviewScheduledAt
                ? new Date(app.interviewScheduledAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                  })
                : undefined,
              feedback: app?.notes ?? app?.coverLetter ?? 'No feedback provided',
              matchScore: app?.matchScore,
              jobSeekerUserId: app?.jobSeekerUserId,
              companyUserId: app?.companyUserId,
            };
          }
        })
      );

      return {
        applications: enrichedApplications,
        pagination: responseData.pagination ?? {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
        summary: responseData.summary ?? {
          totalApplications: 0,
          statusCounts: {
            applied: 0,
            in_progress: 0,
            interview: 0,
            rejected: 0,
            withdrawn: 0,
            hired: 0,
          },
        },
      };
    } catch (error: unknown) {
      console.error('Error fetching applications:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to fetch applications' } as ErrorResponse;
    }
  },

  async getJobDetails(jobId: string): Promise<Application['job']> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<ApiJobResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/jobs/${jobId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const jobData = response.data.data;

      return {
        id: jobData?.id ?? '',
        title: jobData?.title ?? 'Unknown',
        employmentType: jobData?.employmentType ?? 'Unknown',
        location: jobData?.isRemote ? 'Remote' : jobData?.location ?? 'Unknown',
        isRemote: jobData?.isRemote ?? false,
        salaryMin: jobData?.salaryMin ? Number(jobData.salaryMin) : undefined,
        salaryMax: jobData?.salaryMax ? Number(jobData.salaryMax) : undefined,
        payPeriod: jobData?.payPeriod ?? undefined,
        requiredSkills: jobData?.requiredSkills?.map((skill: any) => skill.skillName) ?? [],
        department: jobData?.department ?? undefined,
        description: jobData?.description ?? undefined,
        requirements: jobData?.requirements ?? undefined,
        responsibilities: jobData?.responsibilities ?? undefined,
        experienceLevel: jobData?.experienceLevel ?? undefined,
        applicationDeadline: jobData?.applicationDeadline
          ? new Date(jobData.applicationDeadline).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })
          : undefined,
        category: jobData?.category
          ? {
              categoryName: jobData.category.categoryName ?? 'Unknown',
              description: jobData.category.description ?? undefined,
            }
          : undefined,
        requiredLanguages: jobData?.requiredLanguages ?? [],
        requiredCertifications: jobData?.requiredCertifications ?? [],
        requiredEducation: jobData?.requiredEducation ?? [],
        hasApplied: jobData?.hasApplied ?? false,
        isSaved: jobData?.isSaved ?? false,
        company: {
          companyName: jobData?.company?.companyName ?? 'Unknown',
          logoUrl: jobData?.company?.logoUrl ?? undefined,
          industry: jobData?.company?.industry ?? undefined,
        },
        matchScore: jobData?.matchScore ? Number(jobData.matchScore) : undefined,
      };
    } catch (error: unknown) {
      console.error('Error fetching job details:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to fetch job details' } as ErrorResponse;
    }
  },

  async getSavedJobs(filters: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: string;
    recentOnly?: boolean;
  } = {}): Promise<SavedJobsResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      const params = new URLSearchParams({
        page: filters.page?.toString() ?? '1',
        limit: filters.recentOnly ? '5' : (filters.limit?.toString() ?? '10'),
        sortBy: filters.sortBy ?? 'savedAt',
        sortOrder: filters.sortOrder ?? 'desc',
      });
      if (filters.recentOnly) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        params.append('savedAfter', sevenDaysAgo.toISOString());
      }
      const response: AxiosResponse<{
        data: {
          savedJobs?: ApiSavedJob[];
          pagination?: SavedJobsResponse['pagination'];
        };
      }> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/jobs/saved/my?${params.toString()}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const savedJobs = response.data.data?.savedJobs ?? [];
      return {
        savedJobs: savedJobs.map((saved): SavedJob => ({
          id: saved?.id ?? '',
          job: {
            id: saved?.job?.id ?? '',
            title: saved?.job?.title ?? 'Unknown',
            employmentType: saved?.job?.employmentType ?? 'Unknown',
            location: saved?.job?.isRemote ? 'Remote' : saved?.job?.location ?? 'Unknown',
            isRemote: saved?.job?.isRemote ?? false,
            salaryMin: saved?.job?.salaryMin ? Number(saved.job.salaryMin) : undefined,
            salaryMax: saved?.job?.salaryMax ? Number(saved.job.salaryMax) : undefined,
            requiredSkills: saved?.job?.requiredSkills?.map((skill: any) => skill.skillName) ?? [],
            department: saved?.job?.department ?? undefined,
            description: saved?.job?.description ?? '',
          },
          company: {
            companyName: saved?.company?.companyName ?? 'Unknown',
            logoUrl: saved?.company?.logoUrl ?? undefined,
          },
          savedDate: saved?.savedDate
            ? new Date(saved.savedDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })
            : 'Unknown',
          notes: saved?.notes ?? '',
          matchScore: saved?.matchScore ? Number(saved.matchScore) : undefined,
        })),
        pagination: response.data.data?.pagination ?? {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };
    } catch (error: unknown) {
      console.error('Error fetching saved jobs:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to fetch saved jobs' } as ErrorResponse;
    }
  },

  async acceptOffer(applicationId: string): Promise<{ message: string }> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<{ message: string }> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/jobs/applications/${applicationId}/accept`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error('Error accepting offer:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to accept offer' } as ErrorResponse;
    }
  },

  async updateSavedJobNotes(savedJobId: string, notes: string): Promise<{ message: string }> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<{ message: string }> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/jobs/saved/${savedJobId}`,
        { notes },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error('Error updating saved job notes:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data as ErrorResponse;
      }
      throw { message: 'Failed to update saved job notes' } as ErrorResponse;
    }
  },
};

function mapStatus(status: ApplicationStatus): ApplicationStatus | 'first-round' | 'under-review' | 'offer' {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return ApplicationStatus.APPLIED;
    case ApplicationStatus.IN_PROGRESS:
      return 'under-review';
    case ApplicationStatus.INTERVIEW:
      return ApplicationStatus.INTERVIEW;
    case ApplicationStatus.REJECTED:
      return ApplicationStatus.REJECTED;
    case ApplicationStatus.WITHDRAWN:
      return ApplicationStatus.REJECTED;
    case ApplicationStatus.HIRED:
      return 'offer';
    default:
      return ApplicationStatus.APPLIED;
  }
}

function deriveNextStep(status: ApplicationStatus, interviewScheduledAt?: string): string | undefined {
  switch (status) {
    case ApplicationStatus.APPLIED:
      return 'Application Review';
    case ApplicationStatus.IN_PROGRESS:
      return 'Portfolio Review';
    case ApplicationStatus.INTERVIEW:
      return interviewScheduledAt ? 'Technical Interview' : 'Schedule Interview';
    case ApplicationStatus.HIRED:
      return 'Offer Review';
    default:
      return undefined;
  }
}

export default applicationServices;