'use client';

import React from 'react';
import { User, Mail, Phone, MapPin, Linkedin, Globe } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Input, TextArea, Card, CardContent } from '@/components/ui';
import { WizardNavigation } from './WizardNavigation';

export function PersonalInfoStep() {
  const { resume, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resume;

  const canProceed = personalInfo.fullName && personalInfo.email;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
        <p className="text-gray-500 mt-2">Let&apos;s start with your basic contact details</p>
      </div>

      <Card>
        <CardContent className="space-y-6 py-8">
          <div className="relative">
            <User className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <Input
              label="Full Name *"
              value={personalInfo.fullName}
              onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
              placeholder="John Doe"
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              <Input
                label="Email *"
                type="email"
                value={personalInfo.email}
                onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                placeholder="john@example.com"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              <Input
                label="Phone"
                type="tel"
                value={personalInfo.phone}
                onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="pl-10"
              />
            </div>
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <Input
              label="Location"
              value={personalInfo.location}
              onChange={(e) => updatePersonalInfo({ location: e.target.value })}
              placeholder="San Francisco, CA"
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Linkedin className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              <Input
                label="LinkedIn"
                value={personalInfo.linkedIn || ''}
                onChange={(e) => updatePersonalInfo({ linkedIn: e.target.value })}
                placeholder="linkedin.com/in/johndoe"
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Globe className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
              <Input
                label="Website"
                value={personalInfo.website || ''}
                onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                placeholder="johndoe.com"
                className="pl-10"
              />
            </div>
          </div>

          <TextArea
            label="Professional Summary"
            value={personalInfo.summary || ''}
            onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
            placeholder="A brief summary of your professional background and career objectives..."
            rows={4}
          />
        </CardContent>
      </Card>

      <WizardNavigation canProceed={!!canProceed} />
    </div>
  );
}
