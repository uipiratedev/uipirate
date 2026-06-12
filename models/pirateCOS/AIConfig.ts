import mongoose, { Schema, Document, Model } from "mongoose";
import { AIEngine, AI_ENGINE_IDS } from "@/lib/pirateCOS/ai-registry";

export interface IAIConfig extends Document {
  /** References the Admin._id that owns this config — one doc per tenant */
  tenantId: mongoose.Types.ObjectId;
  /** AES-256-GCM encrypted OpenAI API key (iv:tag:ciphertext) */
  openaiKeyEncrypted?: string;
  /** AES-256-GCM encrypted Gemini API key (iv:tag:ciphertext) */
  geminiKeyEncrypted?: string;
  /** AES-256-GCM encrypted Mistral API key (iv:tag:ciphertext) */
  mistralKeyEncrypted?: string;
  /** AES-256-GCM encrypted Anthropic API key (iv:tag:ciphertext) */
  anthropicKeyEncrypted?: string;
  /** AES-256-GCM encrypted Grok API key (iv:tag:ciphertext) */
  grokKeyEncrypted?: string;
  /** AES-256-GCM encrypted OpenRouter API key (iv:tag:ciphertext) */
  openrouterKeyEncrypted?: string;
  /** Which engine to pre-select in writing assistants */
  defaultEngine: AIEngine;
  /** Which model to pre-select in writing assistants */
  defaultModel: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIConfigSchema: Schema<IAIConfig> = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    openaiKeyEncrypted: { type: String, default: null },
    geminiKeyEncrypted: { type: String, default: null },
    mistralKeyEncrypted: { type: String, default: null },
    anthropicKeyEncrypted: { type: String, default: null },
    grokKeyEncrypted: { type: String, default: null },
    openrouterKeyEncrypted: { type: String, default: null },
    defaultEngine: {
      type: String,
      enum: AI_ENGINE_IDS,
      default: "puter",
    },
    defaultModel: { type: String, default: "gpt-4o-mini" },
  },
  { timestamps: true },
);

// One config document per tenant — query with findOne({ tenantId })
const AIConfig: Model<IAIConfig> =
  (mongoose.models.AIConfig as Model<IAIConfig>) ||
  mongoose.model<IAIConfig>("AIConfig", AIConfigSchema);

export default AIConfig;
