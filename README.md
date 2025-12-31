# Resume Builder

Making the perfect resume is a heavy task. This app simplifies it with some good algorithms to help you craft a better resume, catering to your skills and abilities, and giving you infinite options to make it beautiful, subtle and outstanding.

## Features

### 🧙 Wizard-Style Resume Builder
A step-by-step process to create your perfect resume:
- **Personal Information** - Contact details and professional summary
- **Work Experience** - Employment history with achievements
- **Education** - Academic background and qualifications
- **Skills** - Technical and soft skills with proficiency levels
- **Projects** - Personal and professional projects
- **Certifications** - Professional credentials and certifications
- **Preview & Export** - Review and download your resume as PDF

### 🤖 AI-Powered Recommendations
Get personalized suggestions to improve your resume using leading AI models:
- **ChatGPT** (OpenAI)
- **Gemini** (Google)
- **Claude** (Anthropic)
- **Perplexity AI**

### 📄 Resume Import
Upload your existing resume (PDF, DOC, DOCX) and automatically extract data into the builder.

### 🎯 Portfolio Assessment
Analyze your portfolio against your career goals using AI to get:
- Overall alignment score
- Identified strengths
- Areas for improvement
- Actionable recommendations

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### AI Configuration

To use AI features, you need an API key from one of the supported providers:

#### ChatGPT (OpenAI)
1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to API Keys section
3. Create a new secret key
4. Copy and paste in the app settings

#### Gemini (Google)
1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Click "Get API key"
3. Create API key in a new or existing project
4. Copy and paste in the app settings

#### Claude (Anthropic)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Navigate to Settings → API Keys
3. Create a new key
4. Copy and paste in the app settings

#### Perplexity AI
1. Go to [perplexity.ai](https://www.perplexity.ai)
2. Navigate to Settings → API
3. Generate an API key
4. Copy and paste in the app settings

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Form Handling**: React Hook Form

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── ai/           # AI integration endpoints
│   │   └── parse-resume/ # Resume parsing endpoint
│   ├── builder/          # Resume builder page
│   └── portfolio-assessment/ # Portfolio assessment page
├── components/            # React components
│   ├── ai/               # AI-related components
│   ├── ui/               # Reusable UI components
│   └── wizard/           # Wizard step components
├── store/                # Zustand store
├── types/                # TypeScript types
└── lib/                  # Utility functions
```

## Privacy

Your API keys are stored locally in your browser and are never sent to our servers. They are only used to make direct requests to the respective AI provider's API.

## Technical Requirements Met

- ✅ Pop UI/UX with high interactivity and intuitive design
- ✅ Wizard-like process to create optimal resumes
- ✅ AI recommendations from multiple providers (ChatGPT, Gemini, Claude, Perplexity)
- ✅ Guide steps to obtain API keys for each provider
- ✅ Resume upload feature to load data from existing resumes
- ✅ Portfolio assessment feature for career goal analysis
- ✅ AI features enabled only when API key is provided

## License

MIT License - See [LICENSE](LICENSE) for details.

Project lead: [@Rishurajgautam24](https://github.com/Rishurajgautam24)
