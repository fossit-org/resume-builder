'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { useResumeStore } from '@/store';
import { WIZARD_STEPS, WizardStep } from '@/types';

export function WizardProgress() {
  const { currentStep, setCurrentStep } = useResumeStore();
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
            style={{ width: `${(currentIndex / (WIZARD_STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div
              key={step.id}
              className="relative flex flex-col items-center cursor-pointer group"
              onClick={() => setCurrentStep(step.id as WizardStep)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : isCurrent
                    ? 'bg-white border-2 border-indigo-600 text-indigo-600'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-xs font-medium ${
                    isCurrent ? 'text-indigo-600' : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 hidden md:block">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
