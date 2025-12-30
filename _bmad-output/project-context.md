---
project_name: 'ideaFlow'
user_name: 'Offer'
date: '2025-12-30'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality', 'workflow_rules', 'critical_rules']
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| TailwindCSS | 3.x | Styling |
| Jotai | latest | State Management (Atomic) |
| Vite | latest | Build Tool |
| React Router | 6.x | Routing (Hash Mode) |
| Konva.js | latest | Canvas Rendering |
| React Query | latest | Server State |
| Axios | latest | HTTP Client |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| NestJS | 10.x | Backend Framework |
| TypeScript | 5.x | Type Safety |
| Prisma | latest | ORM |
| PostgreSQL | latest | Database |
| bcrypt | latest | Password Hashing |
| JWT | - | Authentication |

### Testing
| Technology | Purpose |
|------------|---------|
| Vitest | Frontend Unit Tests |
| Testing Library | React Component Tests |
| Jest | NestJS Unit Tests |
| Playwright | E2E Tests |

---

## Critical Implementation Rules

### Language-Specific Rules (TypeScript)

**Configuration:**
- ✅ Strict mode enabled (`strict: true`)
- ✅ No implicit any (`noImplicitAny: true`)
- ✅ Strict null checks (`strictNullChecks: true`)

**Import/Export:**
- ✅ Use ES modules (`import/export`)
- ✅ Use path aliases (`@/features/...`, `@/components/...`)
- ❌ Never use `require()` syntax

**Type Usage:**
- ✅ Prefer `interface` for object shapes, `type` for unions/intersections
- ✅ Use `unknown` instead of `any` when type is not known
- ✅ Export types from `packages/shared/src/types/`

**Error Handling:**
- ✅ Use typed errors: `throw new HttpException('message', statusCode)`
- ✅ Always catch and handle promise rejections
- ❌ Never swallow errors silently

---

### Framework-Specific Rules

#### React (Frontend)

**Component Structure:**
```typescript
// ✅ Correct: Function component with typed props
interface IdeaCardProps {
  idea: Idea;
  onEdit?: (id: string) => void;
}

export function IdeaCard({ idea, onEdit }: IdeaCardProps) {
  // ...
}
```

**Hooks Usage:**
- ✅ Custom hooks in `hooks/` directory, prefix with `use`
- ✅ Use `useMemo` for expensive computations
- ✅ Use `useCallback` for callbacks passed to children
- ❌ Never call hooks conditionally

**State Management (Jotai):**
```typescript
// ✅ Correct: Atomic state in stores/
export const ideasAtom = atom<Idea[]>([]);
export const loadingAtom = atom(false);

// ✅ Correct: Derived atom
export const filteredIdeasAtom = atom((get) => {
  const ideas = get(ideasAtom);
  return ideas.filter(/* ... */);
});
```

#### NestJS (Backend)

**Module Structure:**
```
modules/
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.guard.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
```

**Controller Pattern:**
```typescript
@Controller('ideaFlow/api/v1/ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<PaginatedResponse<Idea>> {
    // ...
  }
}
```

**DTO Validation:**
- ✅ Always use `class-validator` decorators
- ✅ Define DTOs in `dto/` subdirectory
- ✅ Use `@IsOptional()` for optional fields

---

### Testing Rules

**TDD Flow (RED-GREEN-REFACTOR):**
1. Write failing test first (RED)
2. Write minimal code to pass (GREEN)
3. Refactor for quality (REFACTOR)

**Test File Location (Co-located):**
- `user.service.ts` → `user.service.spec.ts`
- `idea-card.tsx` → `idea-card.test.tsx`

**Test Coverage Requirements:**
- ✅ Core business logic: 100%
- ✅ API endpoints: 100%
- ✅ UI components: Critical paths

**Test Structure:**
```typescript
describe('IdeasService', () => {
  describe('create', () => {
    it('should create idea with valid data', async () => {
      // Arrange
      const dto = { title: 'Test Idea' };
      
      // Act
      const result = await service.create(dto);
      
      // Assert
      expect(result.title).toBe('Test Idea');
    });

    it('should throw on invalid data', async () => {
      // ...
    });
  });
});
```

---

### Code Quality & Style Rules

**Naming Conventions:**

| Element | Convention | Example |
|---------|------------|---------|
| Components/Classes | PascalCase | `IdeaCard`, `UserService` |
| Files | kebab-case | `idea-card.tsx`, `user.service.ts` |
| Functions/Variables | camelCase | `getUserById`, `isLoading` |
| Constants | UPPER_SNAKE_CASE | `MAX_PAGE_SIZE` |
| Database Tables | snake_case (plural) | `users`, `canvas_nodes` |
| API Routes | Plural nouns | `/ideaFlow/api/v1/ideas` |

**File Organization:**
```
features/ideas/
├── components/        # UI components for this feature
├── hooks/             # Feature-specific hooks
├── services/          # API calls for this feature
├── stores/            # Jotai atoms for this feature
└── index.ts           # Public exports
```

**ESLint/Prettier:**
- ✅ Run `pnpm lint` before commit
- ✅ Run `pnpm format` before commit
- ❌ Never disable eslint rules without comment

---

### Development Workflow Rules

**Git Branch Naming:**
- Feature: `feature/add-idea-creation`
- Fix: `fix/canvas-zoom-bug`
- Refactor: `refactor/user-service`

**Commit Message Format:**
```
<type>(<scope>): <description>

Types: feat, fix, refactor, test, docs, chore
Examples:
- feat(ideas): add quick capture functionality
- fix(canvas): resolve zoom performance issue
- test(auth): add JWT refresh token tests
```

**PR Requirements:**
- ✅ All tests pass
- ✅ No lint errors
- ✅ Description explains what and why
- ✅ Screenshots for UI changes

---

### Critical Don't-Miss Rules

**API Response Format (MUST FOLLOW):**
```typescript
// ✅ Success Response
{
  "data": { ... },
  "meta": { "total": 100, "page": 1, "pageSize": 20, "totalPages": 5 }
}

// ✅ Error Response
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "Invalid email format" }],
  "timestamp": "2025-12-30T12:00:00.000Z"
}
```

**API Prefix (MUST USE):**
- All API routes MUST start with `/ideaFlow/api/v1/`
- Example: `/ideaFlow/api/v1/auth/login`

**Anti-Patterns to AVOID:**

| ❌ Don't | ✅ Do Instead |
|----------|--------------|
| Use `any` type | Use `unknown` or proper type |
| Mutate state directly | Use immutable updates |
| Skip input validation | Always validate with DTOs |
| Console.log in production | Use proper logging |
| Hardcode API URLs | Use environment variables |
| Skip error handling | Always handle errors gracefully |

**Security Rules:**
- ✅ Hash passwords with bcrypt (cost=10)
- ✅ Use JWT with 15min access + 7day refresh
- ✅ Store refresh token in HttpOnly cookie
- ✅ Validate all user input with class-validator
- ❌ Never log sensitive data (passwords, tokens)

**Performance Rules:**
- ✅ Canvas operations must maintain 60fps
- ✅ API response < 300ms
- ✅ Limit canvas to ≤100 nodes
- ✅ Use React.memo for expensive components
- ✅ Debounce auto-save (300ms)

---

## Quick Reference

**Start Development:**
```bash
pnpm install
pnpm dev
```

**Run Tests:**
```bash
pnpm test          # All tests
pnpm test:web      # Frontend only
pnpm test:api      # Backend only
pnpm test:e2e      # E2E tests
```

**Build:**
```bash
pnpm build
```

**Deploy:**
```bash
docker-compose up -d
```
