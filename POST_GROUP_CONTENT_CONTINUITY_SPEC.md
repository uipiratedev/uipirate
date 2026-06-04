# Post Group — Content Continuity Architecture

## 💡 Concept: Content Campaigns & Series

Instead of individual posts with parent/child links, organize content into **Post Groups** (campaigns, series, content families).

---

## 🎯 Use Cases

### Use Case 1: Content Campaign
**Scenario:** User launches a product

**Post Group:** "SaaS Launch Campaign Q2 2026"
- 📝 Blog: "How Our New Feature Solves X Problem"
- 📱 LinkedIn: Key benefits breakdown
- 🐦 Twitter Thread: Launch announcement
- 📧 Newsletter: Early access for subscribers
- 📊 Case Study: Beta customer success story

**Benefit:** All related content in one place, progress tracking, reuse brand context

---

### Use Case 2: Content Series
**Scenario:** User writes tutorial series

**Post Group:** "React Hooks Mastery Series"
- Part 1: useState Deep Dive
- Part 2: useEffect Explained
- Part 3: Custom Hooks Patterns
- Part 4: Performance Optimization

**Benefit:** Sequential ordering, "Next in series" suggestions, audience journey mapping

---

### Use Case 3: Multi-Platform Syndication
**Scenario:** User wants same content on multiple platforms

**Post Group:** "Blog Post #42 Distribution"
- 🌐 WordPress: Full blog post
- 📱 LinkedIn: Summary + insights
- 🐦 Twitter: Thread version
- 📧 Newsletter: Excerpt with CTA
- 👥 Medium: Cross-post

**Benefit:** Track reach across platforms, avoid duplicate work

---

## 📊 Database Schema

### New Model: PostGroup

```typescript
// models/pirateCOS/PostGroup.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPostGroup extends Document {
  tenantId: mongoose.Types.ObjectId;
  name: string; // "SaaS Launch Campaign Q2 2026"
  description?: string;
  groupType: "campaign" | "series" | "syndication" | "custom";
  
  // Posts in this group
  posts: Array<{
    postId: mongoose.Types.ObjectId;
    role: "primary" | "derivative" | "supporting"; // primary = main blog, derivative = LinkedIn/Twitter
    order?: number; // For series: 1, 2, 3...
    platform?: string; // "wordpress" | "linkedin" | "twitter" | "medium"
    status: "draft" | "published" | "scheduled";
    publishedAt?: Date;
  }>;
  
  // Group-level metadata
  tags?: string[];
  coverImage?: string;
  
  // Shared context (inherited by all posts in group)
  sharedContext?: {
    contentGoal?: string; // "conversion" | "traffic" | etc.
    targetAudience?: string; // Override BrandBrain for this campaign
    keywords?: string[];
    campaignStartDate?: Date;
    campaignEndDate?: Date;
  };
  
  // Analytics aggregation
  analytics?: {
    totalViews: number;
    totalClicks: number;
    totalShares: number;
    engagementRate: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const PostGroupSchema: Schema<IPostGroup> = new Schema(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    groupType: {
      type: String,
      enum: ["campaign", "series", "syndication", "custom"],
      default: "custom",
    },
    posts: [
      {
        postId: {
          type: Schema.Types.ObjectId,
          ref: "Post",
          required: true,
        },
        role: {
          type: String,
          enum: ["primary", "derivative", "supporting"],
          default: "derivative",
        },
        order: Number,
        platform: String,
        status: {
          type: String,
          enum: ["draft", "published", "scheduled"],
          default: "draft",
        },
        publishedAt: Date,
      },
    ],
    tags: [String],
    coverImage: String,
    sharedContext: {
      contentGoal: String,
      targetAudience: String,
      keywords: [String],
      campaignStartDate: Date,
      campaignEndDate: Date,
    },
    analytics: {
      totalViews: { type: Number, default: 0 },
      totalClicks: { type: Number, default: 0 },
      totalShares: { type: Number, default: 0 },
      engagementRate: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const PostGroup: Model<IPostGroup> =
  (mongoose.models.PostGroup as Model<IPostGroup>) ||
  mongoose.model<IPostGroup>("PostGroup", PostGroupSchema);

export default PostGroup;
```

---

## 🔄 Integration with Existing Models

### Update Post Schema (Optional Back-reference)

```typescript
// models/Post.ts
interface IPost extends Document {
  // ... existing fields ...
  
  // NEW: Post Group membership
  postGroupId?: mongoose.Types.ObjectId; // References PostGroup
  roleInGroup?: "primary" | "derivative" | "supporting";
}
```

**Benefit:** Two-way lookup (Group → Posts, Post → Group)

---

## 🎨 UI Components

### 1. Post Group List Page
`/pirateCOS/(authed)/groups/page.tsx`

```
┌─────────────────────────────────────────────┐
│  Content Groups                             │
│  ┌─────────────────────────┐  [+ New Group]│
│  │ 📦 SaaS Launch Q2 2026   │              │
│  │ Campaign • 5 posts       │              │
│  │ ✅ 3 published  📝 2 draft │              │
│  └─────────────────────────┘              │
│  ┌─────────────────────────┐              │
│  │ 📚 React Hooks Series    │              │
│  │ Series • 4 posts         │              │
│  │ Part 3 of 4 published    │              │
│  └─────────────────────────┘              │
└─────────────────────────────────────────────┘
```

### 2. Post Group Detail Page
`/pirateCOS/(authed)/groups/[id]/page.tsx`

```
┌───────────────────────────────────────────────────┐
│  📦 SaaS Launch Campaign Q2 2026                  │
│  Campaign • 5 posts • 3 published                 │
│  [Edit Group] [Add Post] [Generate Derivatives]   │
├───────────────────────────────────────────────────┤
│  PRIMARY POST                                     │
│  ┌────────────────────────────────────────────┐  │
│  │ 🌐 Blog: "How Our New Feature Solves..."   │  │
│  │ Published Mar 15 • 1,234 views             │  │
│  │ [Edit] [View Analytics]                    │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
│  DERIVATIVES                                      │
│  ┌────────────────────────────────────────────┐  │
│  │ 📱 LinkedIn: Key benefits breakdown        │  │
│  │ Published Mar 16 • 456 views               │  │
│  └────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────┐  │
│  │ 🐦 Twitter Thread: Launch announcement     │  │
│  │ Draft                                      │  │
│  │ [Generate from primary] [Edit]             │  │
│  └────────────────────────────────────────────┘  │
│                                                   │
│  ANALYTICS (Aggregated)                          │
│  📊 Total Views: 1,690  Clicks: 89  Shares: 23   │
└───────────────────────────────────────────────────┘
```

### 3. "Add to Group" Action in Post Editor

After saving a post, show:
```
✨ Post saved!

Add to a group?
┌─────────────────────────┐
│ 📦 SaaS Launch Q2 2026  │ [Add as derivative]
│ 📚 React Hooks Series   │ [Add as next in series]
│ + Create new group      │
└─────────────────────────┘
```

---

## 🚀 Workflow Integration

### "Generate Derivatives" Button

When user clicks **[Generate Derivatives]** in a Post Group:

**API:** `POST /api/pirateCOS/groups/[id]/generate-derivatives`

**Body:**
```json
{
  "primaryPostId": "...",
  "formats": ["linkedin-post", "twitter-thread", "newsletter"]
}
```

**Result:**
- Creates 3 new draft posts
- Links them to the group as `role: "derivative"`
- Pre-fills with repurposed content from primary post
- User can edit before publishing

---

## 📈 Benefits vs. Simple Parent/Child Links

| Feature | Parent/Child Links | Post Groups |
|---------|-------------------|-------------|
| **Group multiple posts** | ❌ Only 1:N | ✅ M:N relationships |
| **Series ordering** | ❌ No sequence | ✅ Explicit order field |
| **Campaign metadata** | ❌ Per-post only | ✅ Shared group context |
| **Aggregated analytics** | ❌ Manual sum | ✅ Auto-calculated |
| **Multi-platform tracking** | ❌ Scattered | ✅ Centralized |
| **Workflow automation** | ❌ Manual links | ✅ "Generate derivatives" button |

---

## 🎯 Implementation Priority

### Phase 1 (Week 1-2): Foundation
1. Create `PostGroup` model
2. Add `postGroupId` to `Post` model
3. Create `POST /api/pirateCOS/groups` (CRUD)
4. Build Post Group List UI

### Phase 2 (Week 2-3): Workflow Integration
5. "Add to Group" action in post editor
6. "Generate Derivatives" API + UI
7. Post Group Detail page

### Phase 3 (Week 3-4): Intelligence
8. Auto-suggest group on save (if post matches existing campaign keywords)
9. Analytics aggregation
10. "Complete this group" suggestions (e.g., "You have blog + LinkedIn, missing Twitter")

---

**This is MORE powerful than simple parent/child links because:**
- ✅ User can organize content into **campaigns** (product launch, content series, etc.)
- ✅ Platform can suggest **"complete the campaign"** (you have blog + LinkedIn, need Twitter)
- ✅ Analytics are **aggregated** (campaign performance across all platforms)
- ✅ **One-click derivative generation** for entire campaign

**Want me to start building the PostGroup model + CRUD API?**
