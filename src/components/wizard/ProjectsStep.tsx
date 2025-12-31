'use client';

import React, { useState } from 'react';
import { Plus, Trash2, FolderKanban, ExternalLink, Calendar } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Input, TextArea, Button, Card, CardContent } from '@/components/ui';
import { WizardNavigation } from './WizardNavigation';
import type { Project } from '@/types';

interface ProjectFormData {
  name: string;
  description: string;
  technologies: string;
  link: string;
  startDate: string;
  endDate: string;
}

const emptyForm: ProjectFormData = {
  name: '',
  description: '',
  technologies: '',
  link: '',
  startDate: '',
  endDate: '',
};

export function ProjectsStep() {
  const { resume, addProject, removeProject, updateProject } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(emptyForm);

  const handleSubmit = () => {
    const projectData = {
      ...formData,
      technologies: formData.technologies.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (editingId) {
      updateProject(editingId, projectData);
    } else {
      addProject(projectData);
    }

    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (project: Project) => {
    setFormData({
      ...project,
      technologies: project.technologies.join(', '),
      link: project.link || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
    });
    setEditingId(project.id);
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
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <p className="text-gray-500 mt-2">Showcase your personal and professional projects</p>
      </div>

      {/* Existing projects */}
      <div className="space-y-4 mb-6">
        {resume.projects.map((project) => (
          <Card key={project.id} hover className="group">
            <CardContent className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {(project.startDate || project.endDate) && (
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {project.startDate && project.startDate}
                      {project.startDate && project.endDate && ' - '}
                      {project.endDate && project.endDate}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeProject(project.id)}>
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
              label="Project Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="E-commerce Platform"
            />

            <TextArea
              label="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your project, its purpose, and your role..."
              rows={3}
            />

            <Input
              label="Technologies (comma-separated)"
              value={formData.technologies}
              onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
              placeholder="React, Node.js, PostgreSQL"
            />

            <Input
              label="Project Link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://github.com/username/project"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="month"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
              <Input
                label="End Date"
                type="month"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.description}
              >
                {editingId ? 'Update' : 'Add Project'}
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
          Add Project
        </Button>
      )}

      <WizardNavigation />
    </div>
  );
}
