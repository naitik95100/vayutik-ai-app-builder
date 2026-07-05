'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Copy, Trash2, Eye, EyeOff, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'

const AI_PROVIDERS = [
  {
    id: 'openrouter',
    name: 'OpenRouter',
    description: 'Multi-model platform with access to 100+ LLMs',
    icon: '🤖',
    envVar: 'OPENROUTER_API_KEY',
  },
  {
    id: 'groq',
    name: 'Groq',
    description: 'Ultra-fast LLM inference for real-time applications',
    icon: '⚡',
    envVar: 'GROQ_API_KEY',
  },
  {
    id: 'nvidia',
    name: 'NVIDIA NIM',
    description: 'Enterprise-grade AI inference with custom models',
    icon: '🔧',
    envVar: 'NVIDIA_API_KEY',
  },
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'Access to 200k+ open-source models',
    icon: '🤗',
    envVar: 'HUGGINGFACE_API_KEY',
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: 'Claude models for reasoning and long-context tasks',
    icon: '🧠',
    envVar: 'ANTHROPIC_API_KEY',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    description: 'GPT-4 and GPT-3.5 models',
    icon: '🎯',
    envVar: 'OPENAI_API_KEY',
  },
]

interface ApiKey {
  id: string
  provider: string
  key: string
  createdAt: string
  lastUsed?: string
}

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [apiKeyInput, setApiKeyInput] = useState('')
  const [showKey, setShowKey] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleAddKey = () => {
    if (!selectedProvider || !apiKeyInput.trim()) return

    const newKey: ApiKey = {
      id: Math.random().toString(36).substr(2, 9),
      provider: selectedProvider,
      key: apiKeyInput,
      createdAt: new Date().toISOString(),
    }

    setApiKeys([...apiKeys, newKey])
    setApiKeyInput('')
    setSelectedProvider(null)
  }

  const handleDeleteKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id))
  }

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(id)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const getProvider = (id: string) => AI_PROVIDERS.find((p) => p.id === id)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <Link href="/studio" className="inline-flex items-center gap-2 text-primary mb-4 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Settings & Configuration</h1>
          <p className="text-muted-foreground mt-2">Manage API keys and AI provider integrations</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Providers Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">AI Providers</h2>
                <p className="text-muted-foreground">Connect your AI provider accounts to generate apps</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AI_PROVIDERS.map((provider) => {
                  const hasKey = apiKeys.some((k) => k.provider === provider.id)
                  return (
                    <Card
                      key={provider.id}
                      className={`p-4 cursor-pointer transition border-2 ${
                        selectedProvider === provider.id
                          ? 'border-primary bg-primary/5'
                          : hasKey
                            ? 'border-green-200 bg-green-50'
                            : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedProvider(provider.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{provider.icon}</span>
                          <div>
                            <h3 className="font-semibold text-foreground">{provider.name}</h3>
                            <p className="text-sm text-muted-foreground">{provider.description}</p>
                          </div>
                        </div>
                        {hasKey && <Check className="w-5 h-5 text-green-600" />}
                      </div>
                    </Card>
                  )
                })}
              </div>

              {/* API Key Input Section */}
              {selectedProvider && (
                <Card className="p-6 border-primary/30 bg-primary/5">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Add {getProvider(selectedProvider)?.name} API Key
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Your API key will be stored securely and never shared
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-foreground font-medium">
                          {getProvider(selectedProvider)?.envVar}
                        </Label>
                        <Input
                          type="password"
                          placeholder={`Paste your ${getProvider(selectedProvider)?.name} API key here`}
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          className="mt-2 bg-background border-border placeholder:text-muted-foreground"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Get your API key from{' '}
                          <a href="#" className="text-primary hover:underline">
                            {getProvider(selectedProvider)?.name} console
                          </a>
                        </p>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedProvider(null)
                            setApiKeyInput('')
                          }}
                          className="border-border text-foreground hover:bg-secondary"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddKey}
                          disabled={!apiKeyInput.trim()}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add API Key
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Active API Keys */}
              {apiKeys.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Active API Keys</h3>
                  <div className="space-y-3">
                    {apiKeys.map((apiKey) => {
                      const provider = getProvider(apiKey.provider)
                      const isVisible = showKey === apiKey.id
                      return (
                        <Card key={apiKey.id} className="p-4 border-border bg-card flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <span className="text-2xl">{provider?.icon}</span>
                            <div className="flex-1">
                              <p className="font-medium text-foreground">{provider?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Added {new Date(apiKey.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex-1 flex items-center">
                              <code className="text-xs bg-secondary px-3 py-2 rounded font-mono text-muted-foreground max-w-xs overflow-hidden">
                                {isVisible ? apiKey.key : '•'.repeat(20)}
                              </code>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowKey(isVisible ? null : apiKey.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              {copiedKey === apiKey.id ? (
                                <Check className="w-4 h-4 text-green-600" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteKey(apiKey.id)}
                              className="text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="p-6 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-3">Getting Started</h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-primary">1</span>
                  <span>Select an AI provider</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">2</span>
                  <span>Get your API key from the provider</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">3</span>
                  <span>Paste it here to enable integration</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary">4</span>
                  <span>Start creating apps with AI</span>
                </li>
              </ol>
            </Card>

            <Card className="p-6 border-green-200 bg-green-50">
              <h3 className="font-semibold text-foreground mb-2">Pro Tip</h3>
              <p className="text-sm text-muted-foreground">
                Add multiple provider keys to switch between them while creating apps. Each provider has different strengths for different use cases.
              </p>
            </Card>

            <Card className="p-6 border-border bg-card">
              <h3 className="font-semibold text-foreground mb-3">Provider Comparison</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p><span className="font-medium text-foreground">OpenRouter:</span> Best selection of models</p>
                <p><span className="font-medium text-foreground">Groq:</span> Fastest inference</p>
                <p><span className="font-medium text-foreground">Anthropic:</span> Long context windows</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
