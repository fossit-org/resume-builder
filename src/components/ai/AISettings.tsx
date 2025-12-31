'use client';

import React, { useState } from 'react';
import { Key, Check, Info, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useResumeStore } from '@/store';
import { Button, Input, Card, CardContent, CardHeader } from '@/components/ui';
import type { AIProvider } from '@/types';

interface ProviderConfig {
  id: AIProvider;
  name: string;
  icon: string;
  color: string;
  guideSteps: string[];
  keyUrl: string;
  keyPlaceholder: string;
}

const providers: ProviderConfig[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT (OpenAI)',
    icon: '🤖',
    color: 'from-green-500 to-emerald-600',
    keyUrl: 'https://platform.openai.com/api-keys',
    keyPlaceholder: 'sk-...',
    guideSteps: [
      'Go to platform.openai.com and sign in (or create an account)',
      'Navigate to API section in the left sidebar',
      'Click on "API Keys" in the menu',
      'Click "Create new secret key"',
      'Give it a name and copy the generated key',
      'Paste the key below (starts with "sk-")',
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini (Google)',
    icon: '✨',
    color: 'from-blue-500 to-indigo-600',
    keyUrl: 'https://aistudio.google.com/apikey',
    keyPlaceholder: 'AIza...',
    guideSteps: [
      'Go to aistudio.google.com and sign in with Google',
      'Click "Get API key" in the left menu',
      'Click "Create API key" button',
      'Choose to create in a new or existing project',
      'Copy the generated API key',
      'Paste the key below (starts with "AIza")',
    ],
  },
  {
    id: 'claude',
    name: 'Claude (Anthropic)',
    icon: '🎭',
    color: 'from-orange-500 to-amber-600',
    keyUrl: 'https://console.anthropic.com/settings/keys',
    keyPlaceholder: 'sk-ant-...',
    guideSteps: [
      'Go to console.anthropic.com and sign in',
      'Navigate to "Settings" in the top right',
      'Click on "API Keys" tab',
      'Click "Create Key" button',
      'Name your key and click "Create"',
      'Copy the key (starts with "sk-ant-")',
    ],
  },
  {
    id: 'perplexity',
    name: 'Perplexity AI',
    icon: '🔮',
    color: 'from-purple-500 to-violet-600',
    keyUrl: 'https://www.perplexity.ai/settings/api',
    keyPlaceholder: 'pplx-...',
    guideSteps: [
      'Go to perplexity.ai and sign in',
      'Navigate to Settings → API',
      'Click on "Generate API Key"',
      'Copy the generated API key',
      'Paste the key below (starts with "pplx-")',
    ],
  },
];

export function AISettings() {
  const { aiSettings, setAIProvider, setAPIKey, enableAI, disableAI } = useResumeStore();
  const [showGuide, setShowGuide] = useState<AIProvider | null>(null);
  const [showKey, setShowKey] = useState(false);

  const selectedProvider = providers.find((p) => p.id === aiSettings.provider);

  const handleProviderSelect = (provider: AIProvider) => {
    if (aiSettings.provider === provider) {
      setAIProvider(null);
    } else {
      setAIProvider(provider);
      setShowGuide(provider);
    }
  };

  const handleKeySubmit = () => {
    if (aiSettings.apiKey) {
      enableAI();
    }
  };

  const handleDisable = () => {
    disableAI();
    setAPIKey('');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">AI Settings</h2>
        <p className="text-gray-500 mt-2">
          Select an AI provider and enter your API key to enable AI-powered features
        </p>
      </div>

      {/* Provider Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider) => (
          <Card
            key={provider.id}
            hover
            className={`cursor-pointer transition-all ${
              aiSettings.provider === provider.id
                ? 'ring-2 ring-indigo-500 ring-offset-2'
                : ''
            }`}
          >
            <CardContent
              className="flex items-center gap-4 py-4"
              onClick={() => handleProviderSelect(provider.id)}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${provider.color} flex items-center justify-center text-2xl`}
              >
                {provider.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{provider.name}</h3>
                <p className="text-sm text-gray-500">Click to select</p>
              </div>
              {aiSettings.provider === provider.id && aiSettings.isEnabled && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* API Key Input */}
      {selectedProvider && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-indigo-600" />
              <h3 className="font-semibold">{selectedProvider.name} API Key</h3>
            </div>
            <button
              onClick={() => setShowGuide(showGuide === selectedProvider.id ? null : selectedProvider.id)}
              className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm"
            >
              <Info className="w-4 h-4" />
              {showGuide === selectedProvider.id ? 'Hide Guide' : 'How to get API key'}
            </button>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Guide Steps */}
            {showGuide === selectedProvider.id && (
              <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-indigo-900 mb-3">
                  How to get your {selectedProvider.name} API Key:
                </h4>
                <ol className="space-y-2">
                  {selectedProvider.guideSteps.map((step, index) => (
                    <li key={index} className="flex gap-2 text-sm text-indigo-800">
                      <span className="w-5 h-5 bg-indigo-200 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <a
                  href={selectedProvider.keyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Open {selectedProvider.name} Console
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            )}

            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  type={showKey ? 'text' : 'password'}
                  value={aiSettings.apiKey}
                  onChange={(e) => setAPIKey(e.target.value)}
                  placeholder={selectedProvider.keyPlaceholder}
                  disabled={aiSettings.isEnabled}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {aiSettings.isEnabled ? (
                <Button variant="danger" onClick={handleDisable}>
                  Disable
                </Button>
              ) : (
                <Button onClick={handleKeySubmit} disabled={!aiSettings.apiKey}>
                  Enable AI
                </Button>
              )}
            </div>

            {aiSettings.isEnabled && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <Check className="w-4 h-4" />
                AI features are now enabled with {selectedProvider.name}
              </div>
            )}

            <p className="text-xs text-gray-400">
              Your API key is stored locally in your browser and is never sent to our servers.
              It is only used to make direct requests to {selectedProvider.name}&apos;s API.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
