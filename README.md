# AgencyOS (Trifusion Dynamics)

Welcome to **AgencyOS** (Trifusion Dynamics) — a comprehensive, enterprise-grade Next-Gen Agency Management System. 

This platform consolidates operations, billing, project management, client relations, HR, and powerful AI capabilities into a single unified monorepo. It is built to power modern digital agencies end-to-end.

---

## 🏗️ Architecture & Tech Stack

This project utilizes a modern **Monorepo** architecture powered by `pnpm` workspaces and **Turborepo** for optimal caching and fast build pipelines.

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Shadcn UI
  - `apps/admin-dashboard`: The core operations control panel for Admins and Employees.
  - `apps/client-portal`: The client-facing hub for tickets, invoices, and project tracking.
- **Backend**: NestJS (TypeScript) and FastAPI (Python)
  - `services/auth`: The main API Gateway, housing all business logic, RBAC, and client scope routes.
  - `services/ai-service`: A dedicated Python FastAPI microservice to handle AI integrations (LLMs, generators, analytics).
- **Database**: PostgreSQL (via Prisma ORM) and MongoDB (for NoSQL analytics), cached via Redis.
- **Shared Packages**: 
  - `packages/database`: Unified Prisma schema containing 40+ models.
  - `packages/ui`: Shared React components.

---

## 🚀 The 10 Phases of Development

This platform was constructed across 10 extensive development phases, each introducing a core operational module:

### Phase 1: Authentication & Core Setup
- Multi-role RBAC implementation (Admin, Employee, Client).
- JWT generation, refresh tokens, secure password hashing, and Next.js Auth integration.

### Phase 2: CMS & Marketing
- Public-facing components and admin controllers for Blogs, Portfolios, Services, and Testimonials.
- Form submissions feeding directly into raw marketing Leads.

### Phase 3: CRM & Client Management
- Sales pipeline mapping: from raw Leads to Quoted, Follow-up, and Won.
- Client conversions, organizational mapping, and secure Contact profiles.

### Phase 4: Projects & ERP
- Full Project management suites: Sprints, Tasks (Kanban-ready), Milestones.
- ERP Dashboards mapping resource allocations across teams.

### Phase 5: Billing & Finance
- Financial engine for Estimates, Invoices, Subscriptions, and Expenses.
- Payment recording and tracking (Pending, Partially Paid, Paid).

### Phase 6: Helpdesk & Document Management (Drive)
- Support Tickets with real-time Chat Messaging capabilities.
- FAQ system and a secure internal Document Drive (Folders/Files).

### Phase 7: HR & Payroll
- Internal employee tracking, recruitment pipelines, and candidate stages.
- Attendance (Punches), Leave requests, Salary Structures, and Payslip generation.

### Phase 8: AI Platform
- Dedicated `ai-service` (FastAPI).
- AI modules: Proposal Generator, SEO Audit, Email Writer, Meeting Summary, and AI Chat Assistant.

### Phase 9: Analytics & Automation
- Rollup aggregations for Revenue and Client metrics.
- A Workflow Automation engine (Triggers, Conditions, Actions) listening to lifecycle events (e.g., `lead.created`, `invoice.paid`).

### Phase 10: Developer API & Gateway
- Client Portal API scoped routes (ensuring Clients only access their organization's data).
- Developer Dashboard: API Key generation (bcrypt hashed), webhook dispatchers, and detailed Request Logs.

---

## 🧪 Testing & Quality Assurance

We maintain strict quality through layered testing:

1. **Unit Testing (Jest)**
   - NestJS modules are rigorously covered using `jest-mock-extended` mimicking the Prisma database interactions. Services achieve >80% coverage.
2. **E2E API Integration (Postman & Newman)**
   - Includes a robust 15-step `00-Full-Flow-Smoke-Test` Postman collection simulating the complete business lifecycle (Register -> Convert Lead -> Create Project/Invoice -> Pay -> Support Ticket -> AI -> Workflows).
   - Can be run automatically via the Newman CLI pipeline.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v20+)
- Python 3.9+ (for `ai-service`)
- `pnpm` package manager
- Docker (optional, for local Postgres/Redis/Mongo)

### 1. Installation
Install all monorepo dependencies from the root:
```bash
pnpm install
```

### 2. Environment Setup
Rename `.env.example` to `.env` in the root and `packages/database`, updating the database credentials to point to your local or hosted Postgres database.

### 3. Database Migration
Push the Prisma schema to your database and generate the Prisma Client:
```bash
pnpm --filter database db:push
pnpm --filter database db:generate
```

### 4. Running the Project
Start all services and applications concurrently via Turborepo:
```bash
pnpm run dev
```
- Admin Dashboard: `http://localhost:3000`
- Client Portal: `http://localhost:3001`
- NestJS API: `http://localhost:8000/api`
- AI Service: `http://localhost:8001`

### 5. Running Automated API Tests
To verify backend integrity locally using the mock stubs:
```bash
pnpm run test:api
```
This executes the Newman runner against the generated Postman collection.

---

*Built with ❤️ for Trifusion Dynamics.*
