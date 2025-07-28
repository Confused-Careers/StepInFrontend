import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import jobSeekerServices from '@/services/jobSeekerServices';
import { toast } from 'sonner';

export interface JobSeekerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  phone?: string | null;
  aboutMe?: string | null;
  currentPosition?: string | null;
  currentCompany?: string | null;
  location?: string | null;
  preferredLocation?: string | null;
  expectedSalaryMin?: number | null;
  expectedSalaryMax?: number | null;
  availability?: string | null;
  portfolioUrl?: string | null;
  profilePictureUrl?: string | null;
  resumeUrl?: string | null;
  resumeMetadata?: any;
  createdAt: string;
  updatedAt: string;
  profileViewsCount: number;
  onboardingCompleted: boolean;
  currentTier: number;
  questionsAnsweredInCurrentTier: number;
  totalQuestionsAnswered: number;
  personalityTraits?: string[];
  workPreferences?: string[];
  idealEnvironment?: string;
}

interface ProfileContextType {
  profile: JobSeekerProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<JobSeekerProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await jobSeekerServices.getProfile();
      setProfile(data as JobSeekerProfile);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (data: Partial<JobSeekerProfile>) => {
    try {
      setLoading(true);
      const updatedProfile = await jobSeekerServices.updateProfile(data as any);
      setProfile(updatedProfile as JobSeekerProfile);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      toast.error(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        updateProfile,
        refreshProfile: fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
} 