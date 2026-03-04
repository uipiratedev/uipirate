# Package & Dependency Optimization Guide

## Executive Summary

This document provides a comprehensive analysis of the current dependency structure and recommendations for optimization. The goal is to reduce bundle size, eliminate redundant packages, and improve build performance.

**Current Bundle Size**: ~2.5MB (estimated)  
**Potential Savings**: ~60-80KB gzipped  
**Risk Level**: Low  
**Priority**: Medium

---

## Table of Contents

1. [Current Dependency Analysis](#current-dependency-analysis)
2. [Packages to Remove](#packages-to-remove)
3. [Packages to Consolidate](#packages-to-consolidate)
4. [Packages to Keep](#packages-to-keep)
5. [Implementation Plan](#implementation-plan)
6. [Bundle Size Impact](#bundle-size-impact)

---

## Current Dependency Analysis

### Production Dependencies (48 packages)

#### Animation Libraries (4 packages - **OPTIMIZATION TARGET**)
```json
{
  "framer-motion": "^11.5.6",        // ✅ KEEP - Primary animation library
  "gsap": "^3.12.5",                 // ❌ REMOVE - Migrating to Framer Motion (~50KB gzipped)
  "lenis": "^1.3.17",                // ✅ KEEP - Smooth scroll
  "locomotive-scroll": "^5.0.0-beta.21"  // ⚠️ REVIEW - Depends on older Lenis version
}
```

**Issue**: `locomotive-scroll` depends on `lenis@1.1.9` while we have `lenis@^1.3.17` directly installed. This creates version conflicts and potential duplication.

#### UI Component Libraries (8 packages)
```json
{
  "@heroui/button": "2.2.27",       // ✅ KEEP
  "@heroui/input": "2.4.28",        // ✅ KEEP
  "@heroui/navbar": "2.2.25",       // ✅ KEEP
  "@heroui/react": "2.8.5",         // ✅ KEEP
  "@heroui/switch": "2.2.24",       // ✅ KEEP
  "@heroui/system": "2.4.23",       // ✅ KEEP
  "@heroui/theme": "2.4.23",        // ✅ KEEP
  "@react-aria/ssr": "^3.9.6",      // ✅ KEEP - Required by HeroUI
  "@react-aria/visually-hidden": "^3.8.16"  // ✅ KEEP - Accessibility
}
```

#### Rich Text Editor (11 packages)
```json
{
  "@tiptap/core": "^3.10.1",                    // ✅ KEEP
  "@tiptap/extension-color": "^3.10.1",         // ✅ KEEP
  "@tiptap/extension-highlight": "^3.10.1",     // ✅ KEEP
  "@tiptap/extension-image": "^3.10.1",         // ✅ KEEP
  "@tiptap/extension-list": "^3.13.0",          // ✅ KEEP
  "@tiptap/extension-placeholder": "^3.10.1",   // ✅ KEEP
  "@tiptap/extension-task-item": "^3.10.1",     // ✅ KEEP
  "@tiptap/extension-task-list": "^3.10.1",     // ✅ KEEP
  "@tiptap/extension-text-style": "^3.10.1",    // ✅ KEEP
  "@tiptap/extension-typography": "^3.10.1",    // ✅ KEEP
  "@tiptap/pm": "^3.10.1",                      // ✅ KEEP
  "@tiptap/react": "^3.10.1",                   // ✅ KEEP
  "@tiptap/starter-kit": "^3.10.1"              // ✅ KEEP
}
```

**Note**: All TipTap packages are actively used in the blog CMS. No optimization opportunities here.

#### Database & Authentication (3 packages)
```json
{
  "mongoose": "^8.19.3",            // ✅ KEEP
  "bcryptjs": "^3.0.3",             // ✅ KEEP
  "jsonwebtoken": "^9.0.2"          // ✅ KEEP
}
```

#### Utilities & Core (6 packages)
```json
{
  "next": "14.2.35",                // ✅ KEEP
  "react": "18.3.1",                // ✅ KEEP
  "react-dom": "18.3.1",            // ✅ KEEP
  "next-themes": "^0.2.1",          // ✅ KEEP - Theme switching
  "clsx": "2.1.1",                  // ✅ KEEP - Classname utility
  "prettier": "^3.7.4"              // ⚠️ MOVE TO DEV - Should be devDependency
}
```

#### Analytics (1 package)
```json
{
  "@vercel/speed-insights": "^1.1.0"  // ✅ KEEP
}
```

### Development Dependencies (19 packages)

All dev dependencies are necessary for the build process, linting, and type checking. No optimization opportunities identified.

---

## Packages to Remove

### 1. GSAP (After Migration Complete)

**Package**: `gsap@^3.12.5`  
**Size**: ~50KB gzipped  
**Reason**: Migrating all animations to Framer Motion  
**Risk**: Low (after migration complete)  
**Action**: 
```bash
yarn remove gsap
```

**Files to Update After Removal**:
- `next.config.js` - Remove "gsap" from `optimizePackageImports`
- All component files using GSAP (see GSAP_TO_FRAMER_MOTION_MIGRATION.md)

---

## Packages to Consolidate

### 1. Locomotive Scroll vs Direct Lenis Usage

**Current State**:
- `locomotive-scroll@5.0.0-beta.21` depends on `lenis@1.1.9`
- Direct dependency: `lenis@^1.3.17`
- This creates version conflicts

**Analysis**:
- `locomotive-scroll` is only used in `app/page.tsx` for initialization
- `lenis` is used directly in `components/ScrollStack.tsx`
- Locomotive Scroll is a wrapper around Lenis with additional features

**Recommendation**: **KEEP BOTH** (for now)

**Reasoning**:
1. Locomotive Scroll provides additional features beyond Lenis
2. The version conflict is minor (1.1.9 vs 1.3.17)
3. Removing Locomotive Scroll would require refactoring scroll initialization
4. Bundle size impact is minimal (~5KB)

**Future Consideration**: 
- Monitor if Locomotive Scroll updates to use Lenis 1.3.x
- Consider migrating to direct Lenis usage if Locomotive Scroll becomes unmaintained

---

## Packages to Keep

### All Other Dependencies

All remaining dependencies are actively used and necessary:

1. **HeroUI (@heroui/*)** - Component library used throughout the app
2. **TipTap (@tiptap/*)** - Rich text editor for blog CMS
3. **Framer Motion** - Primary animation library
4. **Mongoose** - Database ORM
5. **Authentication** - bcryptjs, jsonwebtoken
6. **Next.js ecosystem** - next, react, react-dom
7. **Utilities** - clsx, next-themes

---

## Implementation Plan

### Phase 1: Move Prettier to DevDependencies (Immediate)

**Current**:
```json
{
  "dependencies": {
    "prettier": "^3.7.4"
  }
}
```

**Target**:
```json
{
  "devDependencies": {
    "prettier": "^3.7.4"
  }
}
```

**Action**:
```bash
yarn remove prettier
yarn add -D prettier
```

**Impact**: Reduces production bundle size slightly

### Phase 2: Remove GSAP (After Migration Complete)

**Prerequisites**:
- ✅ Complete GSAP to Framer Motion migration
- ✅ All tests passing
- ✅ Visual regression testing complete

**Action**:
```bash
yarn remove gsap
```

**Files to Update**:

1. **next.config.js**:
```javascript
// Before
experimental: {
  optimizePackageImports: ["@heroui/react", "framer-motion", "gsap"],
}

// After
experimental: {
  optimizePackageImports: ["@heroui/react", "framer-motion"],
}
```

2. **Verify no imports remain**:
```bash
# Search for any remaining GSAP imports
grep -r "from 'gsap'" .
grep -r "from \"gsap\"" .
grep -r "import gsap" .
```

**Impact**: ~50KB gzipped reduction

### Phase 3: Audit Unused Exports (Optional)

Use bundle analyzer to identify unused code:

```bash
# Install bundle analyzer
yarn add -D @next/bundle-analyzer

# Run analysis
ANALYZE=true yarn build
```

**Review**:
- Check for unused TipTap extensions
- Verify all HeroUI components are used
- Identify any dead code

---

## Bundle Size Impact

### Current State (Estimated)

| Category | Size (gzipped) |
|----------|----------------|
| Next.js Core | ~90KB |
| React | ~45KB |
| Framer Motion | ~35KB |
| GSAP | ~50KB |
| HeroUI Components | ~80KB |
| TipTap Editor | ~120KB |
| Mongoose | ~60KB |
| Other Dependencies | ~40KB |
| **Total** | **~520KB** |

### After Optimization (Estimated)

| Category | Size (gzipped) |
|----------|----------------|
| Next.js Core | ~90KB |
| React | ~45KB |
| Framer Motion | ~35KB |
| ~~GSAP~~ | ~~0KB~~ ✅ |
| HeroUI Components | ~80KB |
| TipTap Editor | ~120KB |
| Mongoose | ~60KB |
| Other Dependencies | ~40KB |
| **Total** | **~470KB** |

**Savings**: ~50KB gzipped (~10% reduction)

---

## Dependency Update Strategy

### Regular Maintenance

**Monthly**:
1. Check for security vulnerabilities:
   ```bash
   yarn audit
   ```

2. Update patch versions:
   ```bash
   yarn upgrade --pattern "@heroui/*"
   yarn upgrade --pattern "@tiptap/*"
   ```

**Quarterly**:
1. Review major version updates
2. Test in staging environment
3. Update documentation

### Version Pinning Strategy

**Current Approach**: Using caret (^) for most dependencies

**Recommendation**:
- Keep caret (^) for minor updates
- Pin major versions for stability
- Use exact versions for critical dependencies (Next.js, React)

**Example**:
```json
{
  "dependencies": {
    "next": "14.2.35",              // Exact version
    "react": "18.3.1",              // Exact version
    "framer-motion": "^11.5.6",     // Allow minor updates
    "@heroui/react": "^2.8.5"       // Allow minor updates
  }
}
```

---

## Performance Optimization Tips

### 1. Code Splitting

Ensure dynamic imports are used for heavy components:

```typescript
// Good - Dynamic import
const TipTapEditor = dynamic(() => import('@/components/TipTapEditor'), {
  ssr: false,
  loading: () => <div>Loading editor...</div>
});

// Bad - Static import
import TipTapEditor from '@/components/TipTapEditor';
```

### 2. Tree Shaking

Verify tree shaking is working:

```typescript
// Good - Named imports
import { Button } from '@heroui/button';

// Bad - Default import of entire library
import * as HeroUI from '@heroui/react';
```

### 3. Package Import Optimization

Already configured in `next.config.js`:

```javascript
modularizeImports: {
  "@heroui/react": {
    transform: "@heroui/react/dist/{{member}}",
  },
},

experimental: {
  optimizePackageImports: ["@heroui/react", "framer-motion"],
}
```

---

## Monitoring & Metrics

### Bundle Size Tracking

**Tools**:
1. **Next.js Bundle Analyzer**:
   ```bash
   ANALYZE=true yarn build
   ```

2. **Bundlephobia**: Check package sizes before installing
   - https://bundlephobia.com/

3. **Lighthouse**: Monitor performance scores
   ```bash
   lighthouse https://uipirate.com --view
   ```

### Key Metrics to Track

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Total Bundle Size | ~520KB | <470KB | 🟡 In Progress |
| First Contentful Paint | <1.5s | <1.2s | ✅ Good |
| Time to Interactive | <3.5s | <3.0s | ✅ Good |
| Lighthouse Performance | 85+ | 90+ | 🟡 Improve |

---

## Conclusion

### Summary of Recommendations

1. ✅ **Immediate**: Move `prettier` to devDependencies
2. ⏳ **After Migration**: Remove `gsap` package
3. ✅ **Keep**: All other dependencies are necessary
4. 📊 **Monitor**: Use bundle analyzer regularly
5. 🔄 **Maintain**: Regular security and version updates

### Expected Benefits

- **Bundle Size**: ~50KB reduction (10% smaller)
- **Build Time**: Slightly faster without GSAP
- **Maintainability**: Fewer dependencies to manage
- **Security**: Reduced attack surface

### Next Steps

1. Review this document with the team
2. Get approval for changes
3. Implement Phase 1 (move prettier)
4. Complete GSAP migration
5. Implement Phase 2 (remove GSAP)
6. Monitor bundle size and performance

---

## Appendix: Dependency Audit Checklist

Use this checklist for future dependency audits:

- [ ] Check for duplicate dependencies (different versions)
- [ ] Verify all dependencies are actively used
- [ ] Review devDependencies vs dependencies
- [ ] Check for security vulnerabilities (`yarn audit`)
- [ ] Review package sizes (bundlephobia.com)
- [ ] Verify tree shaking is working
- [ ] Check for outdated packages (`yarn outdated`)
- [ ] Review license compatibility
- [ ] Test bundle size impact
- [ ] Update documentation


