---
name: security
description: >
  Use when implementing, auditing, or refactoring backend security, authentication,
  authorization (RBAC/ABAC), object-level permissions (BOLA/IDOR), input sanitization,
  injection prevention, secrets management, CORS, security headers, or OWASP compliance.
---

# Backend Security Standards

Security is non-negotiable. Every backend application must enforce defense-in-depth grounded in the **OWASP Top 10**. Always leverage the detected framework's established, battle-tested security modules and libraries rather than hand-rolling cryptographic or authentication mechanisms.

---

## 1. Framework Security Tooling Mapping Table

| Concern | Express | FastAPI | Django / DRF | Next.js (App Router) |
|---|---|---|---|---|
| **Security Headers** | `helmet()` | `CORSMiddleware` + custom headers | `SecurityMiddleware` + `SECURE_*` settings | `next.config.js` `headers()` |
| **Authentication** | `passport`, `jsonwebtoken`, or `jose` | `OAuth2PasswordBearer` + PyJWT | `django.contrib.auth`, SimpleJWT | NextAuth.js / Auth.js / Clerk |
| **Route Protection** | Custom auth middleware | `Depends(get_current_user)` | `IsAuthenticated` permission class | `middleware.ts` route matcher |
| **Object Auth (IDOR)** | Service-level ownership query check | Policy function / DB filter | DRF `BasePermission.has_object_permission` | Server Action / Route DB ownership check |
| **Password Hashing** | `argon2` or `bcrypt` | `passlib[bcrypt]` / `argon2-cffi` | Built-in PBKDF2 / Argon2 password hasher | `bcrypt` / `argon2` |
| **CORS** | `cors({ origin: [...] })` | `CORSMiddleware(allow_origins=[...])` | `django-cors-headers` | Custom Route Handler / Middleware headers |
| **CSRF Protection** | `csurf` / double-submit cookie | Cookie SameSite=Strict / Bearer token | Django built-in `CsrfViewMiddleware` | SameSite=Strict cookies / custom header |

---

## 2. Core Security Pillars (OWASP Aligned)

### A. Authentication & Credential Storage
- **Password Hashing**: Always use Argon2id or bcrypt (cost factor &ge; 12). Never MD5, SHA-1, or plain SHA-256.
- **JWT Storage & Expiry**: Short-lived access tokens (15-60 min) with secure rotation via `httpOnly`, `Secure`, `SameSite=Strict` cookies or token refresh endpoints.

### B. Authorization & Object-Level Access Control (BOLA / IDOR)
- **Role-Based Access Control (RBAC)**: Verify roles at the controller/route guard.
- **Broken Object Level Authorization (BOLA / IDOR)**: **CRITICAL.** Never assume an authenticated user is permitted to access a record just because they have its ID:
  ```python
  # ❌ VULNERABLE: Anyone can access any invoice by tampering with invoice_id
  @router.get("/invoices/{invoice_id}")
  def get_invoice(invoice_id: str, user: User = Depends(get_current_user)):
      return db.query(Invoice).filter(Invoice.id == invoice_id).first()

  # ✅ SECURE: Scoped to the authenticated user or tenant
  @router.get("/invoices/{invoice_id}")
  def get_invoice(invoice_id: str, user: User = Depends(get_current_user)):
      invoice = db.query(Invoice).filter(
          Invoice.id == invoice_id, 
          Invoice.user_id == user.id
      ).first()
      if not invoice:
          raise HTTPException(status_code=404, detail="Invoice not found")
      return invoice
  ```

### C. Injection Prevention
- **SQL / NoSQL Injection**: Always use parameterized queries or ORM query builders. Never concatenate or interpolate user input into SQL or database queries.
  ```typescript
  // ❌ VULNERABLE
  const result = await db.query(`SELECT * FROM users WHERE email = '${req.body.email}'`);

  // ✅ SECURE: Parameterized
  const result = await db.query('SELECT * FROM users WHERE email = $1', [req.body.email]);
  ```
- **Command Injection**: Avoid executing system commands (`exec`, `spawn`, `os.system`) with untrusted input. If mandatory, pass arguments as discrete arrays, never shell strings.

### D. Secrets Management
- Secrets (`API_KEYS`, `DATABASE_URL`, `JWT_SECRET`) must exist only in environment variables or cloud secrets managers (AWS Secrets Manager, Vault).
- Verify `.env*` files are strictly listed in `.gitignore`.
- Provide an `.env.example` with dummy values for documentation.
- Never log secrets, connection strings, or tokens.

### E. CORS (Cross-Origin Resource Sharing)
- Whitelist only trusted frontend origins:
  ```typescript
  app.use(cors({
    origin: ['https://app.example.com', 'https://staging.example.com'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Idempotency-Key']
  }));
  ```
- **Never combine `origin: "*"` with `credentials: true`** — browsers will reject it, and it introduces major security vulnerabilities.

### F. Security Headers
Ensure standard defensive HTTP headers are applied to every response:
- `Content-Security-Policy`: Prevent XSS and unauthorized script execution.
- `Strict-Transport-Security`: Force HTTPS (`max-age=31536000; includeSubDomains`).
- `X-Content-Type-Options: nosniff`: Prevent MIME sniffing.
- `X-Frame-Options: DENY`: Prevent Clickjacking.

### G. Brute-Force & Credential Stuffing Defense
- Protect `/login`, `/register`, `/forgot-password`, and OTP endpoints with strict rate limiting (e.g. 5 attempts per 15 minutes per IP/email).
- Implement progressive delays or account lockouts after consecutive failed logins.

---

## 3. Anti-Patterns to Strictly Avoid

- ❌ **Trusting Client-Sent Roles/IDs**: Accepting `role: "admin"` or `userId` directly from the request body instead of extracting it from the verified server-side session or JWT.
- ❌ **String-Built Queries**: Using template strings, string concatenation, or `f-strings` to construct SQL, ORM, or shell queries.
- ❌ **Wildcard CORS with Credentials**: Setting `Access-Control-Allow-Origin: *` while accepting cookies or Authorization headers.
- ❌ **Rebuilding Native Security**: Writing custom password hashing, homegrown JWT signing algorithms, or hand-rolled CSRF tokens when the framework or standard libraries provide audited solutions.
- ❌ **Leaking Stack Traces**: Printing raw database errors, stack traces, or internal server paths in API responses in production.
