'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Star } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Input, Select, Button, Card, CardContent } from '@/components/ui';
import { WizardNavigation } from './WizardNavigation';
import type { Skill } from '@/types';

interface SkillFormData {
  name: string;
  level: Skill['level'];
  category: string;
}

const emptyForm: SkillFormData = {
  name: '',
  level: 'Intermediate',
  category: '',
};

const skillLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' },
];

const skillCategories = [
  { value: 'Technical', label: 'Technical' },
  { value: 'Programming', label: 'Programming Languages' },
  { value: 'Frameworks', label: 'Frameworks & Libraries' },
  { value: 'Tools', label: 'Tools & Technologies' },
  { value: 'Soft Skills', label: 'Soft Skills' },
  { value: 'Languages', label: 'Languages' },
  { value: 'Other', label: 'Other' },
];

const levelColors = {
  Beginner: 'bg-gray-200',
  Intermediate: 'bg-blue-400',
  Advanced: 'bg-indigo-500',
  Expert: 'bg-purple-600',
};

export function SkillsStep() {
  const { resume, addSkill, removeSkill } = useResumeStore();
  const [formData, setFormData] = useState<SkillFormData>(emptyForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.category) {
      addSkill(formData);
      setFormData(emptyForm);
    }
  };

  // Group skills by category
  const groupedSkills = resume.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
        <p className="text-gray-500 mt-2">Showcase your expertise and abilities</p>
      </div>

      {/* Add skill form */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <Input
                label="Skill Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="JavaScript"
              />
            </div>
            <div className="w-40">
              <Select
                label="Level"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value as Skill['level'] })
                }
                options={skillLevels}
              />
            </div>
            <div className="w-48">
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={skillCategories}
                placeholder="Select category"
              />
            </div>
            <Button type="submit" disabled={!formData.name || !formData.category}>
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Skills display */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, skills]) => (
          <Card key={category}>
            <CardContent className="py-4">
              <h3 className="font-semibold text-gray-700 mb-3">{category}</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="group flex items-center gap-2 bg-gray-50 rounded-full px-3 py-1.5 border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < skillLevels.findIndex((l) => l.value === skill.level) + 1
                              ? levelColors[skill.level]
                              : 'text-gray-200'
                          }`}
                          fill={
                            i < skillLevels.findIndex((l) => l.value === skill.level) + 1
                              ? 'currentColor'
                              : 'none'
                          }
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-700">{skill.name}</span>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {resume.skills.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>No skills added yet. Start adding your skills above!</p>
        </div>
      )}

      <WizardNavigation />
    </div>
  );
}
