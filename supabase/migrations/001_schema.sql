-- ============================================================
-- Willbanks Metals Customer Portal — Database Schema
-- Migration: 001_schema.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- COMPANIES
-- ============================================================
CREATE TABLE IF NOT EXISTS companies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  account_number  TEXT NOT NULL UNIQUE,
  contact_email   TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USERS (portal users, linked to Supabase Auth via id)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT NOT NULL DEFAULT '',
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  role        TEXT NOT NULL CHECK (role IN ('admin', 'viewer')) DEFAULT 'viewer',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number    TEXT NOT NULL UNIQUE,
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  description     TEXT NOT NULL,
  process         TEXT NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('cutting','forming','ready','queue','shipped')) DEFAULT 'queue',
  progress_pct    INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  est_ship_date   DATE NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_company_id_idx ON orders(company_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);

-- ============================================================
-- ORDER LINE ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS order_line_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  material    TEXT NOT NULL,
  grade       TEXT NOT NULL,
  thickness   TEXT NOT NULL,
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  unit        TEXT NOT NULL DEFAULT 'pcs',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_line_items_order_id_idx ON order_line_items(order_id);

-- ============================================================
-- QUOTES
-- ============================================================
CREATE TABLE IF NOT EXISTS quotes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  quote_number    TEXT NOT NULL UNIQUE,
  description     TEXT,
  expires_at      TIMESTAMPTZ NOT NULL,
  status          TEXT NOT NULL CHECK (status IN ('open','accepted','expired','extended')) DEFAULT 'open',
  total_amount    NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS quotes_company_id_idx ON quotes(company_id);

-- ============================================================
-- INVOICES
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id      UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  invoice_number  TEXT NOT NULL UNIQUE,
  amount          NUMERIC(12,2) NOT NULL DEFAULT 0,
  due_date        TIMESTAMPTZ NOT NULL,
  paid_at         TIMESTAMPTZ,
  pdf_url         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS invoices_company_id_idx ON invoices(company_id);

-- ============================================================
-- ALERTS
-- ============================================================
CREATE TABLE IF NOT EXISTS alerts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id  UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  message     TEXT NOT NULL,
  severity    TEXT NOT NULL CHECK (severity IN ('info','warning','action')) DEFAULT 'info',
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS alerts_company_id_idx ON alerts(company_id);
CREATE INDEX IF NOT EXISTS alerts_read_at_idx ON alerts(read_at);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Helper function: extract company_id from JWT claims
CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS UUID
LANGUAGE sql STABLE
AS $$
  SELECT (auth.jwt() -> 'app_metadata' ->> 'company_id')::UUID;
$$;

-- ---- companies: users can view their own company ----
CREATE POLICY "Users can view their own company"
  ON companies FOR SELECT
  USING (id = get_my_company_id());

-- ---- users: users can view/update their own row ----
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

-- ---- orders: company-scoped ----
CREATE POLICY "Company members can view orders"
  ON orders FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "Company admins can insert orders"
  ON orders FOR INSERT
  WITH CHECK (
    company_id = get_my_company_id()
    AND (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- ---- order_line_items: scoped via orders ----
CREATE POLICY "Company members can view line items"
  ON order_line_items FOR SELECT
  USING (
    order_id IN (
      SELECT id FROM orders WHERE company_id = get_my_company_id()
    )
  );

-- ---- quotes: company-scoped ----
CREATE POLICY "Company members can view quotes"
  ON quotes FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "Company admins can update quotes"
  ON quotes FOR UPDATE
  USING (company_id = get_my_company_id())
  WITH CHECK (company_id = get_my_company_id());

-- ---- invoices: company-scoped ----
CREATE POLICY "Company members can view invoices"
  ON invoices FOR SELECT
  USING (company_id = get_my_company_id());

-- ---- alerts: company-scoped ----
CREATE POLICY "Company members can view alerts"
  ON alerts FOR SELECT
  USING (company_id = get_my_company_id());

CREATE POLICY "Company members can mark alerts read"
  ON alerts FOR UPDATE
  USING (company_id = get_my_company_id())
  WITH CHECK (company_id = get_my_company_id());

-- ============================================================
-- REALTIME: enable publications for live subscriptions
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
