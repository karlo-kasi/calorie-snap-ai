import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

/**
 * Configurazione dei modelli AI disponibili con fallback automatico
 * I modelli verranno provati nell'ordine specificato
 */

// Inizializza client Anthropic (Claude)
const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Inizializza client OpenAI (GPT-4 Vision) solo se la chiave API è disponibile
let openaiClient = null;
if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

/**
 * Lista dei modelli AI disponibili in ordine di priorità
 * Ogni modello ha un provider, nome, e funzione per analizzare
 */
export const AI_MODELS = [
  {
    name: "Claude Sonnet 4",
    provider: "anthropic",
    model: "claude-sonnet-4-20250514",
    enabled: !!process.env.ANTHROPIC_API_KEY || !!process.env.CLAUDE_API_KEY,
    maxTokens: 1024,
    analyze: async (imageBase64, mediaType, prompt) => {
      const message = await anthropicClient.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      });

      return message.content[0].text;
    },
  },
  {
    name: "Claude Sonnet 3.5",
    provider: "anthropic",
    model: "claude-3-5-sonnet-20241022",
    enabled: !!process.env.ANTHROPIC_API_KEY || !!process.env.CLAUDE_API_KEY,
    maxTokens: 1024,
    analyze: async (imageBase64, mediaType, prompt) => {
      const message = await anthropicClient.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      });

      return message.content[0].text;
    },
  },
  {
    name: "Claude Haiku 3.5",
    provider: "anthropic",
    model: "claude-3-5-haiku-20241022",
    enabled: !!process.env.ANTHROPIC_API_KEY || !!process.env.CLAUDE_API_KEY,
    maxTokens: 1024,
    analyze: async (imageBase64, mediaType, prompt) => {
      const message = await anthropicClient.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      });

      return message.content[0].text;
    },
  },
  {
    name: "GPT-4o",
    provider: "openai",
    model: "gpt-4o",
    enabled: !!process.env.OPENAI_API_KEY,
    maxTokens: 2000,
    analyze: async (imageBase64, mediaType, prompt) => {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o",
        max_tokens: 2000,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a food nutrition analysis AI. You must respond ONLY with valid JSON, no other text.",
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mediaType};base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      });

      return response.choices[0].message.content;
    },
  },
  {
    name: "GPT-4o Mini",
    provider: "openai",
    model: "gpt-4o-mini",
    enabled: !!process.env.OPENAI_API_KEY,
    maxTokens: 2000,
    analyze: async (imageBase64, mediaType, prompt) => {
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 2000,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a food nutrition analysis AI. You must respond ONLY with valid JSON, no other text.",
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:${mediaType};base64,${imageBase64}`,
                },
              },
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      });

      return response.choices[0].message.content;
    },
  },
];

/**
 * Ottieni la lista dei modelli attivi (con API key configurata)
 */
export const getActiveModels = () => {
  const activeModels = AI_MODELS.filter((model) => model.enabled);

  console.log("🤖 Modelli AI disponibili:");
  activeModels.forEach((model, index) => {
    console.log(`  ${index + 1}. ${model.name} (${model.provider})`);
  });

  if (activeModels.length === 0) {
    console.warn("⚠️ ATTENZIONE: Nessun modello AI configurato! Configura almeno una API key.");
  }

  return activeModels;
};

/**
 * Verifica se almeno un modello è disponibile
 */
export const hasActiveModels = () => {
  return AI_MODELS.some((model) => model.enabled);
};

export default {
  AI_MODELS,
  getActiveModels,
  hasActiveModels,
};
