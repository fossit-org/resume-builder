'use client';

import React, { useRef } from 'react';
import { Download, Mail, Phone, MapPin, Linkedin, Globe, Building2, GraduationCap, Award, FolderKanban, ExternalLink } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Button, Card } from '@/components/ui';
import { WizardNavigation } from './WizardNavigation';

export function PreviewStep() {
  const { resume } = useResumeStore();
  const resumeRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (resumeRef.current) {
      const printContent = resumeRef.current.innerHTML;
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${resume.personalInfo.fullName} - Resume</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; line-height: 1.5; padding: 40px; max-width: 800px; margin: 0 auto; }
                h1 { font-size: 28px; color: #111827; margin-bottom: 8px; }
                h2 { font-size: 18px; color: #4f46e5; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; margin: 24px 0 12px; }
                h3 { font-size: 16px; color: #111827; }
                .contact { display: flex; flex-wrap: wrap; gap: 16px; color: #6b7280; font-size: 14px; margin-bottom: 16px; }
                .contact span { display: flex; align-items: center; gap: 4px; }
                .summary { color: #4b5563; margin-bottom: 24px; }
                .entry { margin-bottom: 16px; }
                .entry-header { display: flex; justify-content: space-between; align-items: flex-start; }
                .entry-title { font-weight: 600; }
                .entry-subtitle { color: #6b7280; font-size: 14px; }
                .entry-date { color: #9ca3af; font-size: 14px; }
                .entry-description { color: #4b5563; font-size: 14px; margin-top: 4px; }
                .achievements { margin-top: 8px; padding-left: 20px; }
                .achievements li { color: #4b5563; font-size: 14px; margin-bottom: 4px; }
                .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
                .skill-tag { background: #f3f4f6; padding: 4px 12px; border-radius: 16px; font-size: 13px; color: #374151; }
                .projects-grid { display: grid; gap: 12px; }
                .tech-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; }
                .tech-tag { background: #eef2ff; padding: 2px 8px; border-radius: 8px; font-size: 12px; color: #4f46e5; }
                @media print { body { padding: 20px; } }
              </style>
            </head>
            <body>${printContent}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Preview Your Resume</h2>
        <p className="text-gray-500 mt-2">Review your resume and download when ready</p>
      </div>

      <div className="flex justify-end mb-4">
        <Button onClick={handleDownload} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>

      <Card className="shadow-lg">
        <div ref={resumeRef} className="p-8 bg-white">
          {/* Header */}
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{resume.personalInfo.fullName || 'Your Name'}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-gray-600 text-sm">
              {resume.personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  {resume.personalInfo.email}
                </span>
              )}
              {resume.personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {resume.personalInfo.phone}
                </span>
              )}
              {resume.personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {resume.personalInfo.location}
                </span>
              )}
              {resume.personalInfo.linkedIn && (
                <span className="flex items-center gap-1">
                  <Linkedin className="w-4 h-4" />
                  {resume.personalInfo.linkedIn}
                </span>
              )}
              {resume.personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {resume.personalInfo.website}
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {resume.personalInfo.summary && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-indigo-600 border-b-2 border-gray-200 pb-1 mb-3">
                Professional Summary
              </h2>
              <p className="text-gray-600">{resume.personalInfo.summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {resume.workExperience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-indigo-600 border-b-2 border-gray-200 pb-1 mb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Work Experience
              </h2>
              <div className="space-y-4">
                {resume.workExperience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                        <p className="text-gray-600 text-sm">{exp.company}{exp.location && ` · ${exp.location}`}</p>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-600 text-sm mt-2">{exp.description}</p>
                    )}
                    {exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="text-gray-600 text-sm">{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {resume.education.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-indigo-600 border-b-2 border-gray-200 pb-1 mb-3 flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                Education
              </h2>
              <div className="space-y-4">
                {resume.education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h3>
                        <p className="text-gray-600 text-sm">{edu.institution}{edu.location && ` · ${edu.location}`}</p>
                      </div>
                      <span className="text-gray-500 text-sm">
                        {edu.startDate} - {edu.endDate}
                        {edu.gpa && ` · GPA: ${edu.gpa}`}
                      </span>
                    </div>
                    {edu.achievements.length > 0 && (
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {edu.achievements.map((achievement, i) => (
                          <li key={i} className="text-gray-600 text-sm">{achievement}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resume.skills.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-indigo-600 border-b-2 border-gray-200 pb-1 mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {resume.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-indigo-600 border-b-2 border-gray-200 pb-1 mb-3 flex items-center gap-2">
                <FolderKanban className="w-5 h-5" />
                Projects
              </h2>
              <div className="space-y-4">
                {resume.projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex items-center gap-2">
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
                            className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-indigo-600 border-b-2 border-gray-200 pb-1 mb-3 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Certifications
              </h2>
              <div className="space-y-3">
                {resume.certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                        {cert.link && (
                          <a
                            href={cert.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    </div>
                    <span className="text-gray-500 text-sm">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      <WizardNavigation />
    </div>
  );
}
