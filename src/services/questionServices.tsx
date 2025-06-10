import axios from 'axios';
import { SERVER_BASE_URL } from '@/utils/config';
import { Briefcase, Star, Zap } from 'lucide-react';
import { JSX } from 'react';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

interface QuestionOptionResponseDto {
  id: string;
  optionText: string;
  optionOrder: number;
}

interface QuestionResponseDto {
  id: string;
  questionText: string;
  questionType: string;
  insightCategory?: string;
  options: QuestionOptionResponseDto[];
}

interface QuestionTierResponseDto {
  tierNumber: number;
  questionsRequiredToComplete: number;
  questionsAnsweredInTier: number;
  totalQuestionsInTier: number;
  isCompleted: boolean;
}

interface GetQuestionsResponseDto {
  tier: QuestionTierResponseDto;
  questions: QuestionResponseDto[];
  userProgress: {
    currentTier: number;
    questionsAnsweredInCurrentTier: number;
    totalQuestionsAnswered: number;
    canProgressToNextTier: boolean;
    nextTierNumber?: number;
  };
}

interface UserProgressResponseDto {
  currentTier: number;
  questionsAnsweredInCurrentTier: number;
  totalQuestionsAnswered: number;
  tiers: QuestionTierResponseDto[];
}

interface AnswerResponseDto {
  id: string;
  questionId: string;
  selectedOptionId: string;
  tierWhenAnswered: number;
  selectedOption: QuestionOptionResponseDto;
}

interface OnboardingQuestionsResponseDto {
  questions: QuestionResponseDto[];
  totalQuestions: number;
}

const getUserProgress = async (): Promise<UserProgressResponseDto> => {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/api/v1/questions/progress`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      console.error('Failed to fetch user progress:', (error as { response: { data: unknown } }).response.data);
    } else if (error instanceof Error) {
      console.error('Failed to fetch user progress:', error.message);
    } else {
      console.error('Failed to fetch user progress:', error);
    }
    throw new Error('Failed to fetch user progress');
  }
};

const getQuestionsForTier = async (tierNumber: number): Promise<GetQuestionsResponseDto> => {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/api/v1/questions/tier/${tierNumber}`, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      console.error('Failed to fetch questions for tier:', (error as { response: { data: unknown } }).response.data);
    } else if (error instanceof Error) {
      console.error('Failed to fetch questions for tier:', error.message);
    } else {
      console.error('Failed to fetch questions for tier:', error);
    }
    throw new Error('Failed to fetch questions for tier');
  }
};

const submitAnswer = async (answer: { questionId: string; selectedOptionId: string }): Promise<AnswerResponseDto> => {
  try {
    const response = await axios.post(`${SERVER_BASE_URL}/api/v1/questions/answer`, answer, {
      headers: getAuthHeaders(),
    });
    return response.data.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      console.error('Failed to submit answer:', error.response.data);
    } else if (error instanceof Error) {
      console.error('Failed to submit answer:', error.message);
    } else {
      console.error('Failed to submit answer:', error);
    }
    throw new Error('Failed to submit answer');
  }
};

const getAnswerHistory = async (tierNumber?: number): Promise<AnswerResponseDto[]> => {
  try {
    const params: Record<string, unknown> = {};
    if (tierNumber !== undefined) params.tier = tierNumber;
    const response = await axios.get(`${SERVER_BASE_URL}/api/v1/questions/answers`, {
      headers: getAuthHeaders(),
      params,
    });
    return response.data.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      console.error('Failed to fetch answer history:', (error as { response: { data: unknown } }).response.data);
    } else if (error instanceof Error) {
      console.error('Failed to fetch answer history:', error.message);
    } else {
      console.error('Failed to fetch answer history:', error);
    }
    throw new Error('Failed to fetch answer history');
  }
};

const getOnboardingQuestions = async (): Promise<OnboardingQuestionsResponseDto> => {
  try {
    const response = await axios.get(`${SERVER_BASE_URL}/api/v1/questions/onboarding`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
      console.error('Failed to fetch onboarding questions:', error.response.data);
    } else if (error instanceof Error) {
      console.error('Failed to fetch onboarding questions:', error.message);
    } else {
      console.error('Failed to fetch onboarding questions:', error);
    }
    throw new Error('Failed to fetch onboarding questions');
  }
};

export {
  getUserProgress,
  getQuestionsForTier,
  submitAnswer,
  getAnswerHistory,
  getOnboardingQuestions,
  categoryIcons,
};

export type {
  QuestionResponseDto,
  UserProgressResponseDto,
  GetQuestionsResponseDto,
  AnswerResponseDto,
  OnboardingQuestionsResponseDto,
};

const categoryIcons: Record<"preferences" | "personality" | "goals", JSX.Element> = {
  preferences: <Star className="h-4 w-4 text-primary" />,
  personality: <Zap className="h-4 w-4 text-primary" />,
  goals: <Briefcase className="h-4 w-4 text-primary" />,
};