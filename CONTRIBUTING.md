# Contributing to UI Pirate

Thank you for your interest in contributing to UI Pirate! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors. We expect everyone to:

- Be respectful and considerate
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Node.js** (v18.x or higher)
2. **Yarn** package manager
3. **Git** for version control
4. **MongoDB** (local or Atlas account)
5. A code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/uipirate.git
   cd uipirate
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/uipirate.git
   ```

4. **Install dependencies**:
   ```bash
   yarn install
   ```

5. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

6. **Create admin user**:
   ```bash
   yarn create-admin
   ```

---

## Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

**Branch Naming Convention**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `style/` - Code style changes
- `test/` - Adding tests
- `chore/` - Maintenance tasks

### 2. Make Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Test your changes thoroughly
- Update documentation as needed

### 3. Commit Changes

```bash
git add .
git commit -m "type: brief description"
```

See [Commit Guidelines](#commit-guidelines) for commit message format.

### 4. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to your fork on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template
5. Submit for review

---

## Coding Standards

### TypeScript

✅ **Do**:
```typescript
// Use explicit types
interface User {
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// Use const for immutable values
const MAX_RETRIES = 3;

// Use descriptive variable names
const isUserAuthenticated = checkAuth();
```

❌ **Don't**:
```typescript
// Avoid 'any' type
function process(data: any) { }

// Avoid unclear variable names
const x = true;

// Avoid var
var count = 0;
```

### React Components

✅ **Do**:
```typescript
// Use functional components
export default function MyComponent({ title }: { title: string }) {
  return <h1>{title}</h1>;
}

// Use Server Components by default
export default function ServerComponent() {
  // No 'use client' directive
  return <div>Server rendered</div>;
}

// Mark client components explicitly
'use client';
export default function ClientComponent() {
  const [state, setState] = useState(0);
  return <button onClick={() => setState(state + 1)}>{state}</button>;
}
```

❌ **Don't**:
```typescript
// Avoid class components (unless necessary)
class MyComponent extends React.Component { }

// Don't use 'use client' unnecessarily
'use client';
export default function UnnecessaryClient() {
  return <div>Static content</div>; // Should be Server Component
}
```

### File Naming

- **Components**: PascalCase - `MyComponent.tsx`
- **Utilities**: camelCase - `formatDate.ts`
- **Pages**: lowercase - `page.tsx`, `layout.tsx`
- **API routes**: lowercase - `route.ts`

### Code Organization

```typescript
// 1. Imports (grouped)
import { useState } from 'react';           // React imports
import { Button } from '@nextui-org/react'; // Third-party
import MyComponent from '@/components/MyComponent'; // Local

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export default function MyComponent({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState(0);
  
  // 5. Functions
  const handleClick = () => {
    setState(state + 1);
  };
  
  // 6. Render
  return (
    <div>
      <h1>{title}</h1>
      <Button onClick={handleClick}>{state}</Button>
    </div>
  );
}
```

### Styling

✅ **Do**:
```tsx
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
</div>

// Use NextUI components
import { Button, Card } from '@nextui-org/react';
<Card>
  <Button color="primary">Click me</Button>
</Card>
```

❌ **Don't**:
```tsx
// Avoid inline styles (unless dynamic)
<div style={{ padding: '16px', backgroundColor: 'white' }}>
  Content
</div>
```

---

## Commit Guidelines

### Commit Message Format

```
type(scope): subject

body (optional)

footer (optional)
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples

```bash
# Feature
git commit -m "feat(blog): add image upload to blog editor"

# Bug fix
git commit -m "fix(auth): resolve JWT token expiration issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactor
git commit -m "refactor(api): simplify blog API error handling"
```

### Best Practices

✅ **Do**:
- Use present tense ("add feature" not "added feature")
- Keep subject line under 50 characters
- Capitalize subject line
- Don't end subject with period
- Use body to explain what and why (not how)

❌ **Don't**:
- Make vague commits ("fix stuff", "update code")
- Commit unrelated changes together
- Commit commented-out code

---

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest main:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run linting**:
   ```bash
   yarn lint
   ```

3. **Test your changes**:
   ```bash
   yarn build
   yarn start
   ```

4. **Update documentation** if needed

### PR Title Format

Use the same format as commit messages:
```
type(scope): brief description
```

Examples:
- `feat(admin): add bulk delete for blog posts`
- `fix(navbar): resolve mobile menu overflow issue`
- `docs(api): add authentication endpoint examples`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
How did you test these changes?

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tested locally
```

### Review Process

1. **Automated checks** must pass (linting, build)
2. **Code review** by maintainers
3. **Address feedback** if requested
4. **Approval** from at least one maintainer
5. **Merge** by maintainer

---

## Testing

### Manual Testing

Before submitting a PR, test:

1. **Build succeeds**:
   ```bash
   yarn build
   ```

2. **Development server runs**:
   ```bash
   yarn dev
   ```

3. **Features work as expected**:
   - Test all affected pages
   - Test on different screen sizes
   - Test in different browsers (Chrome, Firefox, Safari)

4. **No console errors**:
   - Check browser console
   - Check terminal output

### Testing Checklist

- [ ] Feature works as intended
- [ ] No breaking changes to existing features
- [ ] Responsive on mobile, tablet, desktop
- [ ] Works in Chrome, Firefox, Safari
- [ ] No console errors or warnings
- [ ] Performance is acceptable

---

## Documentation

### When to Update Documentation

Update documentation when you:

- Add a new feature
- Change existing functionality
- Add or modify API endpoints
- Change configuration
- Add new dependencies

### Documentation Files

- **README.md** - Project overview and quick start
- **DEVELOPER_GUIDE.md** - Detailed technical documentation
- **API_DOCUMENTATION.md** - API reference
- **CONTRIBUTING.md** - This file
- **Code comments** - For complex logic

### Documentation Style

✅ **Do**:
- Write clear, concise explanations
- Include code examples
- Use proper markdown formatting
- Keep documentation up-to-date

❌ **Don't**:
- Assume prior knowledge
- Use jargon without explanation
- Leave outdated documentation

---

## Questions or Issues?

- **Bug reports**: Open an issue with detailed description
- **Feature requests**: Open an issue with use case
- **Questions**: Check existing issues or open a new one
- **Security issues**: Email security@uipirate.com (do not open public issue)

---

## Recognition

Contributors will be recognized in:
- GitHub contributors list
- Project documentation (if significant contribution)

---

Thank you for contributing to UI Pirate! 🎉
