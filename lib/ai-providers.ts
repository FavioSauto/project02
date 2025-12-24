/**
 * AI Provider Configuration
 * Centralized AI/LLM client setup using Vercel AI SDK
 */

import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';

/**
 * Get OpenAI model instance
 * Uses Vercel AI SDK for unified interface
 */
export function getOpenAIModel(model?: string) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI configuration error');
  }

  const openai = createOpenAI({
    apiKey,
  });

  return openai(model || process.env.OPENAI_MODEL || 'gpt-4o');
}

/**
 * Get Anthropic model instance
 * Uses Vercel AI SDK for unified interface
 */
export function getAnthropicModel(model?: string) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Claude configuration error');
  }

  const anthropic = createAnthropic({
    apiKey,
  });

  return anthropic(model || process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022');
}

/**
 * Get the default AI model
 * Can be switched between providers via environment variable
 */
export function getDefaultAIModel() {
  const provider = process.env.AI_PROVIDER || 'openai';

  switch (provider) {
    case 'anthropic':
      return getAnthropicModel();
    case 'openai':
    default:
      return getOpenAIModel();
  }
}

/**
 * Get AI model based on subscription tier
 * Only Pro tier is supported (Free tier removed)
 */
export function getModelForTier(tier: 'Pro' | null) {
  if (tier !== 'Pro') {
    throw new Error('Active Pro subscription required to access AI models');
  }

  const provider = process.env.AI_PROVIDER || 'anthropic';

  // Use advanced models for Pro tier
  switch (provider) {
    case 'anthropic':
      return getAnthropicModel(process.env.ANTHROPIC_PRO_MODEL || 'claude-3-5-sonnet-20241022');
    case 'openai':
    default:
      return getOpenAIModel(process.env.OPENAI_PRO_MODEL || 'gpt-4o');
  }
}
