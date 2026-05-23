import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAIConfig extends Document {
  /** AES-256-GCM encrypted OpenAI API key (iv:tag:ciphertext) */
  openaiKeyEncrypted?: string;
  /** AES-256-GCM encrypted Gemini API key (iv:tag:ciphertext) */
  geminiKeyEncrypted?: string;
  /** AES-256-GCM encrypted Mistral API key (iv:tag:ciphertext) */
  mistralKeyEncrypted?: string;
  /** Which engine to pre-select in writing assistants */
  defaultEngine: "openai" | "gemini" | "puter" | "mistral";
  /** Which model to pre-select in writing assistants */
  defaultModel: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIConfigSchema: Schema<IAIConfig> = new Schema(
  {
    openaiKeyEncrypted: { type: String, default: null },
    geminiKeyEncrypted: { type: String, default: null },
    mistralKeyEncrypted: { type: String, default: null },
    defaultEngine: {
      type: String,
      enum: ["openai", "gemini", "puter", "mistral"],
      default: "puter",
    },
    defaultModel: { type: String, default: "gpt-4o-mini" },
  },
  { timestamps: true }
);

// Singleton pattern — only one config document per app
const AIConfig: Model<IAIConfig> =
  (mongoose.models.AIConfig as Model<IAIConfig>) ||
  mongoose.model<IAIConfig>("AIConfig", AIConfigSchema);

export default AIConfig;
