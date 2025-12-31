'use client';

import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Button, Card, CardContent, CardHeader } from '@/components/ui';
import type { AIRecommendation } from '@/types';

interface AIRecommendationsProps {
  className?: string;
}

export function AIRecommendations({ className = '' }: AIRecommendationsProps) {
  const { resume, aiSettings } = useResumeStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  const handleGetRecommendations = async () => {
    if (!aiSettings.isEnabled || !aiSettings.apiKey) {
      setError('Please enable AI features first by configuring your API key');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resume,
          provider: aiSettings.provider,
          apiKey: aiSettings.apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      setRecommendations(data.recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-600 border-gray-200',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };

  if (!aiSettings.isEnabled) {
    return (
      <Card className={className}>
        <CardContent className="py-8 text-center">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">AI Recommendations</h3>
          <p className="text-gray-500 text-sm mb-4">
            Enable AI features in Settings to get personalized recommendations
          </p>
          <Button variant="outline" disabled>
            Get Recommendations
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <h3 className="font-semibold">AI Recommendations</h3>
        </div>
        <Button
          size="sm"
          onClick={handleGetRecommendations}
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Get Recommendations
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg mb-4">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {recommendations.length > 0 ? (
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${priorityColors[rec.priority]}`}
              >
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-semibold uppercase">{rec.section}</span>
                    <p className="text-sm mt-1">{rec.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !loading && (
          <p className="text-gray-500 text-sm text-center py-4">
            Click &quot;Get Recommendations&quot; to receive AI-powered suggestions for improving your resume
          </p>
        )}
      </CardContent>
    </Card>
  );
}
