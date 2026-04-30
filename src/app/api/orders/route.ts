import { NextResponse } from "next/server";
import { z } from "zod";

const CreateOrderSchema = z.object({
  description: z.string().min(3, "Description too short"),
  process: z.string().min(2, "Process required"),
  grade: z.string().min(1, "Steel grade required"),
  thickness: z.string().min(1, "Thickness required"),
  quantity: z.number().int().positive("Quantity must be positive"),
  unit: z.enum(["pcs", "lbs", "ft"]),
  dimensions: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET() {
  // In production: query Supabase filtered by company_id from JWT
  const { MOCK_ORDERS } = await import("@/lib/mock-data");
  return NextResponse.json({ data: MOCK_ORDERS, count: MOCK_ORDERS.length });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // In production: insert into Supabase orders table
    const newOrder = {
      id: `ord-${Date.now()}`,
      order_number: `WMI-${Math.floor(28000 + Math.random() * 1000)}`,
      company_id: "comp-001",
      description: data.description,
      process: data.process,
      status: "queue" as const,
      progress_pct: 0,
      est_ship_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      line_items: [
        {
          id: `li-${Date.now()}`,
          order_id: `ord-${Date.now()}`,
          material: `${data.grade} Steel`,
          grade: data.grade,
          thickness: data.thickness,
          quantity: data.quantity,
          unit: data.unit,
        },
      ],
    };

    return NextResponse.json({ data: newOrder }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
