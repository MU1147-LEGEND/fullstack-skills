---
name: use-backend
description: >
  Master entry point and router for all backend and API engineering work across
  any framework (Express, FastAPI, Django, Next.js, Fastify, NestJS, Spring, Go).
  Trigger automatically whenever the user asks to build, modify, architect, secure,
  optimize, debug, or review backend servers, routes, APIs, services, databases, or
  background workers. Router only; detects framework first, selects specialist skills,
  and mandates backend-qa before completion.
---

# Backend Skill Router

You are routing a backend or API task to the appropriate specialist skill(s).
Never skip straight to writing code or making architectural changes without completing this routing procedure.

---

## Step 1 — Detect Framework & State It Explicitly

Before routing or touching code, inspect the codebase to identify the active framework and runtime environment.

### Detection Checklist
Check files in order:
1. **Node.js / TypeScript**: Inspect `package.json` dependencies:
   - `express` &rarr; Express
   - `fastify` &rarr; Fastify
   - `@nestjs/core` &rarr; NestJS
   - `next` (with `app/api/**/route.ts` or `pages/api/**`) &rarr; Next.js API / Route Handlers
   - `hono` &rarr; Hono
2. **Python**: Inspect `requirements.txt`, `pyproject.toml`, `Pipfile`, or imports:
   - `fastapi` &rarr; FastAPI
   - `django` &rarr; Django / Django REST Framework
   - `flask` &rarr; Flask
3. **Go**: Inspect `go.mod`:
   - `github.com/gin-gonic/gin` &rarr; Gin
   - `github.com/gofiber/fiber` &rarr; Fiber
   - `github.com/go-chi/chi` &rarr; Chi
   - `net/http` &rarr; Standard Library
4. **Java / Kotlin**: Inspect `pom.xml` or `build.gradle`:
   - `org.springframework.boot` &rarr; Spring Boot

> **Mandatory Output Declaration:**  
> Always explicitly state the detected framework and runtime to the user before proceeding:  
> *"Detected Framework: [Framework Name, e.g. FastAPI / Express / Django / Next.js]. Applying framework-native idioms."*

---

## Step 2 — Framework-Native Idioms Rule (Strict)

Every specialist skill loaded by this router **must apply its rules using the detected framework's own idioms, constructs, and libraries** — never generic pseudocode, artificial wrappers, or patterns foreign to that ecosystem.

- If **Express**: Use middleware, `express.Router()`, error middleware `(err, req, res, next)`, and npm libraries like `zod`/`joi`, `helmet`.
- If **FastAPI**: Use `APIRouter`, Pydantic models for validation, `Depends()` for dependency injection, and Starlette exception handlers.
- If **Django**: Use apps, views/viewsets, DRF serializers, Django ORM, and Django settings.
- If **Next.js**: Use App Router `app/api/**/route.ts` handlers (`GET`, `POST`), `NextRequest`/`NextResponse`, Server Actions, and Zod.

---

## Step 3 — Route Request to Specialist Skill(s)

Load the specialist skills matching the signals in the user request. A single backend task frequently requires multiple skills — load all that apply.

| Request Signal / Task Type | Skills to Load |
|---|---|
| **Any new backend service, route, endpoint, or refactor** | `backend-architecture` (Always load first) |
| REST endpoints, HTTP status codes, request/response models, pagination, JSON envelopes, validation | `api-design` |
| Auth (JWT/OAuth/Session), permissions (RBAC/ABAC), injection prevention, CORS, headers, secrets | `security` |
| Database models, schemas, migrations, ORM queries, N+1 query fixes, transactions, connection pooling | `data-persistence` |
| Caching (Redis), async workers, background jobs (BullMQ/Celery), batching, latency bottlenecks | `performance-scalability` |
| Rate limiting, DDoS/abuse protection, retries with backoff, circuit breakers, external API timeouts | `rate-limiting-resilience` |
| Structured JSON logging, correlation IDs, health checks (`/health/live`, `/health/ready`), metrics | `observability` |
| **All tasks before declaring completion** | `backend-qa` (Mandatory final step) |

---

## Step 4 — Sequence of Execution

For any substantive backend feature or change:

1. **`backend-architecture`**: Establish layering (Controller &rarr; Service &rarr; Repository) and folder structure.
2. **Specialist Implementation Skills**: Apply `api-design`, `security`, `data-persistence`, `performance-scalability`, `rate-limiting-resilience`, or `observability` as needed.
3. **`backend-qa` (Mandatory Close)**: Run the pre-ship verification checklist and execute automated tests using the detected framework's test runner before declaring the task complete.
