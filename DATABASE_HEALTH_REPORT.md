# Tripzy Database Health Report

This report evaluates the database architecture, schema, indexes, relationship health, and scalability constraints of Tripzy's data layer.

---

## 1. Schema Design and Relationship Integrity

Tripzy uses **Prisma Schema (v6.19.3)**. The layout maps out 16 tables:
- **Authentication**: `User`, `Account`, `Session`, `VerificationToken` (standard NextAuth layout).
- **Core Entities**: `Destination`, `Mood`, `Category`, `Experience`, `DestinationMood`.
- **User Records**: `Trip`, `SavedItinerary`, `Bookmark`, `Review`, `Conversation`, `Message`.
- **Telemetry Events**: `SearchEvent`, `ViewEvent`, `PlannerEvent`, `RecommendationEvent`, `RecommendationInteraction`.

### Structural Findings & Anomaly Detection
1. **Redundancy (Trip vs SavedItinerary)**:
   - The `Trip` model and `SavedItinerary` model represent the exact same entity: a user-generated itinerary.
   - `SavedItinerary` is actively used in `shareActions.ts`, `userActions.ts`, and `analyticsActions.ts`.
   - `Trip` is only queried by `getUserTrips` inside `userActions.ts`, which is never imported or called in the frontend.
   - **Recommendation**: Drop the `Trip` table completely to remove developer confusion and clean up the database footprint.
2. **JSON Column Usage**:
   - `Destination` stores `images`, `metadata`, `bestMonths`, `travelStyles`, `activities`, and `tags` as `Json` types.
   - `SavedItinerary` stores `itinerary` as a `Json` type.
   - While JSON columns offer flexibility, they prevent native indexing of interior properties, which can impact search capabilities when query requirements scale up.

---

## 2. PostgreSQL Server Migration (RESOLVED)

Initially, the database provider was configured to use SQLite, which suffered from severe serverless ephemerality blocks on Vercel.

### Migration Status: COMPLETED
- **Provider**: Migrated from `sqlite` to `postgresql` (`provider = "postgresql"`).
- **Hosting**: Provisioned and connected to a hosted **Neon PostgreSQL** serverless instance.
- **Migration & Schema Push**: Successfully executed schema push (`npx prisma db push`). The schema is now fully synchronized with PostgreSQL.
- **Seeding**: Executed database seeding (`npx prisma db seed`) populating categories, experiences, and the 12 living chapters of India directly in PostgreSQL.
- **Production Status**: **Ready for Production Launch**. User data will now be safely persisted across all serverless containers.

---

## 3. Query Performance & Indexing

### Index Audit
Prisma currently configures indices on:
- `Destination(slug)`
- `Destination(country, city)`
- `Mood(slug)`
- `Trip(userId)`
- `SavedItinerary(userId)`

### Key Missing Indexes
- **`Bookmark(userId, destinationId)`**: Uses `@@unique([userId, destinationId])` which implicitly creates an index.
- **`Review(destinationId)`**: There is no index on `destinationId` in the `Review` table. Fetching destination details with reviews requires a full table scan.
- **`DestinationMood(destinationId)`**: No index exists on the join table for destination queries, which could degrade Atlas filtering speeds as chapter counts increase.
