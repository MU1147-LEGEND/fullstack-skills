---
name: backend-qa
description: >
  Mandatory final verification skill before any backend task is declared complete.
  Use to audit pre-ship quality checklists across architecture, security, persistence,
  resilience, and to execute automated unit, integration, and contract tests with real
  framework test runners.
---

# Backend QA & Pre-Ship Verification

No backend feature, bugfix, or endpoint refactoring is complete until it passes the pre-ship verification checklist and is confirmed by **real automated test execution**. Never mark a task done based on visual code inspection alone.

---

## 1. Framework Test Tooling Mapping Table

Detect the project's test runner and assertion libraries:

| Framework | Test Runner & Framework | HTTP Client / API Testing | Database Test Fixture Strategy |
|---|---|---|---|
| **Express** | Vitest or Jest | `supertest` | In-memory DB / Ephemeral Postgres / Testcontainers |
| **FastAPI** | `pytest` + `pytest-asyncio` | `httpx.AsyncClient` / `starlette.testclient.TestClient` | SQLite in-memory / `async_session` rollback fixture |
| **Django / DRF** | `django.test.TestCase` / `pytest-django` | `rest_framework.test.APIClient` | Django automatic transaction rollback per test |
| **Next.js (App Router)** | Vitest or Jest | Native `Request`/`NextResponse` calls / Playwright API | SQLite / Prisma test environment |
| **NestJS** | Jest + `@nestjs/testing` | `supertest` | Dedicated test module with in-memory DB |

---

## 2. The Iron Law of Test Execution (Strict)

> **IF A TEST RUNNER IS AVAILABLE IN THE PROJECT, YOU MUST ACTUALLY EXECUTE IT VIA COMMAND AND SHOW REAL OUTPUT PASSING BEFORE REPORTING "TESTS PASS".**  
> Reading code back to yourself and declaring "the logic is correct, tests should pass" is strictly prohibited.

1. **Run tests via terminal**: Execute the actual test suite (e.g. `npm test`, `pytest`, `python manage.py test`).
2. **Inspect stderr & exit code**: Confirm exit code is 0 and 0 tests failed.
3. **If no test runner is configured**: You must explicitly state to the user:  
   *"No test runner (pytest/jest/vitest) is configured in this repository. Tests were not executed. Here is how to configure automated testing: [...]"*

---

## 3. Testing Pyramid & Minimum Coverage

Every backend feature must implement tests across these tiers:

### A. Unit Tests (Domain & Service Logic)
- Test business rules, calculations, and domain exceptions in isolation.
- Mock external network calls and third-party APIs.
- Fast, synchronous execution.

### B. Integration Tests (API Route &rarr; DB)
- Test the full HTTP request path through real routing, middleware, controllers, services, and the database layer.
- Verify real SQL schema, foreign key constraints, and unique constraints.
- Reset or roll back database transactions between test cases to ensure isolation.

### C. Failure-Path Testing Requirement
- **Never test only the happy path.**
- Every endpoint must have automated tests verifying failure modes:
  - `400` / `422`: Invalid input schema, missing required fields.
  - `401`: Missing or expired authentication token.
  - `403`: Valid token but insufficient permissions or attempting to access another user's resource (IDOR test).
  - `404`: Non-existent resource ID.

---

## 4. Pre-Ship Verification Checklist

Before reporting completion to the user, run through this comprehensive audit:

### [ ] Architecture & Layering
- [ ] Route handler is thin (no direct SQL, no core business logic).
- [ ] Business logic resides in the service layer.
- [ ] Framework's native DI/router system is used.
- [ ] Environment variables are validated on startup.

### [ ] API Design
- [ ] Plural REST nouns used (`/api/v1/orders`).
- [ ] Status codes are accurate (201 for create, 204 for delete, 404 for missing, 422 for validation).
- [ ] Response adheres to standard envelope (`{ success, data }` or `{ success, error }`).
- [ ] List endpoints are paginated by default.

### [ ] Security & Permissions
- [ ] Object-level authorization (IDOR / BOLA) verified — users cannot access other tenants' data.
- [ ] No unparameterized queries or string interpolation into SQL.
- [ ] CORS does not use wildcard `*` with credentials enabled.
- [ ] Passwords hashed with Argon2 or bcrypt.
- [ ] Secrets strictly loaded from environment variables and `.env` is gitignored.

### [ ] Data Persistence
- [ ] No N+1 queries — eager loading applied (`select_related`, `selectinload`, `include`).
- [ ] Multi-step writes are wrapped in atomic database transactions.
- [ ] Indexes exist on foreign keys and frequently filtered columns.
- [ ] Migrations are version-controlled and tested.

### [ ] Performance & Resilience
- [ ] No blocking synchronous calls in async event loop or worker threads.
- [ ] Long-running operations offloaded to background jobs.
- [ ] Cache keys have explicit TTLs and invalidation plans.
- [ ] Strict timeouts configured on all outbound HTTP/DB calls.
- [ ] Sensitive endpoints (login/register) protected by rate limits.

### [ ] Observability
- [ ] Logs are structured JSON with consistent fields.
- [ ] Correlation ID (`X-Request-ID`) extracted or generated and logged.
- [ ] No secrets, tokens, or PII logged.
- [ ] Readiness health check verifies database and cache connectivity.

---

## 5. Anti-Patterns to Strictly Avoid

- ❌ **Phantom Test Claims**: Reporting that tests passed without executing the command and verifying test runner output.
- ❌ **Happy-Path Only Coverage**: Testing only `200 OK` responses and skipping all 4xx/5xx error paths.
- ❌ **Testing Against Production DB**: Running test suites without a dedicated isolated test database or transaction rollback.
- ❌ **Over-Mocking Everything**: Mocking the database, the ORM, the service, and the controller until the test tests nothing but mocks.
