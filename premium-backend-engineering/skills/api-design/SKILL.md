---
name: api-design
description: >
  Use when designing, creating, or modifying RESTful APIs, HTTP endpoints,
  request/response models, input validation, status codes, pagination,
  error envelopes, API versioning, or idempotency keys across backend frameworks.
---

# API Design Standards

High-quality APIs are predictable, self-documenting, resilient, and consistent. Every endpoint must adhere to strict REST conventions, explicit boundary validation, and standardized response envelopes using the native tools of the detected framework.

---

## 1. Detect Framework & Validation Tooling

Always use the framework's standard validation and serialization tooling instead of hand-rolled checks:

| Framework | Request Validation | Response Serialization | Schema Definition |
|---|---|---|---|
| **FastAPI** | Pydantic Request Models in route params | `response_model=...` | `BaseModel`, `Field()` |
| **Express** | Zod / Joi validation middleware | Express `.json()` with DTO serializer | `z.object({ ... })` |
| **Django / DRF** | Serializers / ModelSerializers (`is_valid()`) | Serializer `.data` | `serializers.Serializer` |
| **Next.js Route Handlers** | Zod `schema.safeParse(await req.json())` | `NextResponse.json(...)` | `z.object({ ... })` |
| **NestJS** | `ValidationPipe` + `class-validator` | `ClassSerializerInterceptor` | Class with `@IsString()`, etc. |

---

## 2. REST Resource Naming & HTTP Verbs

- **Use plural nouns for resources**: `/api/v1/users`, `/api/v1/orders`. Never verbs (`/api/v1/getUsers` ❌, `/api/v1/createOrder` ❌).
- **Sub-resources for relationships**: `/api/v1/users/:userId/orders` represents orders belonging to a specific user.
- **HTTP Verb Semantics**:
  - `GET`: Safe & idempotent. Retrieve resource(s). No side effects, no request body.
  - `POST`: Create a new resource or trigger an operation. Non-idempotent by default.
  - `PUT`: Full replacement of a resource. Idempotent.
  - `PATCH`: Partial modification of an existing resource.
  - `DELETE`: Remove a resource. Idempotent.

---

## 3. Precise HTTP Status Codes

Return accurate HTTP status codes — never mask failures behind `200 OK`:

| Code | Meaning | When to Use |
|---|---|---|
| **200 OK** | Success | Standard response for successful `GET`, `PUT`, `PATCH`. |
| **201 Created** | Created | Successful `POST` creating a resource. Include `Location` header or created object. |
| **204 No Content** | No Content | Successful `DELETE` or action returning no body. |
| **400 Bad Request** | Malformed | Syntactically invalid request or malformed payload. |
| **401 Unauthorized** | Unauthenticated | Missing, expired, or invalid authentication credentials. |
| **403 Forbidden** | Unauthorized | Authenticated user lacks permission to access this resource. |
| **404 Not Found** | Not Found | Resource or route does not exist. |
| **409 Conflict** | State Conflict | Resource conflict (e.g. duplicate email, version conflict). |
| **422 Unprocessable** | Validation Error | Semantically invalid input (e.g. invalid email format, failed schema checks). |
| **429 Too Many Req** | Rate Limited | Client exceeded rate limits. Must include `Retry-After`. |
| **500 Server Error** | Internal Failure | Unexpected unhandled server exception. |

---

## 4. Unified Response & Error Envelopes

Every endpoint in the system must return a predictable JSON contract:

### Success Envelope
```json
{
  "success": true,
  "data": {
    "id": "usr_98a7fbc1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2026-09-25T12:00:00Z"
  }
}
```

### Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The submitted payload contains validation errors.",
    "details": [
      {
        "field": "email",
        "message": "Must be a valid email address"
      }
    ]
  }
}
```

---

## 5. Pagination Standards

Never return unbounded lists from database queries. Always enforce pagination with sane defaults:

### Standard Parameters
- `limit` (default: `20`, max allowed: `100`)
- **Cursor-based** (recommended for high-volume or real-time datasets): `cursor` (encoded opaque ID or timestamp).
- **Offset-based** (simple admin tables): `page` and `limit`.

### Paginated Response Structure
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "limit": 20,
    "nextCursor": "eyJpZCI6MTIzfQ==",
    "hasMore": true,
    "totalCount": 154
  }
}
```

---

## 6. API Versioning

- Version at the URI path level for breaking changes: `/api/v1/customers`.
- Keep previous versions backward-compatible; deprecate endpoints with sunset headers (`Sunset: Wed, 11 Nov 2026 00:00:00 GMT`).

---

## 7. Boundary Validation & Idempotency

### Boundary Validation
Reject bad input at the network edge before hitting services or repositories:
- Express: Apply validation middleware using Zod `schema.parse(req.body)`.
- FastAPI: Define Pydantic models with strict typing and validators.
- Django: Use DRF `serializer.is_valid(raise_exception=True)`.
- Next.js: Check with `const parsed = userSchema.safeParse(body)`.

### Idempotency Keys
For critical state-mutating requests (payments, transfers, order checkout):
- Require client header: `Idempotency-Key: <UUID>`.
- Cache the response against the key in Redis (e.g. 24h TTL).
- If the same key arrives while in-flight or completed, return the cached response without re-executing.

---

## 8. Anti-Patterns to Avoid

- ❌ **Inconsistent Error Shapes**: One route returns `{ error: "msg" }`, another returns `{ message: "msg" }`, and another returns raw HTML.
- ❌ **Unbounded List Endpoints**: Executing `SELECT * FROM items` or `find()` without `limit` / pagination parameters.
- ❌ **Hand-Rolled Validation**: Writing manual `if (!req.body.email || !req.body.email.includes('@'))` checks instead of using standard schema tools (Zod, Pydantic, DRF).
- ❌ **200 OK for Errors**: Returning HTTP 200 with `{ "status": "error", "message": "Failed" }`.
- ❌ **Leaking Sensitive Fields**: Returning password hashes, internal tokens, or database internals in response payloads.
