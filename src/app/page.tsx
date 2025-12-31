import Link from 'next/link';
import { FileText, Sparkles, Upload, Target, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
            Build Your Perfect Resume
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Create stunning, professional resumes with AI-powered recommendations. 
            Our wizard-style builder makes it easy to craft the perfect resume for your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              Start Building
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/portfolio-assessment"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all duration-200"
            >
              <Target className="w-5 h-5" />
              Assess Portfolio
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Everything You Need to Create the Perfect Resume
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Wizard-Style Builder
            </h3>
            <p className="text-gray-600">
              Step-by-step guidance through each section of your resume for a complete, professional result.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Recommendations
            </h3>
            <p className="text-gray-600">
              Get personalized suggestions from ChatGPT, Gemini, Claude, or Perplexity to improve your resume.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-pink-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Import Existing Resume
            </h3>
            <p className="text-gray-600">
              Upload your existing resume in PDF or Word format and we&apos;ll extract the data automatically.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
              <Target className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Portfolio Assessment
            </h3>
            <p className="text-gray-600">
              Use AI to analyze your portfolio against your career goals and get actionable insights.
            </p>
          </div>
        </div>
      </div>

      {/* AI Providers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Powered by Leading AI Models</h2>
            <p className="text-indigo-100 max-w-2xl mx-auto">
              Choose your preferred AI provider to get personalized recommendations. 
              Use your own API key for complete privacy and control.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <span className="text-3xl mb-2 block">🤖</span>
              <span className="font-semibold">ChatGPT</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <span className="text-3xl mb-2 block">✨</span>
              <span className="font-semibold">Gemini</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <span className="text-3xl mb-2 block">🎭</span>
              <span className="font-semibold">Claude</span>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
              <span className="text-3xl mb-2 block">🔮</span>
              <span className="font-semibold">Perplexity</span>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Join thousands of job seekers who have created stunning resumes with our builder.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Resume Builder. Built with ❤️ for job seekers everywhere.
          </p>
        </div>
      </footer>
    </div>
  );
}
