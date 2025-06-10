import axios, { AxiosError, AxiosResponse } from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';
import { AddedLanguagesResponse, AddedSkillsResponse, AddedSocialsResponse, AddedUsersCertificatesResponse, AddedUsersProjectsResponse, Certificates, Languages, LanguagesResponse, Projects, Skills, SkillsResponse, Socials, UsersCertificatesResponse, UsersLanguagesResponse, UsersProjectsResponse, UsersSkillsResponse, UsersSocialsResponse } from '@/utils/interfaces';

interface UploadResponse {
  message: string;
  fileUrl?: string;
  fileId?: string;
}

interface FilePayload {
  file: string;
}

export function handleAuthError(error: unknown): boolean {
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

const userServices = {
  async getAllSkills(data: string): Promise<Skills[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<SkillsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/skills/list/all?search=${data}`,
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
      throw { message: 'Failed to get all skills' };
    }
  },
  async getUserSkills(): Promise< { id: string, skill: Skills }[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<UsersSkillsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/skills`,
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
      throw { message: 'Failed to get user skills' };
    }
  },

  async addUserSkills(skillId:string): Promise<{ id: string, skill: Skills }> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedSkillsResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/skills`,
        {
            skillId,
        },
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
      throw { message: 'Failed to add user skill' };
    }
  },
  async deleteUserSkills(skillId:string): Promise<Skills[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<SkillsResponse> = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/job-seeker/skills/${skillId}`,
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
      throw { message: 'Failed to remove user skill' };
    }
  },





  async getAllLanguages(data: string): Promise<Languages[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<LanguagesResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/languages/list/all?search=${data}`,
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
      throw { message: 'Failed to get all languages' };
    }
  },
  async getUserLanguages(): Promise< { id: string, language: Languages }[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<UsersLanguagesResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/languages`,
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
      throw { message: 'Failed to get user languages' };
    }
  },

  async addUserLanguage(languageId:string,proficiency:string): Promise<{ id: string, language: Languages }> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedLanguagesResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/languages`,
        {
            languageId,
            proficiency
        },
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
      throw { message: 'Failed to add user language' };
    }
  },
  async deleteUserLanguage(languageId:string): Promise<Languages[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<LanguagesResponse> = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/job-seeker/languages/${languageId}`,
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
      throw { message: 'Failed to remove user language' };
    }
  },

  async getUserSocials(): Promise<Socials[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<UsersSocialsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/social-profiles`,
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
      throw { message: 'Failed to get user socials' };
    }
  },

  async addUserSocial(platform:string,profileUrl:string): Promise<Socials> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedSocialsResponse> = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/social-profiles`,
        {
            platform,
            profileUrl
        },
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
      throw { message: 'Failed to add user language' };
    }
  },

  async updateUserSocial(id:string,platform:string,profileUrl:string): Promise<Socials> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedSocialsResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/job-seeker/social-profiles/${id}`,
        {
            platform,
            profileUrl
        },
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
      throw { message: 'Failed to add user language' };
    }
  },
  async deleteUserSocial(socialId:string): Promise<Socials> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedSocialsResponse> = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/job-seeker/social-profiles/${socialId}`,
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
      throw { message: 'Failed to remove user language' };
    }
  },



  async getUserCertificates(): Promise<Certificates[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<UsersCertificatesResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/certifications`,
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
      throw { message: 'Failed to get user certifications' };
    }
  },

  async addUserCertifications(data:Certificates | null): Promise<Certificates> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedUsersCertificatesResponse> = await axios.post(
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
        throw error.response.data;
      }
      throw { message: 'Failed to add user certification' };
    }
  },

  async getAllCertificationSkills(id:string,data: string): Promise<Skills[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<SkillsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/certifications/list/all?certificateId=${id}&search=${data}`,
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
      throw { message: 'Failed to get all skills' };
    }
  },

  async updateUserCertifications(data:Certificates): Promise<Certificates> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedUsersCertificatesResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/job-seeker/certifications/${data.id}`,
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
      throw { message: 'Failed to add user certifications' };
    }
  },
  async deleteUserCertifications(id:string): Promise<Certificates> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedUsersCertificatesResponse> = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/job-seeker/certifications/${id}`,
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
      throw { message: 'Failed to remove user certifications' };
    }
  },


  

  async getUserProjects(): Promise<Projects[]> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<UsersProjectsResponse> = await axios.get(
        `${SERVER_BASE_URL}/api/v1/job-seeker/projects`,
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
      throw { message: 'Failed to get user projects' };
    }
  },

  async addUserProject(data:Projects | null): Promise<Projects> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedUsersProjectsResponse> = await axios.post(
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
        throw error.response.data;
      }
      throw { message: 'Failed to add user certification' };
    }
  },

  async updateUserProject(data:Projects): Promise<Projects> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedUsersProjectsResponse> = await axios.put(
        `${SERVER_BASE_URL}/api/v1/job-seeker/projects/${data.id}`,
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
      throw { message: 'Failed to add user projects' };
    }
  },
  async deleteUserProject(id:string): Promise<Projects> {
    try {
      const token = localStorage.getItem('accessToken');
      const response: AxiosResponse<AddedUsersProjectsResponse> = await axios.delete(
        `${SERVER_BASE_URL}/api/v1/job-seeker/projects/${id}`,
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
      throw { message: 'Failed to remove user projects' };
    }
  },

  async uploadResume(payload: FilePayload): Promise<UploadResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/resume/upload`,
        payload,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error('Unauthorized');
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === 'object' &&
        'message' in axiosError.response.data
          ? (axiosError.response.data as { message?: string }).message
          : undefined;
      throw new Error(errorMessage || 'Failed to upload resume');
    }
  },

  async uploadProfilePicture(payload: FilePayload): Promise<UploadResponse> {
    try {
      const response = await axios.post(
        `${SERVER_BASE_URL}/api/v1/job-seeker/profile-picture/upload`,
        payload,
        { headers: getAuthHeaders() }
      );
      return response.data.data;
    } catch (error) {
      if (handleAuthError(error)) throw new Error('Unauthorized');
      const axiosError = error as AxiosError;
      const errorMessage =
        axiosError.response &&
        axiosError.response.data &&
        typeof axiosError.response.data === 'object' &&
        'message' in axiosError.response.data
          ? (axiosError.response.data as { message?: string }).message
          : undefined;
      throw new Error(errorMessage || 'Failed to upload profile picture');
    }
  },
};

export default userServices;