import axios, { AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';

interface Project {
  id: string;
  jobSeekerId: string;
  projectName: string;
  role?: string;
  completionYear?: number;
  description?: string;
  impactDescription?: string;
  projectUrl?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateProjectData {
  projectName: string;
  role?: string;
  completionYear?: number;
  description?: string;
  impactDescription?: string;
  projectUrl?: string;
  displayOrder?: number;
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

interface ProjectResponse {
  message?: string;
  data: Project;
}

interface ProjectsResponse {
  message?: string;
  data: Project[];
}

const projectServices = {
  async createProject(data: CreateProjectData): Promise<Project> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<ProjectResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/projects`,
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
        console.error('Project creation error:', {
          status: error.response.status,
          data: error.response.data,
          requestData: data,
        });
        throw error.response.data;
      }
      throw { message: 'Failed to create project' };
    }
  },

  async getAllProjects(): Promise<Project[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<ProjectsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/projects`,
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
      throw { message: 'Failed to fetch projects' };
    }
  },

  async getProjectById(id: string): Promise<Project> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<ProjectResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/projects/${id}`,
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
      throw { message: 'Failed to fetch project' };
    }
  },

  async updateProject(id: string, data: UpdateProjectData): Promise<Project> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<ProjectResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/job-seeker/projects/${id}`,
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
      throw { message: 'Failed to update project' };
    }
  },

  async deleteProject(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`${SERVER_BASE_URL}/api/v1/job-seeker/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw error.response.data;
      }
      throw { message: 'Failed to delete project' };
    }
  },
};

export default projectServices;