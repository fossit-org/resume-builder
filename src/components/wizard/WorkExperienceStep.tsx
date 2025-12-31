'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Building2, MapPin, Calendar } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Input, TextArea, Button, Card, CardContent } from '@/components/ui';
import { WizardNavigation } from './WizardNavigation';
import type { WorkExperience } from '@/types';

interface ExperienceFormData {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string;
}

const emptyForm: ExperienceFormData = {
  company: '',
  position: '',
  location: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  achievements: '',
};

export function WorkExperienceStep() {
  const { resume, addWorkExperience, removeWorkExperience, updateWorkExperience } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceFormData>(emptyForm);

  const handleSubmit = () => {
    const experienceData = {
      ...formData,
      achievements: formData.achievements.split('\n').filter((a) => a.trim()),
    };

    if (editingId) {
      updateWorkExperience(editingId, experienceData);
    } else {
      addWorkExperience(experienceData);
    }

    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (exp: WorkExperience) => {
    setFormData({
      ...exp,
      achievements: exp.achievements.join('\n'),
    });
    setEditingId(exp.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Work Experience</h2>
        <p className="text-gray-500 mt-2">Add your professional work history</p>
      </div>

      {/* Existing experiences */}
      <div className="space-y-4 mb-6">
        {resume.workExperience.map((exp) => (
          <Card key={exp.id} hover className="group">
            <CardContent className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <Building2 className="w-4 h-4" />
                  <span>{exp.company}</span>
                  {exp.location && (
                    <>
                      <MapPin className="w-4 h-4 ml-2" />
                      <span>{exp.location}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(exp)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeWorkExperience(exp.id)}>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit form */}
      {showForm ? (
        <Card>
          <CardContent className="space-y-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job Title *"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Software Engineer"
              />
              <Input
                label="Company *"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Google"
              />
            </div>

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Mountain View, CA"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date *"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <div>
                <Input
                  label="End Date"
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.current}
                />
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    checked={formData.current}
                    onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">I currently work here</span>
                </label>
              </div>
            </div>

            <TextArea
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your role and responsibilities..."
              rows={3}
            />

            <TextArea
              label="Key Achievements (one per line)"
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              placeholder="Increased sales by 20%&#10;Led a team of 5 developers&#10;Implemented CI/CD pipeline"
              rows={4}
            />

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.company || !formData.position || !formData.startDate}
              >
                {editingId ? 'Update' : 'Add Experience'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button
          variant="outline"
          onClick={() => setShowForm(true)}
          className="w-full py-8 border-dashed"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Work Experience
        </Button>
      )}

      <WizardNavigation />
    </div>
  );
}
