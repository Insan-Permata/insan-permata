# Insan Permata - Orphanage Management System

A modern web application built with Next.js 16 for managing orphanage operations, including children profiles, staff management, and news updates.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Icons**: Lucide React

## Project Structure

```
insan-permata/
├── app/                      # Next.js App Router
│   ├── (public)/            # Public-facing pages
│   ├── (admin)/             # Admin dashboard
│   └── api/                 # API routes (if needed)
├── lib/                     # Business logic
│   ├── actions/             # Server Actions (mutations)
│   ├── repositories/        # Data access layer
│   ├── services/            # Business logic
│   └── utils/               # Utilities
├── components/              # Shared React components
├── types/                   # TypeScript type definitions
│   ├── database.ts          # Auto-generated from Supabase
│   └── index.ts             # Convenience type exports
├── data/                    # Static/mock data
└── public/                  # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd insan-permata
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory (use `.env.example` as template):

```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

> **Where to find these values:**
> - Go to your Supabase project dashboard
> - Navigate to **Settings** → **API**
> - Copy the Project URL, anon key, and service_role key

### 4. Database Setup

Run the SQL schema in your Supabase SQL Editor:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents from `docs/schema.sql` (or the SQL provided in setup docs)
4. Execute the SQL to create tables

### 5. Generate TypeScript Types

After setting up your database schema, generate TypeScript types:

```bash
npm run types:generate
```

This creates `types/database.ts` with type-safe definitions from your Supabase schema.

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Workflow

### Making Database Changes

Whenever you modify the database schema in Supabase:

1. **Make changes in Supabase SQL Editor**
   ```sql
   -- Example: Add a new column
   ALTER TABLE children ADD COLUMN nickname TEXT;
   ```

2. **Regenerate TypeScript types**
   ```bash
   npm run types:generate
   ```

3. **Update your code** to use the new schema
   - TypeScript will show errors if types don't match
   - Update repositories, actions, and components as needed

### Working with Repositories

All database queries should go through the repository layer:

```typescript
// lib/repositories/children.repository.ts
import { createClient } from '@/lib/utils/supabase/server';
import type { Child } from '@/types';

export async function getAllChildren(): Promise<Child[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
}
```

### Using Server Actions

For mutations (create, update, delete), use Server Actions:

```typescript
// lib/actions/children.actions.ts
'use server'

import { revalidatePath } from 'next/cache';
import { createChild } from '@/lib/repositories/children.repository';

export async function createChildAction(formData: FormData) {
  const child = await createChild({
    name: formData.get('name') as string,
    // ... other fields
  });
  
  revalidatePath('/our-children');
  return { success: true, data: child };
}
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run types:generate` | Generate TypeScript types from Supabase |

## Architecture Decisions

### Why Service Role Key?

This project uses Supabase's **service role key** on the server side, which bypasses Row Level Security (RLS). This approach:

- ✅ Simplifies development (no complex RLS policies)
- ✅ Gives full control over data access in Next.js code
- ✅ Keeps sensitive data secure (service key never exposed to browser)
- ✅ Allows custom privacy logic (e.g., showing age ranges instead of exact DOB)

### Privacy by Design

Sensitive data (like children's exact date of birth) is stored in the database but transformed before being shown publicly:

```typescript
// Database stores: date_of_birth: "2015-03-15"
// Public sees: ageRange: "6-8 years"
```

This is implemented in the repository layer with separate functions for admin and public access.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

This is a standard Next.js app and can be deployed to:
- Netlify
- AWS Amplify
- Self-hosted (Docker)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Support

For questions or issues, please contact the development team.

## License

Insan Permata
