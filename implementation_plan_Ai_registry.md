# Dynamic Provider Registry System

Replace all hardcoded AI provider/model lists scattered across 6+ files with a single, centralized registry module — making PirateCOS ready for dynamic provider discovery and BYOK scaling.

## Problem

The exact same provider list (`"openai" | "gemini" | "puter" | "mistral" | "anthropic"`) and model catalog are **copy-pasted in 10+ locations**:

| Duplication Point | File | Copies |
|:---|:---|:---:|
| Type union `AIEngine` | [ai-provider.ts](file:///d:/ui-pirate/uipirate/lib/pirateCOS/ai-provider.ts#L1) | 1 |
| Type union inline | [AIConfigPanel.tsx](file:///d:/ui-pirate/uipirate/components/pirateCOS/AIConfigPanel.tsx#L14) | 3 |
| Type union inline | [create/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/create/page.tsx#L2353) | 4 |
| Type union inline | [edit/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/edit/[id]/page.tsx#L2631) | 4 |
| `Engine` type + metadata | [ai-settings/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/ai-settings/page.tsx#L8) | 1 |
| Mongoose enum | [AIConfig.ts](file:///d:/ui-pirate/uipirate/models/pirateCOS/AIConfig.ts#L36) | 1 |
| Model `<option>` lists | create + edit + settings pages | ~16 |
| Default model map | [ai-provider.ts](file:///d:/ui-pirate/uipirate/lib/pirateCOS/ai-provider.ts#L13) + pages | 5+ |
| Engine logos map | [ai-settings/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/ai-settings/page.tsx#L27) + panels | 3+ |

Adding a new provider (e.g., Groq, Cohere, xAI) currently requires editing **10+ files** manually. This is not scalable.

---

## Proposed Changes

### Registry Core — Single Source of Truth

#### [NEW] [ai-registry.ts](file:///d:/ui-pirate/uipirate/lib/pirateCOS/ai-registry.ts)

The **central registry module** that exports everything every consumer needs:

```ts
// ── Types ──
export type AIEngine = "openai" | "gemini" | "mistral" | "anthropic" | "puter";
export type AIKeyProvider = Exclude<AIEngine, "puter">;

// ── Provider Registry Entry ──
export interface AIProviderEntry {
  id: AIEngine;
  name: string;              // "OpenAI"
  shortName: string;         // "GPT" (for compact UIs)
  logo: string;              // "/assets/logos/ai/openai.svg"
  color: string;             // brand accent hex
  badgeColor: string;        // tailwind badge token
  requiresKey: boolean;      // false for puter
  keyPlaceholder?: string;   // "sk-..."
  keyDescription?: string;   // "Used for GPT-4o, GPT-5..."
  keyLink?: string;          // "https://platform.openai.com/api-keys"
  keyLinkLabel?: string;     // "platform.openai.com/api-keys"
  sourceColors?: {...};      // bg/border/dot/text for key status pills
}

// ── Model Registry Entry ──
export interface AIModelEntry {
  id: string;                // "gpt-4o-mini"
  label: string;             // "GPT-4o Mini"
  description?: string;      // "(Fast)" 
  provider: AIEngine;
  isDefault?: boolean;       // first model to select when engine chosen
}

// ── Exports ──
export const AI_PROVIDERS: AIProviderEntry[];
export const AI_MODELS: AIModelEntry[];
export const AI_ENGINE_IDS: AIEngine[];

// ── Helpers ──
export function getProvider(id: AIEngine): AIProviderEntry;
export function getModelsForEngine(engine: AIEngine): AIModelEntry[];
export function getDefaultModelForEngine(engine: AIEngine): string;
export function getProviderLabel(engine: AIEngine): string;
export function getProviderLogo(engine: AIEngine): string;
export function isAIEngine(value: unknown): value is AIEngine;
```

**Key design decisions:**
- All data is **static/const** — no runtime fetching needed for registry metadata
- Models are flat-listed with a `provider` field for easy filtering
- Each provider entry carries its own UI metadata (colors, logos, key config link)
- Helper functions replace scattered ternary chains

---

### Shared Lib Refactor

#### [MODIFY] [ai-provider.ts](file:///d:/ui-pirate/uipirate/lib/pirateCOS/ai-provider.ts)

- **Remove** duplicated `AIEngine` type, `DEFAULT_MODEL_BY_ENGINE`, `AI_ENGINE_ORDER`, `getAIEngineLabel`, `isAIEngine`
- **Re-export** everything from `ai-registry.ts` for backward compatibility
- Keep `resolveAIEngine()`, `getAIKeyForEngine()` — they use runtime key data, not registry metadata

---

### Component Refactor

#### [MODIFY] [AIConfigPanel.tsx](file:///d:/ui-pirate/uipirate/components/pirateCOS/AIConfigPanel.tsx)

- Replace 3x inline `"openai" | "gemini" | "puter" | "mistral" | "anthropic"` type unions → import `AIEngine`
- Replace hardcoded engine button array (lines 358-399) → `AI_PROVIDERS.map(...)` using `getProviderLogo()` and `provider.shortName`
- Replace hardcoded `<option>` model lists (lines 411-448) → `getModelsForEngine(defaultEngine).map(...)`
- Replace ternary `setDefaultModel(...)` chain → `setDefaultModel(getDefaultModelForEngine(eng))`

#### [MODIFY] [ai-settings/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/ai-settings/page.tsx)

- Remove local `Engine` type, `ENGINE_META`, `ENGINE_LOGOS`, `MODEL_LABELS`, `PROVIDER_INFO` (~117 lines)
- Import from `ai-registry.ts`
- Refactor `ProviderKeyCard` grid to iterate `AI_PROVIDERS.filter(p => p.requiresKey)` 
- Refactor engine selector buttons and model `<select>` dropdowns to use registry helpers

---

### Page Refactor (create + edit)

#### [MODIFY] [create/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/create/page.tsx)

The create page has **4 independent modal components** that each duplicate:
- Engine type union (lines 2353, 2995, 3532, 4105)
- Engine sync `useEffect` with model defaults (lines 2368-2379, etc.)
- Engine button toolbar (~30 lines each × 4 = ~120 lines)
- Model `<select>` dropdown (~40 lines each × 4 = ~160 lines)
- Top-level `modelOptions` and `getDefaultModelForEngine` (lines 141-177)

**Changes:**
1. Remove top-level `modelOptions` and `getDefaultModelForEngine` — use registry
2. Create a shared `<EngineModelSelector>` component that encapsulates:
   - Engine button bar (renders from `AI_PROVIDERS`)
   - Model dropdown (renders from `getModelsForEngine()`)
   - `useEffect` sync logic
3. Replace all 4 modal engine/model blocks with `<EngineModelSelector engine={engine} model={model} onEngineChange={setEngine} onModelChange={setModel} />`

This eliminates **~280 lines of duplicated JSX** per page.

#### [MODIFY] [edit/[id]/page.tsx](file:///d:/ui-pirate/uipirate/app/pirateCOS/(authed)/posts/edit/[id]/page.tsx)

Same refactor as create page — likely 4 similar modal blocks.

---

### New Shared Component

#### [NEW] [EngineModelSelector.tsx](file:///d:/ui-pirate/uipirate/components/pirateCOS/EngineModelSelector.tsx)

A reusable component that replaces ~70 lines of duplicated JSX everywhere:

```tsx
interface Props {
  engine: AIEngine;
  model: string;
  onEngineChange: (engine: AIEngine) => void;
  onModelChange: (model: string) => void;
}

export const EngineModelSelector: React.FC<Props> = ({...}) => {
  // Auto-sync model when engine changes
  useEffect(() => { ... uses getDefaultModelForEngine() }, [engine]);
  
  return (
    <>
      {/* Engine button bar from AI_PROVIDERS */}
      {/* Model <select> from getModelsForEngine(engine) */}
    </>
  );
};
```

---

### Schema Update

#### [MODIFY] [AIConfig.ts](file:///d:/ui-pirate/uipirate/models/pirateCOS/AIConfig.ts)

- Import `AI_ENGINE_IDS` from registry
- Replace hardcoded `enum: ["openai", "gemini", "puter", "mistral", "anthropic"]` → `enum: AI_ENGINE_IDS`
- Replace inline type union → import `AIEngine` type

---

## Execution Order

| Step | Task | Files | LOC Impact |
|:---:|:---|:---|:---:|
| 1 | Create `ai-registry.ts` with all provider + model data | 1 new | +~200 |
| 2 | Create `EngineModelSelector.tsx` shared component | 1 new | +~80 |
| 3 | Refactor `ai-provider.ts` to re-export from registry | 1 modify | -40 |
| 4 | Refactor `AIConfigPanel.tsx` | 1 modify | -60 |
| 5 | Refactor `ai-settings/page.tsx` | 1 modify | -100 |
| 6 | Refactor `create/page.tsx` (4 modals) | 1 modify | -280 |
| 7 | Refactor `edit/[id]/page.tsx` (4 modals) | 1 modify | -280 |
| 8 | Update `AIConfig.ts` model | 1 modify | -5 |
| 9 | Update master plan + tracker docs | 2 modify | +30 |

**Net effect:** ~480 lines of duplicated code removed, replaced by ~280 lines of centralized registry + component.

---

## User Review Required

> [!IMPORTANT]
> **Backward-compatible refactor**: No new API routes, no DB migrations, no behavior changes. This is a pure code-architecture improvement. All existing functionality remains identical.

> [!NOTE]
> **Future extensibility**: Once this registry exists, adding a new provider (e.g., Groq, xAI) becomes a **1-file change** — just add an entry to `AI_PROVIDERS` and `AI_MODELS` in `ai-registry.ts`. Every UI across the app automatically picks it up.

---

## Verification Plan

### Automated Tests
- `yarn build` — confirm zero TypeScript errors after refactor
- Verify dev server runs without runtime errors

### Manual Verification
- AI Settings page renders all 5 providers with correct logos/colors
- AIConfigPanel slide-out shows correct engine buttons + model dropdowns
- Create page modals (SEO, Excerpt, Title, Repurpose) all show engine/model selectors
- Edit page modals match create page behavior
- Switching engines auto-selects correct default model
- Saving AI config persists correctly
