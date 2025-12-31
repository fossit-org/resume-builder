'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Award, Calendar, ExternalLink } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Input, Button, Card, CardContent } from '@/components/ui';
import { WizardNavigation } from './WizardNavigation';
import type { Certification } from '@/types';

interface CertificationFormData {
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  credentialId: string;
  link: string;
}

const emptyForm: CertificationFormData = {
  name: '',
  issuer: '',
  date: '',
  expiryDate: '',
  credentialId: '',
  link: '',
};

export function CertificationsStep() {
  const { resume, addCertification, removeCertification, updateCertification } = useResumeStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CertificationFormData>(emptyForm);

  const handleSubmit = () => {
    if (editingId) {
      updateCertification(editingId, formData);
    } else {
      addCertification(formData);
    }

    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (cert: Certification) => {
    setFormData({
      ...cert,
      expiryDate: cert.expiryDate || '',
      credentialId: cert.credentialId || '',
      link: cert.link || '',
    });
    setEditingId(cert.id);
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
        <h2 className="text-2xl font-bold text-gray-900">Certifications</h2>
        <p className="text-gray-500 mt-2">Add your professional certifications and credentials</p>
      </div>

      {/* Existing certifications */}
      <div className="space-y-4 mb-6">
        {resume.certifications.map((cert) => (
          <Card key={cert.id} hover className="group">
            <CardContent className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-500" />
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
                <p className="text-gray-600 text-sm mt-1">{cert.issuer}</p>
                <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Issued: {cert.date}</span>
                  </div>
                  {cert.expiryDate && <span>Expires: {cert.expiryDate}</span>}
                </div>
                {cert.credentialId && (
                  <p className="text-gray-400 text-xs mt-1">
                    Credential ID: {cert.credentialId}
                  </p>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(cert)}>
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => removeCertification(cert.id)}>
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
              label="Certification Name *"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="AWS Solutions Architect"
            />

            <Input
              label="Issuing Organization *"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="Amazon Web Services"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Issue Date *"
                type="month"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <Input
                label="Expiry Date"
                type="month"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              />
            </div>

            <Input
              label="Credential ID"
              value={formData.credentialId}
              onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
              placeholder="ABC123XYZ"
            />

            <Input
              label="Credential URL"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://verify.example.com/credential/..."
            />

            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!formData.name || !formData.issuer || !formData.date}
              >
                {editingId ? 'Update' : 'Add Certification'}
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
          Add Certification
        </Button>
      )}

      <WizardNavigation />
    </div>
  );
}
