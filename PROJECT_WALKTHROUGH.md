# Insan Permata — Project Walkthrough

Welcome to **Insan Permata**, a modern **Orphanage Management System** designed to streamline operations and create transparency for donors. This document is a comprehensive guide to understanding the project "in and out," whether you are a developer, an administrator, or a new team member.

---

## 🏗️ 1. Project Mission & Core Vision

Insan Permata was built to solve two main challenges:
1.  **Administrative Efficiency**: Automating the management of children, staff, and news profiles to replace manual or fragmented systems.
2.  **Donor Transparency**: Providing a beautiful public portal where supporters can learn about the children (respecting privacy), meet the team, and contribute through a professional, secure payment system.

---

## 🛠️ 2. The Modern Tech Stack

To ensure performance, scalability, and high-end design, we use:

| Component | Technology | Why? |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16 (App Router)** | For lightning-fast Server Components and efficient data fetching. |
| **Language** | **TypeScript** | For type safety and better developer experience. |
| **Backend** | **Supabase** | Handles **PostgreSQL** DB, **Authentication**, and **Storage** (for images) all in one. |
| **Styling** | **Tailwind CSS 4** | To build a clean, premium, and responsive UI with ease. |
| **Payments** | **Stripe** | For a secure, industry-standard donation checkout flow. |
| **Icons** | **Lucide React** | For a consistent and modern iconography. |

---

## 🔎 3. Core Features at a Glance

### Public Portal (The "Face" of the Project)
*   **Meet the Children**: A curated list of children under our care.
*   **Meet the Staff**: Transparency about the dedicated team behind the scenes.
*   **News & Blog**: Updates on events, needs, and orphanage milestones.
*   **Support & Donations**: A sleek interface for one-time or recurring contributions.

### Admin Dashboard (The "Control Center")
*   **Secure Access**: Protected by Supabase Auth (Invite-only or Admin moderated).
*   **Management Overviews**: CRUD (Create, Read, Update, Delete) operations for children, staff, and news.
*   **Donation Tracking**: High-level view of successful contributions via Stripe webhooks.

---

## 📐 4. Technical Architecture & Patterns

We follow a **clean, decoupled architecture** to keep the code maintainable:

### 🧩 Data Flow (The Repository Pattern)
Instead of calling Supabase directly from components, we use a **Repository Layer** (`lib/repositories/`).
*   **Repositories** contain the specific SQL queries.
*   This makes it easy to change data sources or add caching in the future.

### ⚡ Mutations (Server Actions)
All database updates (like adding a new child) use **Next.js Server Actions** (`lib/actions/`). This eliminates the need for manual API route management for simple form submissions and provides a seamless "zero-client-JS" mutation experience where possible.

### 🔄 Payment Lifecycle
1.  **Public Support Page**: User selects an amount.
2.  **Stripe Checkout**: Redirects to a secure Stripe-hosted payment page.
3.  **Webhook Handler**: Stripe notifies our `/api/stripe/webhook` route upon success.
4.  **Database Sync**: Our server automatically logs the donation in the `donations` table.

---

## 🛡️ 5. Data Privacy & Ethics (Crucial!)

When managing an orphanage, **child safety is our #1 priority**.
*   **Age Ranges, Not Birthdays**: We store the exact Date of Birth (DOB) in the database for admin records, but we **never** show it publicly. Instead, we use a utility function to display an "Age Range" (e.g., "6-8 years old") on the public site.
*   **Secure Storage**: All images are stored in **Supabase Storage** with appropriate access control.
*   **Zero Public API Exposure**: Public users cannot query the database directly; they only see what the Server Components render.

---

## 📁 6. Folder Structure Breakdown

```bash
insan-permata/
├── app/                  # The "Brain" (Next.js App Router)
│   ├── (public)/        # Public-facing pages (Home, News, Support)
│   ├── (admin)/         # Secure Admin Dashboard
│   ├── api/             # API Endpoints (Stripe Webhooks)
│   └── login/           # Authentication portal
├── lib/                  # Business Logic
│   ├── actions/         # Server Actions (Mutations)
│   ├── repositories/    # Data Access Layer (Supabase Queries)
│   └── utils/           # Helper functions (Currency, Date formatting)
├── types/                # Strict TypeScript definitions
├── supabase/             # SQL Migrations and schema setup
└── public/               # Static assets (Logos, Icons)
```

---

## 🚀 7. Getting Started for Newcomers

If you are joining the development team:
1.  **Clone & Install**: `npm install`
2.  **Env Setup**: Copy `.env.example` to `.env.local` and add your keys.
3.  **Database**: Sync with Supabase using the SQL schema in `lib/utils/supabase/migrations/init.sql` (and subsequent migration files).
4.  **Codegen**: Run `npm run types:generate` to keep TypeScript in sync with your database.
5.  **Develop**: Run `npm run dev` and explore!

---

## 🌟 8. Future Roadmap

*   **Sponsorship Program**: Allowing donors to sponsor a specific child's needs.
*   **Internal Inventory**: Tracking food, medicine, and school supplies.
*   **Mobile App**: A dedicated app for staff to update records on the go.

---

*Thank you for being part of the Insan Permata mission!*
