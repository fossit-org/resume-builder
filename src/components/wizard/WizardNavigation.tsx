'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Button } from '@/components/ui';
import { WIZARD_STEPS, WizardStep } from '@/types';

interface WizardNavigationProps {
  onNext?: () => boolean | void;
  onPrevious?: () => void;
  canProceed?: boolean;
}

export function WizardNavigation({
  onNext,
  onPrevious,
  canProceed = true,
}: WizardNavigationProps) {
  const { currentStep, setCurrentStep } = useResumeStore();
  const currentIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === WIZARD_STEPS.length - 1;

  const handleNext = () => {
    if (onNext) {
      const canContinue = onNext();
      if (canContinue === false) return;
    }
    if (!isLast) {
      setCurrentStep(WIZARD_STEPS[currentIndex + 1].id as WizardStep);
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    }
    if (!isFirst) {
      setCurrentStep(WIZARD_STEPS[currentIndex - 1].id as WizardStep);
    }
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
      <Button
        variant="ghost"
        onClick={handlePrevious}
        disabled={isFirst}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="text-sm text-gray-500">
        Step {currentIndex + 1} of {WIZARD_STEPS.length}
      </div>

      <Button
        onClick={handleNext}
        disabled={!canProceed}
        className="flex items-center gap-2"
      >
        {isLast ? 'Finish' : 'Next'}
        {!isLast && <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  );
}
