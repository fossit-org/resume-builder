'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Home, Target, Loader2, AlertCircle, ArrowLeft, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { useResumeStore } from '@/store';
import { AISettings } from '@/components/ai/AISettings';
import { Button, Card, CardContent, CardHeader, TextArea } from '@/components/ui';
import type { PortfolioAssessment } from '@/types';

export default function PortfolioAssessmentPage() {
  const { resume, aiSettings } = useResumeStore();
  const [careerGoals, setCareerGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<PortfolioAssessment | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleAssess = async () => {
    if (!aiSettings.isEnabled || !aiSettings.apiKey) {
      setError('Please enable AI features first by configuring your API key');
      return;
    }

    if (!careerGoals.trim()) {
      setError('Please enter your career goals');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/portfolio-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume,
          provider: aiSettings.provider,
          apiKey: aiSettings.apiKey,
          careerGoals,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to assess portfolio');
      }

      setAssessment(data.assessment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <span className="text-gray-300">|</span>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-600" />
                Portfolio Assessment
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                {showSettings ? 'Back' : 'AI Settings'}
              </Button>
              <Link href="/builder">
                <Button variant="outline" size="sm">
                  Go to Builder
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSettings ? (
          <AISettings />
        ) : (
          <div className="space-y-8">
            {/* Introduction */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Assess Your Portfolio Against Your Career Goals
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Enter your career goals and let AI analyze how well your current portfolio 
                aligns with your aspirations. Get actionable recommendations to bridge any gaps.
              </p>
            </div>

            {/* AI Status */}
            {!aiSettings.isEnabled && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-amber-600" />
                      <div>
                        <p className="font-medium text-amber-800">AI Features Required</p>
                        <p className="text-sm text-amber-600">Configure your AI provider to use this feature</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => setShowSettings(true)}>
                      Configure AI
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Career Goals Input */}
            <Card>
              <CardHeader>
                <h3 className="font-semibold text-gray-900">Your Career Goals</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextArea
                  value={careerGoals}
                  onChange={(e) => setCareerGoals(e.target.value)}
                  placeholder="Describe your career goals. For example:&#10;&#10;I want to transition from a frontend developer role to a full-stack engineering position at a top tech company. My target roles are Senior Software Engineer or Tech Lead positions that involve system design and mentoring junior developers."
                  rows={6}
                />
                <Button
                  onClick={handleAssess}
                  disabled={!aiSettings.isEnabled || loading || !careerGoals.trim()}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing Your Portfolio...
                    </>
                  ) : (
                    <>
                      <Target className="w-5 h-5" />
                      Assess My Portfolio
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Assessment Results */}
            {assessment && (
              <div className="space-y-6">
                {/* Overall Score */}
                <Card>
                  <CardContent className="py-8 text-center">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${getScoreBg(assessment.overallScore)} mb-4`}>
                      <span className={`text-4xl font-bold ${getScoreColor(assessment.overallScore)}`}>
                        {assessment.overallScore}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Overall Score</h3>
                    <p className="text-gray-500 mt-1">out of 100</p>
                  </CardContent>
                </Card>

                {/* Career Goal Alignment */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Target className="w-5 h-5 text-indigo-600" />
                      Career Goal Alignment
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{assessment.careerGoalAlignment}</p>
                  </CardContent>
                </Card>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold text-green-700 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Strengths
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {assessment.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <span className="text-green-500 mt-1">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <h3 className="font-semibold text-red-700 flex items-center gap-2">
                        <TrendingDown className="w-5 h-5" />
                        Areas to Improve
                      </h3>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {assessment.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-700">
                            <span className="text-red-500 mt-1">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      Recommendations
                    </h3>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {assessment.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {i + 1}
                          </span>
                          <span className="text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Back to Builder CTA */}
                <div className="text-center">
                  <p className="text-gray-600 mb-4">
                    Ready to improve your resume based on these insights?
                  </p>
                  <Link href="/builder">
                    <Button className="flex items-center gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Go to Resume Builder
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
