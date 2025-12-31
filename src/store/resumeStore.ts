import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type {
  Resume,
  PersonalInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  AISettings,
  AIProvider,
  WizardStep,
} from '@/types';

interface ResumeStore {
  // Resume data
  resume: Resume;
  
  // Wizard state
  currentStep: WizardStep;
  setCurrentStep: (step: WizardStep) => void;
  
  // AI Settings
  aiSettings: AISettings;
  setAIProvider: (provider: AIProvider | null) => void;
  setAPIKey: (key: string) => void;
  enableAI: () => void;
  disableAI: () => void;
  
  // Personal Info
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  
  // Work Experience
  addWorkExperience: (exp: Omit<WorkExperience, 'id'>) => void;
  updateWorkExperience: (id: string, exp: Partial<WorkExperience>) => void;
  removeWorkExperience: (id: string) => void;
  
  // Education
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  
  // Skills
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  
  // Projects
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  
  // Certifications
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  removeCertification: (id: string) => void;
  
  // Bulk updates
  setResume: (resume: Resume) => void;
  resetResume: () => void;
}

const createEmptyResume = (): Resume => ({
  id: uuidv4(),
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedIn: '',
    website: '',
    summary: '',
  },
  workExperience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: createEmptyResume(),
      currentStep: 'personal-info',
      aiSettings: {
        provider: null,
        apiKey: '',
        isEnabled: false,
      },
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setAIProvider: (provider) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, provider, isEnabled: false, apiKey: '' },
        })),
      
      setAPIKey: (apiKey) =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, apiKey },
        })),
      
      enableAI: () =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, isEnabled: state.aiSettings.apiKey.length > 0 },
        })),
      
      disableAI: () =>
        set((state) => ({
          aiSettings: { ...state.aiSettings, isEnabled: false },
        })),
      
      updatePersonalInfo: (info) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personalInfo: { ...state.resume.personalInfo, ...info },
            updatedAt: new Date().toISOString(),
          },
        })),
      
      addWorkExperience: (exp) =>
        set((state) => ({
          resume: {
            ...state.resume,
            workExperience: [...state.resume.workExperience, { ...exp, id: uuidv4() }],
            updatedAt: new Date().toISOString(),
          },
        })),
      
      updateWorkExperience: (id, exp) =>
        set((state) => ({
          resume: {
            ...state.resume,
            workExperience: state.resume.workExperience.map((e) =>
              e.id === id ? { ...e, ...exp } : e
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      removeWorkExperience: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            workExperience: state.resume.workExperience.filter((e) => e.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      addEducation: (edu) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: [...state.resume.education, { ...edu, id: uuidv4() }],
            updatedAt: new Date().toISOString(),
          },
        })),
      
      updateEducation: (id, edu) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      removeEducation: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((e) => e.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      addSkill: (skill) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [...state.resume.skills, { ...skill, id: uuidv4() }],
            updatedAt: new Date().toISOString(),
          },
        })),
      
      updateSkill: (id, skill) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.map((s) =>
              s.id === id ? { ...s, ...skill } : s
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      removeSkill: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.filter((s) => s.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      addProject: (project) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: [...state.resume.projects, { ...project, id: uuidv4() }],
            updatedAt: new Date().toISOString(),
          },
        })),
      
      updateProject: (id, project) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.map((p) =>
              p.id === id ? { ...p, ...project } : p
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      removeProject: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            projects: state.resume.projects.filter((p) => p.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      addCertification: (cert) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: [...state.resume.certifications, { ...cert, id: uuidv4() }],
            updatedAt: new Date().toISOString(),
          },
        })),
      
      updateCertification: (id, cert) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.map((c) =>
              c.id === id ? { ...c, ...cert } : c
            ),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      removeCertification: (id) =>
        set((state) => ({
          resume: {
            ...state.resume,
            certifications: state.resume.certifications.filter((c) => c.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),
      
      setResume: (resume) =>
        set({
          resume: { ...resume, updatedAt: new Date().toISOString() },
        }),
      
      resetResume: () =>
        set({
          resume: createEmptyResume(),
          currentStep: 'personal-info',
        }),
    }),
    {
      name: 'resume-storage',
    }
  )
);
