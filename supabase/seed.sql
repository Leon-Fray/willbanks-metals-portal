-- ============================================================
-- Willbanks Metals Customer Portal — Seed Data
-- supabase/seed.sql
-- Run after: supabase db push
-- ============================================================

-- ---- Company ----
INSERT INTO companies (id, name, account_number, contact_email)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Lone Star Fabricators LLC',
  'LSF-0291',
  'j.santos@lonestarfab.com'
) ON CONFLICT (account_number) DO NOTHING;

-- ---- Auth user (create via Supabase dashboard or auth.users insert) ----
-- NOTE: In practice, create the user via Supabase Auth UI or:
--   supabase auth users create --email j.santos@lonestarfab.com --password demo1234
-- Then set app_metadata: { "company_id": "a0000000-0000-0000-0000-000000000001" }

-- ---- Portal user row (run after creating auth user) ----
-- Replace USER_UUID with the UUID from auth.users after creation
-- INSERT INTO users (id, email, full_name, company_id, role)
-- VALUES ('USER_UUID', 'j.santos@lonestarfab.com', 'J. Santos', 'a0000000-0000-0000-0000-000000000001', 'admin');

-- ---- Orders ----
INSERT INTO orders (id, order_number, company_id, description, process, status, progress_pct, est_ship_date)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'WMI-28841', 'a0000000-0000-0000-0000-000000000001',
   'Bracket plates — A36, 3/8"', 'Laser', 'cutting', 55, '2026-06-03'),
  ('b0000000-0000-0000-0000-000000000002', 'WMI-28838', 'a0000000-0000-0000-0000-000000000001',
   'Formed channels — A572-50, 1/4"', 'Press Brake', 'forming', 80, '2026-06-01'),
  ('b0000000-0000-0000-0000-000000000003', 'WMI-28834', 'a0000000-0000-0000-0000-000000000001',
   'Rolled cylinders — AR400, 1/2"', 'Plate Rolling', 'ready', 100, '2026-05-30'),
  ('b0000000-0000-0000-0000-000000000004', 'WMI-28829', 'a0000000-0000-0000-0000-000000000001',
   'Wear plates — AR500, 1"', 'Plasma', 'queue', 10, '2026-06-06')
ON CONFLICT (order_number) DO NOTHING;

-- ---- Line Items ----
INSERT INTO order_line_items (order_id, material, grade, thickness, quantity, unit)
VALUES
  ('b0000000-0000-0000-0000-000000000001', 'A36 Steel', 'A36', '3/8"', 48, 'pcs'),
  ('b0000000-0000-0000-0000-000000000002', 'A572-50 Steel', 'A572-50', '1/4"', 24, 'pcs'),
  ('b0000000-0000-0000-0000-000000000003', 'AR400 Wear Steel', 'AR400', '1/2"', 6, 'pcs'),
  ('b0000000-0000-0000-0000-000000000004', 'AR500 Wear Steel', 'AR500', '1"', 12, 'pcs');

-- ---- Quotes ----
INSERT INTO quotes (id, company_id, quote_number, description, expires_at, status, total_amount)
VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001',
   'Q-1149', '60 laser-cut gusset plates — A572-50, 3/8"',
   NOW() + INTERVAL '4 days', 'open', 4280.00),
  ('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001',
   'Q-1138', 'Plate rolling — 1/2" AR400, 36" OD cylinders (6 pcs)',
   NOW() - INTERVAL '10 days', 'accepted', 7650.00),
  ('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001',
   'Q-1122', 'Plasma cut wear plates — A36, 3/4" (24 pcs)',
   NOW() - INTERVAL '45 days', 'expired', 2190.00)
ON CONFLICT (quote_number) DO NOTHING;

-- ---- Invoices ----
INSERT INTO invoices (company_id, invoice_number, amount, due_date, paid_at, pdf_url)
VALUES
  ('a0000000-0000-0000-0000-000000000001', 'INV-2046', 7650.00,
   NOW() + INTERVAL '15 days', NULL, NULL),
  ('a0000000-0000-0000-0000-000000000001', 'INV-2031', 3120.50,
   NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days', NULL),
  ('a0000000-0000-0000-0000-000000000001', 'INV-2018', 2190.00,
   NOW() - INTERVAL '30 days', NOW() - INTERVAL '28 days', NULL);

-- ---- Alerts ----
INSERT INTO alerts (company_id, message, severity, read_at)
VALUES
  ('a0000000-0000-0000-0000-000000000001',
   'WMI-28834 is ready for pickup — rolled cylinders complete and passed QC.',
   'info', NULL),
  ('a0000000-0000-0000-0000-000000000001',
   'Quote Q-1149 expires in 4 days. Accept or request extension.',
   'warning', NULL),
  ('a0000000-0000-0000-0000-000000000001',
   'WMI-28841 material substitution note: A36 3/8" from coil run — confirm grade cert needed?',
   'action', NULL);
