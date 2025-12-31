'use client';

import React, { useState } from 'react';
import { Plus, Trash2, GraduationCap, MapPin, Calendar } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Input, TextArea, Button, Card, CardContent } from '@/components/ui';
import { WizardNavigation } from './WizardNavigation';
import type { Education } from '@/types';

interface EducationFormData {
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  achievements: string;
}

const emptyForm: EducationFormData = {
  institution: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
  gpa: '',
  achievements: '',
};

export function EducationStep() {
  const { resume, addEducation, removeEducation, updateEducation } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EducationFormData>(emptyForm);

  const handleSubmit = () => {
    const educationData = {
      ...formData,
      achievements: formData.achievements.split('\n').filter((a) => a.trim()),
    };

    if (editingId) {
      updateEducation(editingId, educationData);
    } else {
      addEducation(educationData);
    }

    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (edu: Education) => {
    setFormData({
      ...edu,
      gpa: edu.gpa || '',
      achievements: edu.achievements.join('\n'),
    });
    setEditingId(edu.id);
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
        <h2 className="text-2xl font-bold text-gray-900">Education</h2>
        <p className="text-gray-500 mt-2">Add your academic background</p>
      </div>

      {/* Existing education entries */}
      <div className="space-y-4 mb-6">
        {resume.education.map((edu) => (
          <Card key={edu.id} hover className="group">
            <CardContent className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <div className="flex items-center gap-2 text-gray-600 mt-1">
                  <GraduationCap className="w-4 h-4" />
                  <span>{edu.institution}</span>
                  {edu.location && (
                    <>
                      <MapPin className="w-4 h-4 ml-2" />
                      <span>{edu.location}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {edu.startDate} - {edu.endDate}
                  </span>
                  {edu.gpa && <span className="ml-2">GPA: {edu.gpa}</span>}
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(edu)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)}>
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
            <Input
              label="Institution *"
              value={formData.institution}
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              placeholder="Stanford University"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Degree *"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Bachelor of Science"
              />
              <Input
                label="Field of Study *"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                placeholder="Computer Science"
              />
            </div>

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Stanford, CA"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Start Date *"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <Input
                label="End Date *"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              <Input
                label="GPA"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                placeholder="3.8"
              />
            </div>

            <TextArea
              label="Achievements & Activities (one per line)"
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
              placeholder="Dean's List 2020-2022&#10;President of CS Club&#10;Published research paper"
              rows={3}
            />

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  !formData.institution ||
                  !formData.degree ||
                  !formData.field ||
                  !formData.startDate ||
                  !formData.endDate
                }
              >
                {editingId ? 'Update' : 'Add Education'}
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
          Add Education
        </Button>
      )}

      <WizardNavigation />
    </div>
  );
}
