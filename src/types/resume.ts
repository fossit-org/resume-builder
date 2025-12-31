export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn?: string;
  website?: string;
  summary?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate?: string;
  credentialId?: string;
  link?: string;
}

export interface Resume {
  id: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certifications: Certification[];
  createdAt: string;
  updatedAt: string;
}

export type AIProvider = 'chatgpt' | 'gemini' | 'claude' | 'perplexity';

export interface AISettings {
  provider: AIProvider | null;
  apiKey: string;
  isEnabled: boolean;
}

export interface AIRecommendation {
  section: string;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PortfolioAssessment {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  careerGoalAlignment: string;
}

export type WizardStep = 
  | 'personal-info'
  | 'work-experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'preview';

export const WIZARD_STEPS: { id: WizardStep; title: string; description: string }[] = [
  { id: 'personal-info', title: 'Personal Info', description: 'Your contact details' },
  { id: 'work-experience', title: 'Experience', description: 'Work history' },
  { id: 'education', title: 'Education', description: 'Academic background' },
  { id: 'skills', title: 'Skills', description: 'Your expertise' },
  { id: 'projects', title: 'Projects', description: 'Personal projects' },
  { id: 'certifications', title: 'Certifications', description: 'Credentials' },
  { id: 'preview', title: 'Preview', description: 'Review & export' },
];
