---
name: data-persistence
description: >
  Use when designing database schemas, writing ORM/database queries, executing
  migrations, handling atomic transactions, tuning connection pools, or diagnosing
  and eliminating N+1 query performance problems across relational and NoSQL databases.
---

# Data Persistence & Database Engineering

Databases are the bedrock of backend applications. Data integrity, query efficiency, and migration safety dictate system reliability. Always detect the active ORM or database driver and execute queries using its **exact, idiomatic syntax**.

---

## 1. ORM / Database Layer Mapping Table

| Concern | Prisma (Node/Next.js) | SQLAlchemy 2.0 (FastAPI/Python) | Django ORM (Python) | TypeORM (Node/NestJS) | Mongoose (MongoDB) |
|---|---|---|---|---|---|
| **Eager Loading (Fix N+1)** | `include: { relation: true }` | `selectinload()`, `joinedload()` | `select_related()`, `prefetch_related()` | `relations: ['relation']` | `.populate('field')` |
| **Atomic Transactions** | `prisma.$transaction([...])` | `async with session.begin():` | `with transaction.atomic():` | `dataSource.transaction(async manager => ...)` | `await session.withTransaction(...)` |
| **Migrations** | `prisma migrate dev` | `alembic revision --autogenerate` | `python manage.py makemigrations` | `typeorm migration:generate` | N/A (or `migrate-mongo`) |
| **Connection Pooling** | Managed by query engine / URL params | `create_async_engine(pool_size=20)` | `CONN_MAX_AGE` in settings | `extra: { max: 20 }` | `mongoose.connect(..., { maxPoolSize: 20 })` |
| **Indexes** | `@@index([userId, status])` | `Index('idx_user_status', 'user_id', 'status')` | `indexes = [models.Index(fields=['user', 'status'])]` | `@Index(['user', 'status'])` | `schema.index({ user: 1, status: 1 })` |

---

## 2. Eliminating the N+1 Query Problem

The N+1 problem occurs when an application executes 1 query to fetch $N$ parent records, followed by $N$ separate queries in a loop to fetch associated child records.

### Concrete Fixes by ORM:

#### Prisma
```typescript
// ❌ N+1: Executes 1 query for users, then N queries in a loop for posts
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({ where: { authorId: user.id } });
}

// ✅ FIXED: Executes 1 query with SQL JOIN or single batch IN query
const usersWithPosts = await prisma.user.findMany({
  include: { posts: true }
});
```

#### SQLAlchemy 2.0 (FastAPI)
```python
# ❌ N+1: Accessing user.posts triggers lazy-load per user
stmt = select(User)
users = (await session.scalars(stmt)).all()
for user in users:
    print(len(user.posts))

# ✅ FIXED: Eager load using selectinload (for one-to-many) or joinedload (for one-to-one)
from sqlalchemy.orm import selectinload

stmt = select(User).options(selectinload(User.posts))
users = (await session.scalars(stmt)).all()
```

#### Django ORM
```python
# ❌ N+1: Accessing post.author triggers a query for each post
posts = Post.objects.all()
for post in posts:
    print(post.author.username)

# ✅ FIXED: select_related for Foreign Key (One-to-One/Many-to-One SQL JOIN)
#          prefetch_related for Many-to-Many or reverse One-to-Many
posts = Post.objects.select_related('author').prefetch_related('tags').all()
```

#### Mongoose (MongoDB)
```javascript
// ❌ N+1: Fetching orders then querying user in loop
const orders = await Order.find();
for (const order of orders) {
  const user = await User.findById(order.userId);
}

// ✅ FIXED: Populate relation in single batch query
const ordersWithUsers = await Order.find().populate('userId');
```

---

## 3. Schema Design & Constraints

- **Foreign Key Constraints**: Always enforce relational integrity with explicit foreign keys. Define `ON DELETE RESTRICT` or `ON DELETE CASCADE` deliberately based on business rules.
- **NOT NULL by Default**: Make columns non-nullable unless `NULL` holds true semantic domain value.
- **Unique Constraints**: Guard against duplicates at the database level (`UNIQUE(email)`, `UNIQUE(tenant_id, slug)`), not only in application-level checks where race conditions can occur.

---

## 4. Strategic Indexing

- **Index all Foreign Keys**: Relational joins without indexes cause full table scans.
- **Index Filter & Sort Columns**: Add B-Tree indexes on columns used in `WHERE`, `ORDER BY`, and `GROUP BY`.
- **Composite Indexes & Column Order**: Put the highest cardinality and equality-filtered columns first: `INDEX(tenant_id, created_at)`.
- **Avoid Over-Indexing**: Every index slows down `INSERT`, `UPDATE`, and `DELETE`. Index only validated query access patterns.

---

## 5. Safe Migrations

- **Never perform destructive migrations in one step**: When renaming a column, follow expand/contract (add new column &rarr; dual-write &rarr; backfill &rarr; switch reads &rarr; drop old column).
- **Avoid table locks on large tables**: Create indexes concurrently (`CREATE INDEX CONCURRENTLY` in PostgreSQL).
- **Keep migrations reversible**: Ensure `down()` / rollback migrations are tested and functional.

---

## 6. Atomic Transactions for Multi-Step Writes

Any operation that modifies multiple tables or records must be wrapped in a transaction to prevent partial state corruption on failure:

```typescript
// Prisma Transaction Example
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData });
  await tx.inventory.update({
    where: { productId: orderData.productId },
    data: { stock: { decrement: orderData.quantity } }
  });
  await tx.auditLog.create({ data: { action: 'ORDER_CREATED', orderId: order.id } });
  return order;
});
```

---

## 7. Anti-Patterns to Strictly Avoid

- ❌ **Queries in Loops**: Calling `findUnique`, `SELECT`, or `findById` inside an array `.map()` or `for` loop.
- ❌ **Missing Foreign Key Indexes**: Forgetting to index foreign key columns that are frequently joined or filtered.
- ❌ **Multi-Step Writes Without Transactions**: Creating an order, deducting stock, and recording a payment in separate uncoordinated queries.
- ❌ **Client-Driven Pagination Offsets of 100,000+**: Using `OFFSET 500000` which forces the database to read and discard half a million rows (use cursor pagination instead).
- ❌ **Manual String SQL Query Construction**: Bypassing ORM parameterized query builders.
