# Lyra Store Admin Dashboard

Modern e-commerce admin dashboard built with:

- `Next.js` (App Router)
- `Tailwind CSS`
- `Supabase` (database + auth + storage)
- `Recharts` (line + pie charts)
- `react-hot-toast` (notifications)
- `next-themes` (dark/light mode)

## Features

- Responsive admin layout (sidebar + topbar + mobile drawer)
- Dashboard overview:
  - Total products
  - Total orders
  - Total revenue
  - Total customers
  - Sales line chart
  - Category pie chart
- Product management:
  - Add/Edit/Delete product
  - Fields: name, price, stock, category, image upload
  - Search + category filter
- Order management:
  - List all orders
  - Update status (`Pending`, `Shipped`, `Delivered`)
- Customer management:
  - List users
  - Block/unblock
  - Delete profile
- Reports:
  - Daily/weekly/monthly aggregation
  - Export CSV and Excel
- Authentication:
  - Supabase email/password login
  - Admin-only route protection via middleware and server checks
- Extras:
  - Toast notifications
  - Loading states
  - Error handling

## Project Structure

```text
app/
  admin/
    login/page.tsx
    (protected)/
      layout.tsx
      page.tsx
      dashboard/page.tsx
      products/page.tsx
      orders/page.tsx
      customers/page.tsx
      reports/page.tsx
      settings/page.tsx
components/
  admin/
    admin-shell.tsx
    sidebar.tsx
    topbar.tsx
    dashboard-overview.tsx
    products-manager.tsx
    orders-manager.tsx
    customers-manager.tsx
    reports-manager.tsx
    settings-panel.tsx
    sales-chart.tsx
    category-chart.tsx
lib/
  supabase/
    client.ts
    server.ts
 proxy.ts
    proxy.ts
supabase/
  migrations/
    001_lyra_store_schema.sql
types/
  database.ts
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add env variables:

```bash
cp .env.example .env.local
```

Set values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3. Run SQL migration in Supabase SQL editor:

- `supabase/migrations/001_lyra_store_schema.sql`

4. Create an admin user:

- Sign up user with Supabase Auth.
- Ensure user has metadata: `role: "admin"` (user metadata / JWT claims source).

5. Start development server:

```bash
npm run dev
```

Open:

- Storefront: `http://localhost:3000`
- Admin login: `http://localhost:3000/admin/login`
- Admin dashboard: `http://localhost:3000/admin/dashboard`

## Notes

- Product image upload uses Supabase Storage bucket: `product-images`.
- Proxy protects all `/admin/*` routes except login.
- Existing storefront routes remain intact.
