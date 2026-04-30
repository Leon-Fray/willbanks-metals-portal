import { NextResponse } from "next/server";
import { z } from "zod";

const ExtendSchema = z.object({
  requested_days: z.number().int().min(7).max(30).default(14),
  reason: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const parsed = ExtendSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // In production: create extension request record in Supabase
    return NextResponse.json({
      data: { id: params.id, status: "extended", days_requested: parsed.data.requested_days },
      message: "Extension request submitted",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
