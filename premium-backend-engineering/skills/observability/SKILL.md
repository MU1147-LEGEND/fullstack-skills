---
name: observability
description: >
  Use when implementing structured JSON logging, request correlation ID propagation,
  log level discipline, PII/secret redaction, liveness/readiness health check endpoints,
  or telemetry and metrics collection across backend frameworks.
---

# Backend Observability Standards

You cannot fix what you cannot see. Modern backend applications require telemetry that enables rapid debugging without guesswork. Observability consists of structured JSON logs with correlation IDs, strictly separated liveness and readiness health checks, and essential metrics.

---

## 1. Framework Tooling & Hooks Mapping Table

| Framework | Structured Logger | Correlation / Request-ID Middleware | Health Check Strategy | Telemetry Hooks |
|---|---|---|---|---|
| **Express** | `pino` / `pino-http` or `winston` | Custom middleware with `AsyncLocalStorage` | Custom `/health/ready` checking DB/Redis | OpenTelemetry Node SDK |
| **FastAPI** | `structlog` or standard `logging` with JSON formatter | `asgi-correlation-id` or custom Starlette middleware | `/health/live` & `/health/ready` endpoints | OpenTelemetry FastAPI Instrumentation |
| **Django** | `LOGGING` dict with JSON formatter (`django-structlog`) | Custom middleware attaching `request.id` | `django-health-check` package | OpenTelemetry Django Instrumentation |
| **Next.js (App Router)** | `pino` with server runtime | Custom header reading in Route Handlers | `app/api/health/ready/route.ts` | `instrumentation.ts` (`register()` hook) |

---

## 2. Structured JSON Logging

Plain text logs (`console.log("user logged in")`) cannot be efficiently queried, filtered, or indexed by log aggregators (Datadog, Grafana Loki, CloudWatch). All production logs must be emitted as newline-delimited JSON with standard fields:

### Standard Log Schema
```json
{
  "timestamp": "2026-09-25T12:00:00.123Z",
  "level": "INFO",
  "message": "User authenticated successfully",
  "service": "order-service",
  "correlation_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "context": {
    "userId": "usr_8234",
    "authMethod": "oauth_google",
    "ip": "203.0.113.19"
  }
}
```

---

## 3. Request-ID (Correlation ID) Propagation

Every inbound request must have a unique identifier that persists through every log entry, background job, and outbound service call:

1. **Extract or Generate**: Read incoming `X-Request-ID` or `traceparent` header. If missing, generate a new UUIDv4.
2. **Context Binding**: Bind the correlation ID to the execution context (using Node.js `AsyncLocalStorage` or Python `contextvars`).
3. **Log Injection**: Automatically inject `correlation_id` into every log call emitted during that request.
4. **Outbound Propagation**: Pass the same `X-Request-ID` header in any downstream HTTP/gRPC requests.
5. **Response Header**: Include `X-Request-ID` in the HTTP response headers for client tracking.

---

## 4. Log Level Discipline

Use the correct severity level for each event:

| Level | When to Use | Alerting Impact |
|---|---|---|
| **DEBUG** | Granular diagnostics (payloads, branch decisions). Disabled in production by default. | None |
| **INFO** | Normal business milestones (user signed up, order placed, server started). | None |
| **WARN** | Degraded state or recoverable issue (cache miss fallback, rate limit hit, retry attempt). | Monitored |
| **ERROR** | Operation failed unexpectedly (unhandled exception, DB query error, external API timeout). | Alerts on threshold |
| **FATAL** | Application cannot start or must terminate (database unreachable on boot, missing secret). | Immediate PagerDuty |

---

## 5. Strict Secret & PII Redaction

**Never** log sensitive credentials or personally identifiable information (PII):
- **Forbidden**: Passwords, password confirmation fields, credit card numbers, CVVs, Social Security / National ID numbers, API keys, Bearer tokens, private keys.
- **Redaction Middleware**: Configure loggers with automated masking rules:
  ```typescript
  // Pino Redaction Config
  const logger = pino({
    redact: {
      paths: ['req.headers.authorization', 'req.body.password', 'req.body.cardNumber', '*.secret'],
      censor: '[REDACTED]'
    }
  });
  ```

---

## 6. Liveness vs. Readiness Health Checks

Never create a single dumb `/health` endpoint that unconditionally returns `200 OK`. Separate liveness from readiness:

### Liveness Probe (`/health/live`)
- **Purpose**: Verifies that the HTTP process is alive and not deadlocked.
- **Implementation**: Returns `200 OK` immediately if the event loop is responsive. Does **not** check external databases or caches.
- **Orchestrator Action**: If liveness fails &rarr; Container orchestrator (Kubernetes/ECS) restarts the container.

### Readiness Probe (`/health/ready`)
- **Purpose**: Verifies that the instance is ready to receive live user traffic.
- **Implementation**: Pings the primary database and Redis with a tight timeout (e.g. 1000ms).
- **Orchestrator Action**: If readiness fails &rarr; Load balancer stops sending traffic to this node until it recovers.

```python
# FastAPI Readiness Probe Example
@app.get("/health/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    health_status = {"status": "ok", "dependencies": {}}
    try:
        await db.execute(text("SELECT 1"))
        health_status["dependencies"]["database"] = "healthy"
    except Exception as e:
        health_status["dependencies"]["database"] = "unhealthy"
        return JSONResponse(status_code=503, content=health_status)
    return health_status
```

---

## 7. Essential Metrics (The Golden Signals)

Track core performance metrics:
- **Latency**: Measure response times at the 50th, 95th, and 99th percentiles (p50, p95, p99).
- **Traffic**: Requests per second (RPS) broken down by route and status code.
- **Errors**: Ratio of 5xx errors to total requests. Alert if 5xx exceeds 1%.
- **Saturation**: Memory usage, CPU utilization, and database connection pool saturation.

---

## 8. Anti-Patterns to Avoid

- ❌ **Swallowing Exceptions Silently**: Catching an error with an empty `catch (e) {}` or `except: pass` without logging the stack trace.
- ❌ **Logging Secrets or PII**: Printing full request headers containing `Authorization: Bearer ...` or unmasked payment cards.
- ❌ **Fake Health Checks**: A `/health` endpoint that hardcodes `res.status(200).send("OK")` without verifying that the database connection is functional.
- ❌ **Unstructured String Logging**: Using `console.log("Error happened: " + err)` or `print(e)` in production backend code.
