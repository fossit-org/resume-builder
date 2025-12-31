'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Settings, Sparkles } from 'lucide-react';
import { useResumeStore } from '@/store';
import { WizardProgress } from '@/components/wizard/WizardProgress';
import { PersonalInfoStep } from '@/components/wizard/PersonalInfoStep';
import { WorkExperienceStep } from '@/components/wizard/WorkExperienceStep';
import { EducationStep } from '@/components/wizard/EducationStep';
import { SkillsStep } from '@/components/wizard/SkillsStep';
import { ProjectsStep } from '@/components/wizard/ProjectsStep';
import { CertificationsStep } from '@/components/wizard/CertificationsStep';
import { PreviewStep } from '@/components/wizard/PreviewStep';
import { AISettings } from '@/components/ai/AISettings';
import { AIRecommendations } from '@/components/ai/AIRecommendations';
import { ResumeUpload } from '@/components/ai/ResumeUpload';
import { Button } from '@/components/ui';

export default function BuilderPage() {
  const { currentStep, resetResume } = useResumeStore();
  const [showSettings, setShowSettings] = useState(false);

  const renderStep = () => {
    switch (currentStep) {
      case 'personal-info':
        return <PersonalInfoStep />;
      case 'work-experience':
        return <WorkExperienceStep />;
      case 'education':
        return <EducationStep />;
      case 'skills':
        return <SkillsStep />;
      case 'projects':
        return <ProjectsStep />;
      case 'certifications':
        return <CertificationsStep />;
      case 'preview':
        return <PreviewStep />;
      default:
        return <PersonalInfoStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Resume Builder
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2"
              >
                {showSettings ? <Sparkles className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                {showSettings ? 'Back to Builder' : 'AI Settings'}
              </Button>
              <Button variant="outline" size="sm" onClick={resetResume}>
                Start Over
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSettings ? (
          <div className="max-w-3xl mx-auto space-y-8">
            <AISettings />
            <ResumeUpload />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <WizardProgress />
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                {renderStep()}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <ResumeUpload />
              <AIRecommendations />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
