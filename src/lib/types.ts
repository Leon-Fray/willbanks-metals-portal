export type OrderStatus = "cutting" | "forming" | "ready" | "queue" | "shipped";

export interface Company {
  id: string;
  name: string;
  account_number: string;
  contact_email: string;
}

export interface PortalUser {
  id: string;
  email: string;
  full_name: string;
  company_id: string;
  role: "admin" | "viewer";
  company?: Company;
}

export interface Order {
  id: string;
  order_number: string;
  company_id: string;
  description: string;
  process: string;
  status: OrderStatus;
  progress_pct: number;
  est_ship_date: string;
  created_at: string;
  line_items?: OrderLineItem[];
}

export interface OrderLineItem {
  id: string;
  order_id: string;
  material: string;
  grade: string;
  thickness: string;
  quantity: number;
  unit: string;
}

export interface Quote {
  id: string;
  company_id: string;
  quote_number: string;
  expires_at: string;
  status: "open" | "accepted" | "expired" | "extended";
  total_amount: number;
  description?: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  company_id: string;
  invoice_number: string;
  amount: number;
  due_date: string;
  paid_at: string | null;
  pdf_url: string | null;
  created_at: string;
}

export interface Alert {
  id: string;
  company_id: string;
  message: string;
  severity: "info" | "warning" | "action";
  read_at: string | null;
  created_at: string;
}

export interface DashboardStats {
  activeOrders: number;
  onFloor: number;
  readyToShip: number;
  readyOrderNumber: string | null;
  ytdOrders: number;
  ytdChange: number;
  openQuotes: number;
  quoteExpiresInDays: number | null;
}
