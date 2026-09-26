---
name: backend-architecture
description: >
  Use when structuring backend applications, organizing architectural layers
  (routes/controllers, services, repositories), setting up dependency injection,
  managing typed environment configurations, designing folder structures, or
  refactoring monolithic or tangled backend codebases across any framework.
---

# Backend Architecture

Every production backend requires clear separation of concerns, predictable data flow, and maintainability under scale. Architectural rules must always be implemented using the **native idioms and constructs of the detected framework**, not bolted-on generic abstractions.

---

## 1. First Step: Detect the Framework

Inspect project configuration (`package.json`, `pyproject.toml`, `requirements.txt`, etc.) and adapt your architectural structure accordingly:

| Layer / Concern | Express | FastAPI | Django / DRF | Next.js (App Router) | NestJS |
|---|---|---|---|---|---|
| **Entry & Routing** | `express.Router()` / controllers | `APIRouter` | `urls.py` + ViewSets/APIViews | `app/api/.../route.ts` | Controllers with `@Controller()` |
| **Request Boundary** | Middleware + Zod/Joi | Pydantic Request Models | Serializers / Form classes | Zod schema parsing | DTOs + `ValidationPipe` |
| **Dependency Injection** | Constructor / Factory args | `Depends(get_service)` | Service classes / Django apps | Module imports / Server actions | `@Injectable()` + DI container |
| **Business Logic** | Service classes / modules | Service classes / functions | Services (`services.py`) | Shared lib services (`lib/services/`) | Service classes (`@Injectable()`) |
| **Data Access / ORM** | Repositories / Prisma / TypeORM | Repositories / SQLAlchemy 2.0 | Models / Custom QuerySets | Repositories / Prisma / Drizzle | TypeORM / Prisma Repositories |
| **Error Handling** | Error middleware `(err,req,res,next)` | `@app.exception_handler` | Custom `exception_handler` | Try/catch helper & error responses | Exception Filters (`@Catch()`) |
| **Configuration** | `dotenv` + Zod / `envalid` | `pydantic-settings` (`BaseSettings`) | `django-environ` / `settings.py` | `env.mjs` / Zod `process.env` | `@nestjs/config` (`ConfigService`) |

---

## 2. Core Architectural Principles

### A. Strict Three-Layer Architecture
Never mix HTTP concerns, business decisions, and database queries in the same function:

1. **Presentation Layer (Route / Controller)**
   - **Responsibility**: Parse HTTP request, validate inputs, verify authentication/authorization context, call service, format HTTP response with correct status code.
   - **Forbidden**: Direct SQL/ORM calls, core business rules, external third-party API calls.
2. **Domain / Service Layer (Service)**
   - **Responsibility**: Orchestrate business logic, enforce domain rules, coordinate multiple repositories, handle transactions, emit events.
   - **Forbidden**: Direct knowledge of HTTP objects (`req`, `res`, `Request`, `Response`, status codes). Services return plain domain models or throw domain errors.
3. **Persistence Layer (Repository / Data Access)**
   - **Responsibility**: Execute database queries, map between DB records and domain entities, encapsulate raw ORM/SQL operations.
   - **Forbidden**: Business rules (e.g. calculation of discounts, user permission checks).

### B. Dependency Injection (DI)
Inject dependencies (database sessions, external API clients, repositories) rather than hardcoding static instantiations.
- **FastAPI**: Use native `Depends()`:
  ```python
  def get_user_service(db: Session = Depends(get_db)) -> UserService:
      return UserService(user_repo=UserRepository(db))
  
  @router.post("/users")
  def create_user(dto: UserCreate, service: UserService = Depends(get_user_service)):
      return service.register(dto)
  ```
- **Express**: Use factory functions or constructor injection:
  ```typescript
  export class UserController {
    constructor(private readonly userService: UserService) {}
    create = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await this.userService.register(req.body);
        res.status(201).json({ success: true, data: user });
      } catch (err) { next(err); }
    };
  }
  ```

### C. Pragmatic DRY & The Rule of Three
- **Do not abstract prematurely.** Duplicate code twice if the contexts may diverge.
- Extract a shared helper, utility, or base class only when the exact same pattern appears **three times** across the codebase.
- Avoid building generic "catch-all" utilities or massive abstract base classes that create tight coupling.

### D. Consistent Error Handling
Every application must have a centralized error handling strategy:
- Define domain error classes (`NotFoundError`, `UnauthorizedError`, `ConflictError`, `ValidationError`).
- Let services throw typed domain errors; do not catch and format HTTP responses inside services.
- Catch domain errors in the framework-native centralized exception handler / middleware and map them to standard HTTP status codes and JSON error envelopes.

### E. Configuration & Environment Management
- Validate all environment variables at application startup using a typed schema (fail-fast if a required variable is missing).
- Never access raw `process.env` or `os.environ` randomly throughout business logic. Always inject a validated configuration object.

### F. Feature-Based Folder Structure
Group files by domain/feature rather than purely by technical role:

```text
src/
├── config/                 # Validated env vars & global configuration
├── shared/                 # Common middleware, utils, base errors
├── modules/ (or features/)
│   ├── users/
│   │   ├── users.router.ts      # HTTP Routes / Handlers
│   │   ├── users.service.ts     # Business logic
│   │   ├── users.repository.ts  # Database operations
│   │   ├── users.schema.ts      # Zod / Pydantic validation schemas
│   │   └── users.test.ts        # Feature tests
│   └── orders/
│       ├── orders.router.ts
│       ├── orders.service.ts
│       └── ...
```

---

## 3. Anti-Patterns to Avoid

- ❌ **Fat Handlers**: Writing 100+ line controller functions containing input validation, business logic, multiple database queries, and response formatting in one block.
- ❌ **Logic Scattered Outside Structure**: Calling the database directly from UI/router files or embedding database mutations inside utility functions.
- ❌ **Ignoring Framework DI / Router**: Building custom reflection-based DI engines or global singletons in frameworks like FastAPI or NestJS that already provide first-class DI mechanisms.
- ❌ **Leaking HTTP into Services**: Passing Express `req`/`res` or FastAPI `Request` objects down into services or repositories.
- ❌ **Unvalidated `process.env` / `os.environ`**: Accessing unverified environment variables deep in runtime code where missing keys cause silent failures or obscure `undefined` crashes.
