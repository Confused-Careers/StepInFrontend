  export interface Social {
    platform: string;
    url: string;
  }
  
  export interface Language {
    name: string;
    level: string;
    progress: number;
  }
  
  export interface Experience {
    title: string;
    company: string;
    location: string;
    period: string;
    description: string;
    achievements: string[];
    workCulture: string[];
  }
  
  export interface Education {
    degree: string;
    school: string;
    location: string;
    period: string;
    description: string;
    courses: string[];
    gpa: string;
  }
  
  export interface Project {
    title: string;
    role: string;
    period: string;
    description: string;
    link: string;
    skills: string[];
    impact: string;
  }
  
  export interface Certification {
    title: string;
    issuer: string;
    date: string;
    description: string;
    skills: string[];
    credentialId: string;
  }
  
  export interface JobPreferences {
    roles: string[];
    locations: string[];
    salary: { min: number; max: number; negotiable: boolean };
    types: string[];
    workCulture: {
      environment: string[];
      team: string[];
      style: string[];
      companySize: string[];
      values: string[];
      industries: string[];
    };
    additional: string[];
  }
  
  export interface Availability {
    start: string;
    notice: string;
    interview: string;
  }
  
  export interface Relocation {
    willing: string;
    locations: string;
    assistance: string;
  }
  
  export interface Travel {
    willing: string;
    international: string;
    status: string;
  }
  
  export interface ProfileData {
    name: string;
    title: string;
    location: string;
    views: number;
    profilePicture: string;
    resume: string;
    portfolio: string;
    socials: Social[];
    completion: { percent: number; sections: number; total: number };
    skills: string[];
    languages: Language[];
    about: string;
    experiences: Experience[];
    education: Education[];
    projects: Project[];
    certifications: Certification[];
    jobPreferences: JobPreferences;
    availability: Availability;
    relocation: Relocation;
    travel: Travel;
  }