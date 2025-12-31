import { NextRequest, NextResponse } from 'next/server';
import type { Resume, AIProvider, AIRecommendation } from '@/types';

interface RequestBody {
  resume: Resume;
  provider: AIProvider;
  apiKey: string;
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
          content: 'You are a professional resume reviewer and career coach. Provide actionable, specific recommendations to improve resumes. Always respond with valid JSON.',
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
          content: 'You are a professional resume reviewer and career coach. Provide actionable, specific recommendations to improve resumes. Always respond with valid JSON.',
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

function createPrompt(resume: Resume): string {
  return `Analyze this resume and provide recommendations for improvement.

Resume Data:
- Name: ${resume.personalInfo.fullName}
- Email: ${resume.personalInfo.email}
- Summary: ${resume.personalInfo.summary || 'Not provided'}

Work Experience:
${resume.workExperience.map((exp) => `- ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.current ? 'Present' : exp.endDate})`).join('\n') || 'None'}

Education:
${resume.education.map((edu) => `- ${edu.degree} in ${edu.field} from ${edu.institution}`).join('\n') || 'None'}

Skills:
${resume.skills.map((skill) => `- ${skill.name} (${skill.level})`).join('\n') || 'None'}

Projects:
${resume.projects.map((proj) => `- ${proj.name}: ${proj.description}`).join('\n') || 'None'}

Certifications:
${resume.certifications.map((cert) => `- ${cert.name} from ${cert.issuer}`).join('\n') || 'None'}

Provide your response as a JSON array of recommendations with this exact structure:
[
  {
    "section": "section name (e.g., Summary, Experience, Skills)",
    "recommendation": "specific actionable recommendation",
    "priority": "low" | "medium" | "high"
  }
]

Focus on:
1. Missing important sections
2. Ways to strengthen existing content
3. Formatting and presentation suggestions
4. Keywords and phrases for ATS systems
5. Quantifiable achievements

Return only the JSON array, no other text.`;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { resume, provider, apiKey } = body;

    if (!resume || !provider || !apiKey) {
      return NextResponse.json(
        { error: 'Missing required fields: resume, provider, or apiKey' },
        { status: 400 }
      );
    }

    const prompt = createPrompt(resume);
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
    let recommendations: AIRecommendation[];
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON array found in response');
      }
    } catch {
      // If parsing fails, create a generic recommendation
      recommendations = [
        {
          section: 'General',
          recommendation: response.slice(0, 500),
          priority: 'medium',
        },
      ];
    }

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An error occurred' },
      { status: 500 }
    );
  }
}
