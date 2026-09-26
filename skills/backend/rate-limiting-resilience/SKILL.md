---
name: rate-limiting-resilience
description: >
  Use when safeguarding backend services against abuse, traffic spikes, or upstream
  outages using rate limiting, 429 Retry-After headers, exponential backoff with jitter,
  circuit breakers, external call timeouts, or idempotency keys across frameworks.
---

# Rate Limiting & System Resilience

Distributed systems must anticipate failure and defend against abuse. Every backend must protect its ingress with strategic rate limiting and defend its egress with strict timeouts, circuit breakers, and bounded retries. Always employ the detected framework's native ecosystem libraries.

---

## 1. Framework Tooling Mapping Table

| Concern | Express | FastAPI | Django / DRF | Next.js (App Router) |
|---|---|---|---|---|
| **Rate Limiting** | `express-rate-limit` / `rate-limiter-flexible` | `slowapi` (Limiter) | `django-ratelimit` / DRF `ScopedRateThrottle` | `@upstash/ratelimit` + Redis in `middleware.ts` |
| **Circuit Breakers** | `opossum` / `cockatiel` | `pybreaker` / `circuitbreaker` | `pybreaker` | `cockatiel` |
| **Retries + Backoff** | `async-retry` / `cockatiel` | `tenacity` | `tenacity` / `urllib3.util.retry` | `p-retry` / Fetch retry wrappers |
| **Idempotency** | Redis-based middleware | Redis dependency / guard | Redis caching in view/action | Upstash / Redis cache in route |

---

## 2. Strategic Rate Limiting & Tiering

Not all endpoints carry equal risk. Apply tiered rate limits based on resource cost and threat profile:

### Strategic Tiers
1. **Authentication Endpoints** (`/api/v1/auth/login`, `/register`, `/reset-password`):
   - **Strict**: e.g., 5 requests per 15 minutes per IP + username.
2. **Resource-Intensive / Mutating Endpoints** (`POST /api/v1/checkout`, `/export`):
   - **Moderate**: e.g., 20 requests per minute per authenticated user.
3. **Public Read Endpoints** (`GET /api/v1/products`):
   - **Relaxed**: e.g., 100-300 requests per minute per IP.

### HTTP 429 Contract & Standard Headers
When a client exceeds the limit, immediately return **HTTP 429 Too Many Requests** with standard headers:
- `Retry-After: 60` (Seconds until retry is permitted)
- `X-RateLimit-Limit: 100`
- `X-RateLimit-Remaining: 0`
- `X-RateLimit-Reset: 1774526400`

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please retry after 60 seconds."
  }
}
```

---

## 3. Retries with Exponential Backoff & Full Jitter

Blind retries cause catastrophic "thundering herd" outages and retry storms. Follow these strict rules:

### The Golden Rule of Retries
> **ONLY retry idempotent operations** (e.g. `GET`, `PUT`, `DELETE`, or requests carrying a verified `Idempotency-Key`).  
> **NEVER retry non-idempotent operations** (e.g. non-idempotent `POST /charges` or `/orders`) without idempotency protection — doing so leads to duplicate billing or double records.

### Exponential Backoff with Jitter
Add randomized jitter to avoid synchronized retry waves:
$$\text{Delay} = \text{random}(0, \min(\text{max\_backoff}, \text{base} \times 2^{\text{attempt}}))$$

```python
# FastAPI / Python with Tenacity
from tenacity import retry, stop_after_attempt, wait_random_exponential, retry_if_exception_type
import httpx

@retry(
    stop=stop_after_attempt(3),
    wait=wait_random_exponential(multiplier=1, max=10), # Backoff with jitter
    retry=retry_if_exception_type((httpx.ConnectTimeout, httpx.ReadTimeout))
)
async def fetch_idempotent_upstream_data(resource_id: str):
    async with httpx.AsyncClient(timeout=5.0) as client:
        return await client.get(f"https://api.upstream.com/data/{resource_id}")
```

---

## 4. Circuit Breakers

When a downstream third-party service or internal microservice fails continuously, trip the circuit breaker to fail fast and prevent thread pool exhaustion:

- **Closed (Normal)**: Requests pass through. Failure counts are tracked.
- **Open (Failing)**: Threshold exceeded (e.g. 50% failure over 10 calls). Incoming calls fail immediately without touching the downstream service, returning a cached or graceful fallback response.
- **Half-Open (Testing)**: After a sleep window (e.g. 30 seconds), allow a single canary request through. If successful &rarr; close circuit. If failure &rarr; reopen circuit.

---

## 5. Strict Timeouts on Every Outbound Call

A request without a timeout will hang indefinitely if an external dependency freezes, consuming connections and eventually taking down your entire server.

- **HTTP Requests**: Set explicit connection and read timeouts on every client:
  ```typescript
  // Axios
  const client = axios.create({ timeout: 5000 }); // 5 seconds maximum

  // Native Fetch with AbortSignal
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  ```
- **Database Queries**: Configure statement timeouts in your connection pool (e.g. `statement_timeout: 5000` in Postgres).

---

## 6. Idempotency Key Processing

Prevent duplicate processing of mutating operations due to network retries:
1. Client sends header: `Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000`.
2. Server checks Redis: `GET idempotency:{key}`:
   - If key status is `IN_PROGRESS` &rarr; Return `409 Conflict` (concurrent request running).
   - If key status is `COMPLETED` &rarr; Return the stored response status code and JSON payload directly.
3. If key is new:
   - Set key in Redis with state `IN_PROGRESS` (TTL e.g. 120s).
   - Execute the business logic.
   - Update key in Redis with state `COMPLETED` and response payload (TTL e.g. 24 hours).

---

## 7. Anti-Patterns to Avoid

- ❌ **No Timeout on External Calls**: Making HTTP requests or DB queries with default infinite timeouts.
- ❌ **Retrying Non-Idempotent Writes**: Retrying failed `POST /pay` calls on network drops without an idempotency key.
- ❌ **Tight Loop Retries**: Executing `while (attempts < 5) retry()` immediately without backoff and jitter.
- ❌ **Missing Retry-After Header**: Returning HTTP 429 without instructing clients when they can safely retry.
- ❌ **Uniform Rate Limits**: Applying the same rate limits to public static reads as to computationally expensive password hashing routes.
