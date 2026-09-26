---
name: performance-scalability
description: >
  Use when optimizing backend latency, increasing throughput, implementing caching
  (Redis/in-memory) with explicit invalidation strategies, handling non-blocking async
  I/O, configuring background worker queues, or eliminating hot-path CPU bottlenecks.
---

# Performance & Scalability

High-performance backend systems maximize throughput and minimize latency by eliminating blocking operations, adopting a strictly stateless architecture, and caching aggressively with dependable invalidation strategies. Always use the detected framework's native async primitives and ecosystem tooling.

---

## 1. Framework Async & Caching Primitives Mapping Table

| Framework | Async Model | Caching Layer | Background Jobs & Queues | In-Process Task Offloading |
|---|---|---|---|---|
| **FastAPI** | `async def` + `uvicorn` (ASGI event loop) | Redis (`redis-py` / `aioredis`) | Celery / ARQ / Dramatiq | `BackgroundTasks` (FastAPI native) |
| **Express / Fastify** | Non-blocking Event Loop (`async`/`await`) | Redis (`ioredis`) | BullMQ / Bee-Queue / Redis Streams | `setImmediate` / Worker Threads |
| **Django** | ASGI (`django-channels`) or WSGI (gunicorn) | `django.core.cache` + `django-redis` | Celery + Redis / RabbitMQ | `async def` views or Celery delay |
| **Next.js (App Router)** | Edge / Node.js Runtime Route Handlers | `unstable_cache`, Route Segment Cache | Inngest / Trigger.dev / BullMQ | Server Actions background tasks |

---

## 2. Statelessness & Horizontal Scaling

To scale horizontally across multiple instances, nodes, or serverless containers:
- **No In-Memory Session State**: Never store active user sessions, shopping carts, or authentication states in process memory (e.g. `let sessionUser = ...`).
- **Externalize Shared State**: Store session data, distributed locks, and transient shared records in an external store like **Redis**.
- **Stateless Handlers**: Any request must be processable by any instance behind the load balancer without sticky session requirements.

---

## 3. Caching Architecture & Invalidation Strategies

Caching without an explicit invalidation plan is a bug factory.

### Cache-Aside Pattern (Standard)
1. Read from cache first using a structured key: `entity:namespace:identifier` (e.g. `user:profile:10492`).
2. If hit &rarr; return cached data immediately.
3. If miss &rarr; read from database, populate cache with a mandatory **Time-To-Live (TTL)**, then return data.

```typescript
// Express / Node.js with ioredis
async function getUserProfile(userId: string): Promise<UserProfile> {
  const cacheKey = `user:profile:${userId}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const profile = await db.user.findUnique({ where: { id: userId } });
  if (profile) {
    await redis.set(cacheKey, JSON.stringify(profile), 'EX', 3600); // 1 hour TTL
  }
  return profile;
}
```

### Invalidation Strategies
- **Explicit Write Invalidation**: When modifying a resource (`PUT`, `PATCH`, `DELETE`), immediately delete or update the associated cache key: `await redis.del(cacheKey)`.
- **TTL as Safety Net**: Every cache entry must have a finite TTL (e.g. 5 minutes, 1 hour, 24 hours) to prevent permanently stale records if an invalidation event is missed.
- **Cache Stampede Prevention**: For high-traffic keys, use mutex locks (e.g. `redlock`) or stale-while-revalidate to prevent thousands of simultaneous DB queries when a key expires.

---

## 4. Non-Blocking Async I/O

- **Never Block the Event Loop**: In Node.js or Python asyncio, synchronous CPU-intensive tasks (e.g. synchronous crypto, synchronous file I/O, heavy JSON parsing) freeze the entire server thread for all concurrent users.
  ```typescript
  // ❌ BLOCKING: Freezes the entire Node.js event loop
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512');

  // ✅ NON-BLOCKING: Offloaded to worker pool
  const hash = await crypto.promises.pbkdf2(password, salt, 100000, 64, 'sha512');
  ```
- **FastAPI Thread Pooling**: In FastAPI, defining a route as synchronous `def endpoint():` runs in a thread pool, whereas `async def endpoint():` runs directly on the main event loop. Never call blocking synchronous libraries (e.g. synchronous `requests.get` or `time.sleep`) inside an `async def` route — use `httpx.AsyncClient` or `asyncio.sleep`.

---

## 5. Background Jobs & Offloading

Decouple long-running operations from the HTTP request-response cycle:
- **Offload immediately**: Email dispatch, PDF generation, image resizing, webhook fan-out, and heavy analytics calculations must be enqueued as background jobs.
- **Immediate Response**: Return `202 Accepted` with a job ID or task status URL instead of keeping the HTTP connection open for 10+ seconds.

```python
# FastAPI Native BackgroundTasks
@router.post("/reports/generate", status_code=202)
def request_report(request: ReportRequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(generate_pdf_report, request.user_id, request.date_range)
    return {"success": true, "message": "Report generation started"}
```

---

## 6. Batching & Bulk Operations

- **Bulk Database Inserts**: When creating multiple records, use `bulk_create` (Django), `createMany` (Prisma), or `execute_values` (Postgres). Never execute 1,000 individual `INSERT` statements in a loop.
- **Chunked Processing**: Process massive datasets in chunks (e.g. 500-1000 items per batch) to prevent memory spikes and out-of-memory (OOM) crashes.

---

## 7. Anti-Patterns to Avoid

- ❌ **In-Memory State on Distributed Servers**: Using local arrays or variables like `globalCache = {}` that desynchronize across multiple container instances.
- ❌ **Blocking the Request Thread**: Running synchronous file system reads (`fs.readFileSync`), heavy regexes, or unindexed array searches inside an HTTP handler.
- ❌ **Caching Without TTL or Invalidation**: Writing values to Redis without setting an expiration or eviction policy.
- ❌ **Long-Running Operations in HTTP Lifecycle**: Making the client wait 15 seconds while the backend sends 5 transactional emails synchronously.
