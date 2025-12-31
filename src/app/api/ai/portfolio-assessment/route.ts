import { NextRequest, NextResponse } from 'next/server';
import type { Resume, AIProvider, PortfolioAssessment } from '@/types';

interface RequestBody {
  resume: Resume;
  provider: AIProvider;
  apiKey: string;
  careerGoals: string;
}

async function callOpenAI(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional career coach and portfolio analyst. Provide detailed, actionable assessments. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'OpenAI API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json',
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Gemini API error');
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function callClaude(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Claude API error');
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callPerplexity(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: 'You are a professional career coach and portfolio analyst. Provide detailed, actionable assessments. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Perplexity API error');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function createPrompt(resume: Resume, careerGoals: string): string {
  return `Analyze this professional portfolio/resume against the stated career goals and provide a comprehensive assessment.

Career Goals: ${careerGoals}

Portfolio/Resume Data:
- Name: ${resume.personalInfo.fullName}
- Current Summary: ${resume.personalInfo.summary || 'Not provided'}

Work Experience (${resume.workExperience.length} positions):
${resume.workExperience.map((exp) => `
- ${exp.position} at ${exp.company}
  Duration: ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}
  Achievements: ${exp.achievements.join(', ') || 'Not specified'}
`).join('') || 'No experience listed'}

Education (${resume.education.length} entries):
${resume.education.map((edu) => `- ${edu.degree} in ${edu.field} from ${edu.institution}`).join('\n') || 'No education listed'}

Skills (${resume.skills.length} skills):
${resume.skills.map((skill) => `- ${skill.name} (${skill.level}) - ${skill.category}`).join('\n') || 'No skills listed'}

Projects (${resume.projects.length} projects):
${resume.projects.map((proj) => `- ${proj.name}: ${proj.description}\n  Technologies: ${proj.technologies.join(', ')}`).join('\n') || 'No projects listed'}

Certifications (${resume.certifications.length} certifications):
${resume.certifications.map((cert) => `- ${cert.name} from ${cert.issuer}`).join('\n') || 'No certifications listed'}

Provide your assessment as a JSON object with this exact structure:
{
  "overallScore": <number between 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "recommendations": ["recommendation1", "recommendation2", "recommendation3", "recommendation4", "recommendation5"],
  "careerGoalAlignment": "detailed analysis of how well the portfolio aligns with the stated career goals"
}

Consider:
1. Relevance of experience to career goals
2. Skill gaps that need to be filled
3. Education and certification alignment
4. Project portfolio relevance
5. Overall competitiveness in the target job market

Return only the JSON object, no other text.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { resume, provider, apiKey, careerGoals } = body;

    if (!resume || !provider || !apiKey || !careerGoals) {
      return NextResponse.json(
        { error: 'Missing required fields: resume, provider, apiKey, or careerGoals' },
        { status: 400 }
      );
    }

    const prompt = createPrompt(resume, careerGoals);
    let response: string;

    switch (provider) {
      case 'chatgpt':
        response = await callOpenAI(apiKey, prompt);
        break;
      case 'gemini':
        response = await callGemini(apiKey, prompt);
        break;
      case 'claude':
        response = await callClaude(apiKey, prompt);
        break;
      case 'perplexity':
        response = await callPerplexity(apiKey, prompt);
        break;
      default:
        return NextResponse.json({ error: 'Invalid provider' }, { status: 400 });
    }

    // Parse the JSON response
    let assessment: PortfolioAssessment;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        assessment = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON object found in response');
      }
    } catch {
      // If parsing fails, create a default assessment
      assessment = {
        overallScore: 50,
        strengths: ['Unable to parse AI response'],
        weaknesses: ['Assessment could not be completed'],
        recommendations: ['Please try again'],
        careerGoalAlignment: response.slice(0, 500),
      };
    }

    return NextResponse.json({ assessment });
  } catch (error) {
    console.error('Portfolio Assessment Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
