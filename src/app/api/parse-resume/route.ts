import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { Resume, WorkExperience, Education, Skill, Project, Certification } from '@/types';

// Simple text extraction patterns for resume parsing
const patterns = {
  email: /[\w.-]+@[\w.-]+\.\w+/gi,
  phone: /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
  linkedin: /linkedin\.com\/in\/[\w-]+/gi,
  website: /(?:https?:\/\/)?(?:www\.)?[\w-]+\.[\w.-]+(?:\/[\w.-]*)?/gi,
  date: /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s,]*\d{4}|\d{1,2}\/\d{4}|\d{4}/gi,
};

// Common section headers to identify resume sections
const sectionHeaders = {
  experience: /(?:work\s+)?experience|employment|work\s+history|professional\s+background/i,
  education: /education|academic|qualifications|degrees/i,
  skills: /skills|technical\s+skills|competencies|expertise/i,
  projects: /projects|portfolio|personal\s+projects/i,
  certifications: /certifications?|credentials|licenses/i,
  summary: /summary|objective|profile|about\s+me/i,
};

function extractTextFromBuffer(buffer: Buffer, _mimeType: string): string {
  // For simplicity, we'll handle text extraction
  // In production, you'd use pdf-parse for PDFs and mammoth for DOCX
  try {
    const text = buffer.toString('utf-8');
    // Clean up the text
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  } catch {
    // If UTF-8 decoding fails, try latin1
    return buffer.toString('latin1')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
}

function findSectionContent(text: string, sectionRegex: RegExp, endPatterns: RegExp[]): string {
  const lines = text.split('\n');
  let capturing = false;
  const content: string[] = [];
  
  for (const line of lines) {
    if (sectionRegex.test(line)) {
      capturing = true;
      continue;
    }
    
    if (capturing) {
      // Check if we hit another section
      const isNewSection = endPatterns.some(pattern => pattern.test(line));
      if (isNewSection) {
        break;
      }
      content.push(line);
    }
  }
  
  return content.join('\n').trim();
}

function parseExperience(text: string): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  const experienceSection = findSectionContent(
    text,
    sectionHeaders.experience,
    Object.values(sectionHeaders).filter(p => p !== sectionHeaders.experience)
  );
  
  if (!experienceSection) return experiences;
  
  // Simple heuristic: split by common patterns
  const entries = experienceSection.split(/\n(?=\d{4}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec))/i);
  
  for (const entry of entries) {
    if (entry.trim().length < 10) continue;
    
    const lines = entry.split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    
    const dates = entry.match(patterns.date) || [];
    
    experiences.push({
      id: uuidv4(),
      position: lines[0]?.replace(patterns.date, '').trim() || 'Position',
      company: lines[1]?.replace(patterns.date, '').trim() || 'Company',
      location: '',
      startDate: dates[0] || '',
      endDate: dates[1] || '',
      current: entry.toLowerCase().includes('present') || entry.toLowerCase().includes('current'),
      description: lines.slice(2).join(' ').trim(),
      achievements: [],
    });
  }
  
  return experiences.slice(0, 10); // Limit to 10 entries
}

function parseEducation(text: string): Education[] {
  const education: Education[] = [];
  const educationSection = findSectionContent(
    text,
    sectionHeaders.education,
    Object.values(sectionHeaders).filter(p => p !== sectionHeaders.education)
  );
  
  if (!educationSection) return education;
  
  const entries = educationSection.split(/\n(?=\d{4}|bachelor|master|phd|associate|diploma)/i);
  
  for (const entry of entries) {
    if (entry.trim().length < 10) continue;
    
    const lines = entry.split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    
    const dates = entry.match(patterns.date) || [];
    
    // Try to identify degree and field
    const degreeMatch = entry.match(/(?:bachelor|master|phd|doctorate|associate|diploma)(?:'s)?(?:\s+of\s+)?(?:science|arts|engineering|business)?/i);
    
    education.push({
      id: uuidv4(),
      degree: degreeMatch?.[0] || lines[0]?.trim() || 'Degree',
      field: '',
      institution: lines[1]?.trim() || lines[0]?.trim() || 'Institution',
      location: '',
      startDate: dates[0] || '',
      endDate: dates[1] || dates[0] || '',
      gpa: '',
      achievements: [],
    });
  }
  
  return education.slice(0, 5);
}

function parseSkills(text: string): Skill[] {
  const skills: Skill[] = [];
  const skillsSection = findSectionContent(
    text,
    sectionHeaders.skills,
    Object.values(sectionHeaders).filter(p => p !== sectionHeaders.skills)
  );
  
  if (!skillsSection) return skills;
  
  // Split by common delimiters
  const skillItems = skillsSection
    .split(/[,•·|\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 1 && s.length < 50);
  
  for (const skillName of skillItems) {
    if (skills.length >= 20) break;
    
    skills.push({
      id: uuidv4(),
      name: skillName,
      level: 'Intermediate',
      category: 'Technical',
    });
  }
  
  return skills;
}

function parseProjects(text: string): Project[] {
  const projects: Project[] = [];
  const projectsSection = findSectionContent(
    text,
    sectionHeaders.projects,
    Object.values(sectionHeaders).filter(p => p !== sectionHeaders.projects)
  );
  
  if (!projectsSection) return projects;
  
  const entries = projectsSection.split(/\n(?=[A-Z])/);
  
  for (const entry of entries) {
    if (entry.trim().length < 10) continue;
    
    const lines = entry.split('\n').filter(l => l.trim());
    if (lines.length === 0) continue;
    
    projects.push({
      id: uuidv4(),
      name: lines[0]?.trim() || 'Project',
      description: lines.slice(1).join(' ').trim(),
      technologies: [],
      link: '',
    });
  }
  
  return projects.slice(0, 10);
}

function parseCertifications(text: string): Certification[] {
  const certifications: Certification[] = [];
  const certsSection = findSectionContent(
    text,
    sectionHeaders.certifications,
    Object.values(sectionHeaders).filter(p => p !== sectionHeaders.certifications)
  );
  
  if (!certsSection) return certifications;
  
  const entries = certsSection.split(/\n/).filter(l => l.trim().length > 5);
  
  for (const entry of entries) {
    const dates = entry.match(patterns.date) || [];
    
    certifications.push({
      id: uuidv4(),
      name: entry.replace(patterns.date, '').trim(),
      issuer: '',
      date: dates[0] || '',
      expiryDate: '',
      credentialId: '',
      link: '',
    });
  }
  
  return certifications.slice(0, 10);
}

function parseSummary(text: string): string {
  const summarySection = findSectionContent(
    text,
    sectionHeaders.summary,
    Object.values(sectionHeaders).filter(p => p !== sectionHeaders.summary)
  );
  
  return summarySection.slice(0, 500);
}

function parseResume(text: string): Resume {
  // Extract basic contact info
  const emails = text.match(patterns.email) || [];
  const phones = text.match(patterns.phone) || [];
  const linkedIns = text.match(patterns.linkedin) || [];
  
  // Try to extract name from the first few lines
  const firstLines = text.split('\n').slice(0, 5);
  const nameLine = firstLines.find(line => {
    const trimmed = line.trim();
    return (
      trimmed.length > 2 &&
      trimmed.length < 50 &&
      !patterns.email.test(trimmed) &&
      !patterns.phone.test(trimmed) &&
      !/^\d/.test(trimmed)
    );
  });
  
  return {
    id: uuidv4(),
    personalInfo: {
      fullName: nameLine?.trim() || '',
      email: emails[0] || '',
      phone: phones[0] || '',
      location: '',
      linkedIn: linkedIns[0] || '',
      website: '',
      summary: parseSummary(text),
    },
    workExperience: parseExperience(text),
    education: parseEducation(text),
    skills: parseSkills(text),
    projects: parseProjects(text),
    certifications: parseCertifications(text),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.' },
        { status: 400 }
      );
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }
    
    const buffer = Buffer.from(await file.arrayBuffer());
    const text = extractTextFromBuffer(buffer, file.type);
    
    if (!text || text.length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from the file. Please ensure the file contains readable text.' },
        { status: 400 }
      );
    }
    
    const resume = parseResume(text);
    
    return NextResponse.json({ resume });
  } catch (error) {
    console.error('Resume Parse Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
